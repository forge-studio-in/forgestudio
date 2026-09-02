import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailUrl: { type: String },
    featured: { type: Boolean, default: false },
    // Expand later when building out the /work section
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
