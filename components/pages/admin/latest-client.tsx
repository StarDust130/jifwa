"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AdminFrame } from "./AdminFrame";
import type { AdminSummary, Plan } from "./overview-client";

export default function LatestClient() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/overview", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load overview");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        toast.error("Unable to load metrics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const weeklyBars = useMemo(() => {
    if (!summary?.weekly?.length)
      return <p className="text-sm text-slate-600">No data</p>;
    const max = Math.max(...summary.weekly.map((d) => d.count), 1);
    return (
      <div className="flex items-end gap-3 h-36">
        {summary.weekly.map((d) => (
          <div key={d._id} className="flex flex-col items-center gap-1">
            <div
              className="w-10 rounded-xl bg-gradient-to-b from-amber-200 to-amber-300"
              style={{ height: `${(d.count / max) * 100}%` }}
            />
            <span className="text-[11px] text-slate-500 uppercase">
              {d._id}
            </span>
          </div>
        ))}
      </div>
    );
  }, [summary]);

  const planChart = useMemo(() => {
    const total =
      (summary?.plans?.free || 0) +
      (summary?.plans?.starter || 0) +
      (summary?.plans?.agency || 0);
    return (
      <div className="space-y-3">
        {["free", "starter", "agency"].map((plan) => {
          const count = summary?.plans?.[plan as Plan] || 0;
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
                  className={`h-full rounded-full ${
                    plan === "free"
                      ? "bg-slate-300"
                      : plan === "starter"
                      ? "bg-emerald-400"
                      : "bg-indigo-400"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [summary]);

  return (
    <AdminFrame
      title="Latest"
      description="Recent velocity and freshest signups in one glance."
    >
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          <CardHeader className="pb-3 flex flex-col gap-1">
            <CardTitle className="text-lg font-bold text-slate-900">
              Weekly signups
            </CardTitle>
            <p className="text-sm text-slate-500">
              Track recent momentum to spot drops early.
            </p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {loading ? <Skeleton className="h-36 w-full" /> : weeklyBars}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-slate-900">
              Plan mix
            </CardTitle>
            <p className="text-sm text-slate-500">Live distribution.</p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            ) : (
              planChart
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3 flex flex-col gap-1">
          <CardTitle className="text-lg font-bold text-slate-900">
            Latest signups
          </CardTitle>
          <p className="text-sm text-slate-500">Fresh accounts this week.</p>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !summary?.latestUsers?.length ? (
            <p className="text-sm text-slate-500">No recent signups.</p>
          ) : (
            <div className="space-y-3">
              {summary.latestUsers.slice(0, 8).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 bg-slate-50"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">
                      {user.name || "Unnamed"}
                    </span>
                    <span className="text-xs text-slate-600">{user.email}</span>
                    {user.createdAt && (
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        Joined {new Date(user.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`uppercase ${
                      user.plan === "agency"
                        ? "border-indigo-200 text-indigo-700 bg-indigo-50"
                        : user.plan === "starter"
                        ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    {user.plan}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminFrame>
  );
}
