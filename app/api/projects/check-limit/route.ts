import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ clerkId: userId });

  // Restrictions based on PART B-MVP FEATURE CUT
  const PLAN_LIMITS = {
    free: 1, //
    starter: 5, // [cite: 126]
    agency: 1000, // [cite: 132]
  };

  const currentUsage = user.activeProjects || 0;
  const limit = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS];

  return NextResponse.json({
    allowed: currentUsage < limit,
    currentUsage,
    limit,
    plan: user.plan,
  });
}
