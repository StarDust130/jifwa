import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { Project } from "@/models/Project"; // 👈 Import Project model
import { getPlanId, getPlanLimit } from "@/lib/plans";

export async function GET() {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const currentUsage = await Project.countDocuments({ userId: userId });

  const userPlan = getPlanId(user.plan);
  const limit = getPlanLimit(userPlan);

  return NextResponse.json({
    allowed: currentUsage < limit,
    currentUsage,
    limit,
    plan: userPlan,
  });
}
