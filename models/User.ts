// models/User.ts
import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    plan: {
      type: String,
      enum: ["free", "starter", "agency"],
      default: "free",
    }, // Required for PDF Plans [cite: 91]
    activeProjects: { type: Number, default: 0 }, // Tracks project limits [cite: 98]
    currentRole: {
      type: String,
      enum: ["client", "vendor"],
      default: "client",
    }, // Role toggle [cite: 163, 166]
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
