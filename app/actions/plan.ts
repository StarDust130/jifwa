"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { Project } from "@/models/Project";
import { getPlanId, getPlanLimit, PlanId } from "@/lib/plans";

export interface PlanContext {
  plan: PlanId;
  limit: number;
  currentUsage: number;
  allowed: boolean;
}

export async function getPlanContext(): Promise<PlanContext> {
  const { userId } = auth();
  if (!userId) {
    return { plan: "free", limit: 0, currentUsage: 0, allowed: false };
  }

  await connectDB();
  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    const clerkProfile = await currentUser();
    const email =
      clerkProfile?.primaryEmailAddress?.emailAddress ||
      `${userId}@placeholder.local`;
    const name =
      `${clerkProfile?.firstName || ""} ${
        clerkProfile?.lastName || ""
      }`.trim() ||
      clerkProfile?.username ||
      email;

    user = await User.create({
      clerkId: userId,
      email,
      name,
      currentRole: "client",
      photo: clerkProfile?.imageUrl,
      plan: "free",
    });
  }
  const plan = getPlanId(user?.plan);
  const limit = getPlanLimit(plan);
  const currentUsage = await Project.countDocuments({ userId });

  return {
    plan,
    limit,
    currentUsage,
    allowed: currentUsage < limit,
  };
}
