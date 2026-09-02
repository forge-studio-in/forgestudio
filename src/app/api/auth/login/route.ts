import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { verifyPassword, generateToken, setAuthToken } from "@/lib/auth";
import { inMemoryStore } from "@/lib/memoryStore";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    let adminUser = null;

    try {
      await connectToDatabase();
      const adminDoc = await Admin.findOne({ email: cleanEmail });
      if (adminDoc) {
        const isValid = await verifyPassword(password, adminDoc.password);
        if (isValid) {
          adminUser = { id: adminDoc._id.toString(), email: adminDoc.email, name: adminDoc.name };
        }
      }
    } catch {
      // DB offline fallback
      if (cleanEmail === inMemoryStore.admin.email.toLowerCase() && password === inMemoryStore.admin.password) {
        adminUser = { id: "mem_admin", email: inMemoryStore.admin.email, name: inMemoryStore.admin.name };
      }
    }

    // Direct fallback check if not matched via DB
    if (!adminUser && cleanEmail === (process.env.ADMIN_EMAIL || "admin@forgestudio.in").toLowerCase()) {
      if (password === (process.env.ADMIN_PASSWORD || "ForgeAdmin@2024")) {
        adminUser = { id: "admin_env", email: cleanEmail, name: "Forge Admin" };
      }
    }

    if (!adminUser) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken({ id: adminUser.id, email: adminUser.email });
    await setAuthToken(token);

    return NextResponse.json({
      success: true,
      admin: adminUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
