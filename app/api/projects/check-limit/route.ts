import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { Project } from "@/models/Project"; // 👈 Import Project model

export async function GET() {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Restrictions based on PART B-MVP FEATURE CUT
  const PLAN_LIMITS = {
    free: 1,
    starter: 5,
    agency: 1000,
  };

  // ✅ FIX: Count the actual documents in the database
  // This resolves the TS error and ensures the count is always accurate
  const currentUsage = await Project.countDocuments({ userId: userId });

  // specific type casting to prevent index errors
  const userPlan = (user.plan || "free") as keyof typeof PLAN_LIMITS;
  const limit = PLAN_LIMITS[userPlan];

  return NextResponse.json({
    allowed: currentUsage < limit,
    currentUsage,
    limit,
    plan: user.plan,
  });
}
