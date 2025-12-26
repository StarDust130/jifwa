import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMilestone {
  _id?: string;
  title: string;
  due_date: string;
  criteria: string;
  amount?: string;
  status: "pending" | "in_review" | "approved" | "dispute";
  proof_url?: string;
  proof_notes?: string;
  completed_at?: Date;
}

export interface IProject extends Document {
  userId: string;
  contractName: string;
  summary: string;
  parties: string[];
  total_value: string;
  milestones: IMilestone[];
  vendorEmail?: string;
  vendorId?: string;
  vendorJoinedAt?: Date;
  // 👇 FIXED: Added "processing"
  status: "active" | "completed" | "archived" | "processing";
  createdAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>({
  title: { type: String, required: true },
  due_date: { type: String, default: "TBD" },
  criteria: { type: String, required: true },
  amount: { type: String },
  status: {
    type: String,
    enum: ["pending", "in_review", "approved", "dispute"],
    default: "pending",
  },
  proof_url: { type: String },
  proof_notes: { type: String },
  completed_at: { type: Date },
});

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: String, required: true, index: true },
    contractName: { type: String, required: true },
    summary: { type: String },
    parties: { type: [String] },
    total_value: { type: String },
    milestones: { type: [MilestoneSchema], default: [] },
    vendorEmail: { type: String },
    vendorId: { type: String },
    vendorJoinedAt: { type: Date },
    status: {
      type: String,
      // 👇 FIXED: Added "processing" to Mongoose Enum
      enum: ["active", "completed", "archived", "processing"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
