import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { assertAdminApi } from "@/lib/admin";

export async function GET() {
  const adminCheck = await assertAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;
  await connectDB();

  const totalUsers = await User.countDocuments({});
  const banned = await User.countDocuments({ isBanned: true });

  const planAggregation = await User.aggregate([
    { $group: { _id: "$plan", count: { $sum: 1 } } },
  ]);

  const roleAggregation = await User.aggregate([
    { $group: { _id: "$currentRole", count: { $sum: 1 } } },
  ]);

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const weekly = await User.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const latestUsers = await User.find(
    {},
    {
      name: 1,
      email: 1,
      plan: 1,
      currentRole: 1,
      isBanned: 1,
      createdAt: 1,
    }
  )
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  const plans: Record<string, number> = { free: 0, starter: 0, agency: 0 };
  planAggregation.forEach((item) => {
    const key = item._id || "free";
    plans[key] = item.count;
  });

  const roles: Record<string, number> = { client: 0, vendor: 0, admin: 0 };
  roleAggregation.forEach((item) => {
    const key = item._id || "client";
    roles[key] = item.count;
  });

  return NextResponse.json({
    totalUsers,
    banned,
    plans,
    roles,
    weekly,
    latestUsers: latestUsers.map((u: any) => ({
      id: u._id.toString(),
      name: u.name || "Unnamed",
      email: u.email,
      plan: u.plan || "free",
      currentRole: u.currentRole,
      isBanned: Boolean(u.isBanned),
      createdAt: u.createdAt,
    })),
  });
}
