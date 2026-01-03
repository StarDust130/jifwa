import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getPlanId, getPlanLimit } from "@/lib/plans";
import { resolveOwnerContext } from "@/lib/owner";

export async function GET() {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const ctx = await resolveOwnerContext(userId);
  if (!ctx)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = getPlanId(ctx.ownerUser?.plan);
  return NextResponse.json({
    plan,
    limit: getPlanLimit(plan),
    isOwner: ctx.isOwner,
    ownerId: ctx.ownerClerkId,
  });
}
