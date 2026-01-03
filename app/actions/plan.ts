"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { Project } from "@/models/Project";
import { getPlanId, getPlanLimit, PlanId } from "@/lib/plans";
import { resolveOwnerContext } from "@/lib/owner";

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
  const ctx = await resolveOwnerContext(userId);
  if (!ctx) {
    return { plan: "free", limit: 0, currentUsage: 0, allowed: false };
  }

  const plan = getPlanId(ctx.ownerUser?.plan);
  const limit = getPlanLimit(plan);
  const currentUsage = await Project.countDocuments({
    userId: ctx.ownerClerkId,
  });

  return {
    plan,
    limit,
    currentUsage,
    allowed: currentUsage < limit,
  };
}
