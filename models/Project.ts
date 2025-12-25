import mongoose, { Schema, Document, Model } from "mongoose";

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

  // 👇 THESE MUST BE HERE
  vendorEmail?: string;
  vendorId?: string;
  vendorJoinedAt?: Date;

  status: "active" | "completed" | "archived";
  createdAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>({
  title: { type: String, required: true },
  due_date: { type: String, default: "TBD" },
  criteria: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in_review", "approved", "dispute"],
    default: "pending",
  },
  proof_url: { type: String },
});

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: String, required: true, index: true },
    contractName: { type: String, required: true },
    summary: { type: String },
    parties: { type: [String] },
    total_value: { type: String },
    milestones: { type: [MilestoneSchema], default: [] },

    // 👇 ENSURE THESE ARE EXACTLY LIKE THIS
    vendorEmail: { type: String, default: null },
    vendorId: { type: String, default: null },
    vendorJoinedAt: { type: Date },

    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

// 👇 FORCE RECOMPILE: Delete the old model if it exists
if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

export const Project: Model<IProject> = mongoose.model<IProject>(
  "Project",
  ProjectSchema
);
