import mongoose from "mongoose";

const ContactLeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    service: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["new", "contacted", "qualified", "closed"], 
      default: "new" 
    },
  },
  { timestamps: true }
);

export const ContactLead = mongoose.models.ContactLead || mongoose.model("ContactLead", ContactLeadSchema);
