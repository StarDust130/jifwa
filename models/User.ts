import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name?: string;
  photo?: string;
  // 👇 FIX: Add "admin" to the type definition
  currentRole: "client" | "vendor" | "admin";
  plan?: string;
  // Optional: Add banned flag if you implement banning
  isBanned?: boolean;
  brandingLogo?: string;
  teamMembers?: string[];
  linkedOwnerId?: string; // if member, points to owner's clerkId
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    name: { type: String },
    photo: { type: String },

    // 👇 FIX: Add "admin" to the Mongoose enum
    currentRole: {
      type: String,
      enum: ["client", "vendor", "admin"],
      default: "client",
    },

    plan: { type: String, default: "free" },
    isBanned: { type: Boolean, default: false },
    brandingLogo: { type: String },
    teamMembers: { type: [String], default: [] },
    linkedOwnerId: { type: String },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js hot reloading
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
