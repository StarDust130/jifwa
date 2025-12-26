import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ clerkId: userId });

  const newRole = user.currentRole === "client" ? "vendor" : "client";
  user.currentRole = newRole;
  await user.save();

  return NextResponse.json({ role: newRole });
}
