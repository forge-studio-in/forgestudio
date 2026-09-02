import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  launchDate: Date;
  contactEmail: string;
  whatsappNumber: string;
  websiteUrl: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
  isComingSoon: boolean;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    launchDate: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    contactEmail: { type: String, default: "hello@forgestudio.in" },
    whatsappNumber: { type: String, default: "+91 91489 31396" },
    websiteUrl: { type: String, default: "forgestudio.in" },
    socialLinks: {
      instagram: { type: String, default: "https://instagram.com/forgestudio" },
      facebook: { type: String, default: "https://facebook.com/forgestudio" },
      youtube: { type: String, default: "https://youtube.com/@forgestudio" },
    },
    isComingSoon: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
