import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name?: string;
  photo?: string;
  // 👇 THIS WAS LIKELY MISSING OR UNDEFINED
  currentRole: "client" | "vendor";
  plan?: string;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    name: { type: String },
    photo: { type: String },
    // 👇 ADD THIS FIELD DEFINITION
    currentRole: {
      type: String,
      enum: ["client", "vendor"],
      default: "client",
    },
    plan: { type: String, default: "free" },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
