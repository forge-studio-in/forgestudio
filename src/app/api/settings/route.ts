import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { getCurrentAdmin } from "@/lib/auth";
import { inMemoryStore } from "@/lib/memoryStore";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = await SiteSettings.create(inMemoryStore.settings);
      }
      return NextResponse.json({ settings });
    }
  } catch {
    // Ignore and fallback
  }
  return NextResponse.json({ settings: inMemoryStore.settings });
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();

    try {
      const db = await connectToDatabase();
      if (db) {
        let settings = await SiteSettings.findOne();
        if (!settings) {
          settings = await SiteSettings.create(updates);
        } else {
          Object.assign(settings, updates);
          await settings.save();
        }
        return NextResponse.json({ success: true, settings });
      }
    } catch {
      // Ignore DB error
    }

    Object.assign(inMemoryStore.settings, updates);
    return NextResponse.json({ success: true, settings: inMemoryStore.settings });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
