import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getPlanId } from "@/lib/plans";
import { resolveOwnerContext } from "@/lib/owner";

const MAX_TEAM = 3;

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET() {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const ctx = await resolveOwnerContext(userId);
  if (!ctx)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const owner = await User.findOne({ clerkId: ctx.ownerClerkId }).lean();
  if (!owner)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ teamMembers: owner.teamMembers || [] });
}

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const ctx = await resolveOwnerContext(userId);
  if (!ctx)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ctx.isOwner)
    return NextResponse.json(
      { error: "Only owner can invite" },
      { status: 403 }
    );

  const user = await User.findOne({ clerkId: ctx.ownerClerkId });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const plan = getPlanId(user.plan);
  if (plan !== "agency") {
    return NextResponse.json(
      { error: "Team access is only for Agency" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const email = (body?.email || "").trim().toLowerCase();
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }

  if (email === user.email?.toLowerCase()) {
    return NextResponse.json(
      { error: "Cannot invite yourself" },
      { status: 400 }
    );
  }

  const current = user.teamMembers || [];
  if (current.includes(email)) {
    return NextResponse.json({ success: true, teamMembers: current });
  }
  if (current.length >= MAX_TEAM) {
    return NextResponse.json(
      { error: `You can invite up to ${MAX_TEAM} team members.` },
      { status: 400 }
    );
  }

  user.teamMembers = [...current, email];
  await user.save();

  // Fire-and-forget Clerk invite so the teammate can onboard
  try {
    await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL,
    });
  } catch (err) {
    console.warn("Invitation send failed", err);
  }

  return NextResponse.json({ success: true, teamMembers: user.teamMembers });
}

export async function DELETE(req: NextRequest) {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const ctx = await resolveOwnerContext(userId);
  if (!ctx)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ctx.isOwner)
    return NextResponse.json(
      { error: "Only owner can remove" },
      { status: 403 }
    );

  const user = await User.findOne({ clerkId: ctx.ownerClerkId });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const plan = getPlanId(user.plan);
  if (plan !== "agency") {
    return NextResponse.json(
      { error: "Team access is only for Agency" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const email = (body?.email || "").trim().toLowerCase();
  user.teamMembers = (user.teamMembers || []).filter(
    (e: string) => e !== email
  );
  await user.save();
  return NextResponse.json({ success: true, teamMembers: user.teamMembers });
}
