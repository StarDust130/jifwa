import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getPlanId } from "@/lib/plans";
import { resolveOwnerContext } from "@/lib/owner";

export async function GET() {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const ctx = await resolveOwnerContext(userId);
  if (!ctx)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const owner = await User.findOne({ clerkId: ctx.ownerClerkId }).lean();
  return NextResponse.json({ brandingLogo: owner?.brandingLogo || null });
}

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const ctx = await resolveOwnerContext(userId);
  if (!ctx)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owner = await User.findOne({ clerkId: ctx.ownerClerkId });
  if (!owner)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!ctx.isOwner) {
    return NextResponse.json(
      { error: "Only owner can change branding" },
      { status: 403 }
    );
  }

  const plan = getPlanId(owner.plan);
  if (plan === "free") {
    return NextResponse.json(
      { error: "Branding is available on Starter and Agency." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const logoUrl = (body?.logoUrl || "").trim();
  if (!logoUrl || !/^https?:\/\//i.test(logoUrl)) {
    return NextResponse.json(
      { error: "Provide a valid logo URL" },
      { status: 400 }
    );
  }

  owner.brandingLogo = logoUrl;
  await owner.save();

  return NextResponse.json({ success: true, brandingLogo: logoUrl });
}
