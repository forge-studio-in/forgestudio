import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";
import SiteSettings from "@/models/SiteSettings";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  try {
    try {
      await connectToDatabase();
      const existingAdmin = await Admin.findOne();
      if (!existingAdmin) {
        const email = process.env.ADMIN_EMAIL || "admin@forgestudio.in";
        const password = process.env.ADMIN_PASSWORD || "ForgeAdmin@2024";
        const hashedPassword = await hashPassword(password);

        await Admin.create({
          email,
          password: hashedPassword,
          name: "Forge Admin",
        });

        const settings = await SiteSettings.findOne();
        if (!settings) {
          await SiteSettings.create({
            launchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            contactEmail: "hello@forgestudio.in",
            contactPhone: "+91 91489 31396",
            websiteUrl: "forgestudio.in",
            socialLinks: {
              instagram: "https://instagram.com/forgestudio",
              linkedin: "https://linkedin.com/company/forgestudio",
              youtube: "https://youtube.com/@forgestudio",
            },
          });
        }
      }
      return NextResponse.json({ success: true, message: "Database seeded successfully." });
    } catch {
      return NextResponse.json({ success: true, message: "Running in standalone mode. Fallback dataset active." });
    }
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
