import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { assertAdminApi } from "@/lib/admin";
import { clerkClient } from "@clerk/nextjs/server";

const ALLOWED_PLANS = ["free", "starter", "agency"];
const ALLOWED_ROLES = ["client", "vendor", "admin"];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = await assertAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;
  await connectDB();

  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (body.plan && ALLOWED_PLANS.includes(body.plan)) {
    updates.plan = body.plan;
  }

  if (body.currentRole && ALLOWED_ROLES.includes(body.currentRole)) {
    updates.currentRole = body.currentRole;
  }

  if (typeof body.isBanned === "boolean") {
    updates.isBanned = body.isBanned;
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const updated = await User.findByIdAndUpdate(params.id, updates, {
    new: true,
  }).lean<{
    _id: unknown;
    name?: string | null;
    email: string;
    currentRole: string;
    plan?: string;
    isBanned?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    clerkId?: string;
  }>();

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: updated._id.toString(),
    name: updated.name || "Unnamed",
    email: updated.email,
    currentRole: updated.currentRole,
    plan: updated.plan || "free",
    isBanned: Boolean(updated.isBanned),
    createdAt: updated.createdAt?.toISOString?.() ?? null,
    updatedAt: updated.updatedAt?.toISOString?.() ?? null,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = await assertAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;
  await connectDB();

  const user = await User.findById(params.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await User.deleteOne({ _id: params.id });

  if (user.clerkId) {
    try {
      const client = await clerkClient();
      await client.users.deleteUser(user.clerkId);
    } catch (err) {
      console.warn("Clerk delete failed", err);
    }
  }

  return NextResponse.json({ success: true });
}
