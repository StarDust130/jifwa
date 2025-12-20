import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true }, // The Link to Clerk
  email: { type: String, required: true },
  plan: { type: String, default: "free" }, // Required for PDF Plans [cite: 91]
  razorpayId: { type: String }, // Required for PDF Payments [cite: 89]
});

export default models.User || model("User", UserSchema);
