"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Ban,
  CircleDollarSign,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AdminFrame } from "./AdminFrame";

export type Plan = "free" | "starter" | "agency";
export type AdminSummary = {
  totalUsers?: number;
  revenue?: number;
  banned?: number;
  plans?: Record<Plan, number>;
  weekly?: { _id: string; count: number }[];
};

const planBar: Record<Plan, string> = {
  free: "bg-slate-300",
  starter: "bg-emerald-400",
  agency: "bg-indigo-400",
};

export default function OverviewClient() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("week");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/overview", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load overview");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        toast.error("Unable to load overview");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalUsers = summary?.totalUsers ?? 0;
  const paidUsers =
    (summary?.plans?.starter || 0) + (summary?.plans?.agency || 0);
  const freeUsers = summary?.plans?.free || 0;
  const revenue = summary?.revenue ?? 0;
  const conversion = totalUsers
    ? Math.round((paidUsers / totalUsers) * 100)
    : 0;
  const banned = summary?.banned ?? 0;
  const bannedRate = totalUsers ? Math.round((banned / totalUsers) * 100) : 0;
  const arpu = paidUsers ? revenue / paidUsers : 0;
  const weekly = summary?.weekly ?? [];
  const weeklyMax = weekly.length ? Math.max(...weekly.map((d) => d.count)) : 0;
  const topDay = weekly.reduce(
    (top, day) => (day.count > (top?.count ?? -1) ? day : top),
    null as (typeof weekly)[number] | null
  );

  return (
    <AdminFrame
      title="Overview"
      description="Fast snapshot of growth, plans, and revenue."
      action={
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-32 h-9 bg-white border border-slate-200 text-slate-700 text-xs">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent
            className="bg-white text-slate-800 border border-slate-200 shadow-xl"
            align="end"
          >
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="total">Total</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-slate-200 bg-white">
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-indigo-700">
                  Total users
                </CardTitle>
                <Users size={16} className="text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-slate-900">
                  {summary?.totalUsers ?? 0}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {summary?.weekly?.slice(-1)[0]?.count || 0} joined today
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-emerald-700">
                  Upgrades
                </CardTitle>
                <ArrowUpRight size={16} className="text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-slate-900">
                  {(summary?.plans?.starter || 0) +
                    (summary?.plans?.agency || 0)}
                </div>
                <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 bg-emerald-50"
                  >
                    Starter {summary?.plans?.starter || 0}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-indigo-200 text-indigo-700 bg-indigo-50"
                  >
                    Agency {summary?.plans?.agency || 0}
                  </Badge>
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-blue-700">
                  Security
                </CardTitle>
                <ShieldCheck size={16} className="text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-slate-900">
                  {summary?.banned ?? 0}
                </div>
                <p className="text-xs text-slate-500 mt-1">Users restricted</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-amber-700">
                  Revenue (Razorpay)
                </CardTitle>
                <Wallet2 size={16} className="text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-slate-900">
                  ₹{(summary?.revenue ?? 0).toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Live settlement view
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-3 flex flex-col gap-1">
            <CardTitle className="text-lg font-bold text-slate-900">
              Weekly signups
            </CardTitle>
            <p className="text-sm text-slate-500">Sparkline over last 7 days</p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : !weekly.length ? (
              <p className="text-sm text-slate-600">No signup data yet.</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-end gap-3 h-28">
                  {weekly.map((day) => (
                    <div
                      key={day._id}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-10 rounded-full bg-indigo-100"
                        style={{
                          height: weeklyMax
                            ? `${Math.max(8, (day.count / weeklyMax) * 100)}%`
                            : "8%",
                        }}
                      />
                      <span className="text-[10px] uppercase text-slate-500">
                        {day._id}
                      </span>
                    </div>
                  ))}
                </div>
                {topDay && (
                  <p className="text-xs text-slate-600">
                    Peak: {topDay._id} with {topDay.count} signups
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-slate-900">
              Plan mix
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Distribution across plans</span>
              {!loading && (
                <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                  Paid {conversion}%
                </Badge>
              )}
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 space-y-3">
            {loading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-4 w-full" />)
            ) : !summary?.plans ? (
              <p className="text-sm text-slate-600">No plan data.</p>
            ) : (
              (Object.keys(summary.plans) as Plan[]).map((plan) => {
                const count = summary.plans?.[plan] || 0;
                const total =
                  (summary.plans?.free || 0) +
                  (summary.plans?.starter || 0) +
                  (summary.plans?.agency || 0);
                const pct = total ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={plan} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="capitalize">{plan}</span>
                      <span>
                        {count} · {pct}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${planBar[plan]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}

            {!loading && summary?.plans && (
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600">
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="font-semibold text-slate-900">{paidUsers}</p>
                  <p>Paid users</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-emerald-50 px-3 py-2">
                  <p className="font-semibold text-emerald-800">
                    ₹{revenue.toLocaleString()}
                  </p>
                  <p>Revenue</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-indigo-50 px-3 py-2">
                  <p className="font-semibold text-indigo-800">{freeUsers}</p>
                  <p>Free users</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-indigo-800 flex items-center gap-2">
                Conversion
                <TrendingUp size={14} />
              </CardTitle>
              <p className="text-xs text-slate-600 mt-1">
                Paid users vs total audience
              </p>
            </div>
            <Badge className="bg-indigo-600 text-white">{conversion}%</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-black text-slate-900">
              {conversion}%
            </div>
            <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-indigo-500"
                style={{ width: `${Math.min(conversion, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-600">
              {paidUsers} of {totalUsers} users are on paid plans.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-emerald-700 flex items-center gap-2">
                Revenue per paid user
                <CircleDollarSign size={14} />
              </CardTitle>
              <p className="text-xs text-slate-600 mt-1">Blended ARPU</p>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
              Paid {paidUsers}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-black text-slate-900">
              ₹{Math.round(arpu).toLocaleString()}
            </div>
            <p className="text-xs text-slate-600">
              Based on ₹{revenue.toLocaleString()} across paid customers.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-rose-700 flex items-center gap-2">
                Safety
                <Ban size={14} />
              </CardTitle>
              <p className="text-xs text-slate-600 mt-1">Ban rate</p>
            </div>
            <Badge className="bg-rose-50 text-rose-700 border border-rose-200">
              {banned} users
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-black text-slate-900">
              {bannedRate}%
            </div>
            <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-rose-500"
                style={{ width: `${Math.min(bannedRate, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-600">
              {bannedRate}% of the user base is restricted for safety.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminFrame>
  );
}
