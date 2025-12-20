import  { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  clientId: { type: String, required: true }, // Clerk ID
  fileUrl: { type: String, required: true }, // PDF [cite: 37]
  status: { type: String, default: "pending" },
  milestones: [
    {
      // The AI Checklist [cite: 47]
      title: String,
      status: String,
      proofUrl: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default models.Project || model("Project", ProjectSchema);
