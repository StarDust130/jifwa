import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { assertAdminApi } from "@/lib/admin";

const ALLOWED_PLANS = ["free", "starter", "agency"];
const ALLOWED_ROLES = ["client", "vendor", "admin"];

export async function GET(req: Request) {
  const adminCheck = await assertAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;
  await connectDB();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();
  const plan = searchParams.get("plan");
  const role = searchParams.get("role");
  const status = searchParams.get("status");
  const limitParam = searchParams.get("limit");
  const limit = Math.min(parseInt(limitParam || "100", 10) || 100, 500);

  const filters: Record<string, unknown> = {};

  if (query) {
    filters.$or = [
      { email: { $regex: query, $options: "i" } },
      { name: { $regex: query, $options: "i" } },
    ];
  }

  if (plan && ALLOWED_PLANS.includes(plan)) {
    filters.plan = plan;
  }

  if (role && ALLOWED_ROLES.includes(role)) {
    filters.currentRole = role;
  }

  if (status === "active") {
    filters.isBanned = { $ne: true };
  }
  if (status === "banned") {
    filters.isBanned = true;
  }

  const users = await User.find(filters)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const normalized = users.map((u: any) => ({
    id: u._id.toString(),
    name: u.name || "Unnamed",
    email: u.email,
    currentRole: u.currentRole,
    plan: u.plan || "free",
    isBanned: Boolean(u.isBanned),
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));

  return NextResponse.json({ users: normalized });
}
