import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { getCurrentAdmin } from "@/lib/auth";
import { inMemoryStore } from "@/lib/memoryStore";

// Public: Subscribe
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    try {
      const db = await connectToDatabase();
      if (db) {
        const existing = await Subscriber.findOne({ email: cleanEmail });
        if (existing) {
          return NextResponse.json({ message: "You're already subscribed! We'll notify you when we launch." });
        }
        await Subscriber.create({ email: cleanEmail });
        return NextResponse.json({ message: "Thank you! We'll notify you when we launch." }, { status: 200 });
      }
    } catch (dbErr) {
      console.error("MongoDB Atlas error:", dbErr);
    }

    const exists = inMemoryStore.subscribers.some((s) => s.email === cleanEmail);
    if (exists) {
      return NextResponse.json({ message: "You're already subscribed! We'll notify you when we launch." });
    }

    inMemoryStore.subscribers.unshift({
      _id: "mem_" + Date.now(),
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
      source: "coming-soon",
      isActive: true,
    });

    return NextResponse.json({ message: "Thank you! We'll notify you when we launch." }, { status: 200 });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// Admin: Get all subscribers
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const db = await connectToDatabase();
      if (db) {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        const total = await Subscriber.countDocuments();
        const active = await Subscriber.countDocuments({ isActive: true });
        return NextResponse.json({ subscribers, total, active });
      }
    } catch {
      // Fall through to memory
    }

    const subs = inMemoryStore.subscribers;
    return NextResponse.json({ subscribers: subs, total: subs.length, active: subs.filter((s) => s.isActive).length });
  } catch (error) {
    console.error("Get subscribers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Admin: Delete subscriber
export async function DELETE(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    try {
      const db = await connectToDatabase();
      if (db) {
        await Subscriber.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
      }
    } catch {
      // Fall through to memory
    }

    inMemoryStore.subscribers = inMemoryStore.subscribers.filter((s) => s._id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
