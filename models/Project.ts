import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Interface for Type Safety (TypeScript)
export interface IMilestone {
  title: string;
  due_date: string;
  criteria: string;
  status: "pending" | "in_review" | "approved" | "dispute";
  proof_url?: string;
}

export interface IProject extends Document {
  userId: string;
  contractName: string;
  summary: string;
  parties: string[];
  total_value: string;
  milestones: IMilestone[];
  status: "active" | "completed" | "archived";
  createdAt: Date;
}

// 2. The Schema (MongoDB Rulebook)
const MilestoneSchema = new Schema<IMilestone>({
  title: { type: String, required: true },
  due_date: { type: String, default: "Not specified" },
  criteria: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in_review", "approved", "dispute"],
    default: "pending",
  },
  proof_url: String,
});

const ProjectSchema = new Schema<IProject>({
  userId: { type: String, required: true, index: true }, // Index for fast queries
  contractName: { type: String, required: true },
  summary: { type: String },
  parties: [String],
  total_value: { type: String },
  milestones: [MilestoneSchema],
  status: {
    type: String,
    enum: ["active", "completed", "archived"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
});

// 3. Prevent "Overwriting Model" Error in Next.js
export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
