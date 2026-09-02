import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { ContactLead } from "@/models/ContactLead";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, message } = body;

    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newLead = await ContactLead.create({
      name,
      email,
      phone,
      company,
      service,
      message,
    });

    return NextResponse.json(
      { success: true, leadId: newLead._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
