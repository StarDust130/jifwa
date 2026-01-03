"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Crown,
  Gauge,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash,
  Unlock,
  Users,
  Wallet2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type Plan = "free" | "starter" | "agency";
type SectionId = "overview" | "latest" | "users";

type AdminUser = {
  id: string;
  name?: string | null;
  email: string;
  plan: Plan;
  currentRole: "client" | "vendor" | "admin";
  isBanned?: boolean;
  createdAt?: string;
};

type AdminSummary = {
  totalUsers?: number;
  revenue?: number;
  banned?: number;
  plans?: Record<Plan, number>;
  weekly?: { _id: string; count: number }[];
  latestUsers?: AdminUser[];
};

type OverviewSectionProps = {
  loading: boolean;
  summary: AdminSummary | null;
  weeklySparkline: string;
  timeframe: string;
  onTimeframeChange: (value: string) => void;
};

type GrowthSectionProps = {
  summary: AdminSummary | null;
};

type UsersSectionProps = {
  search: string;
  planFilter: string;
  roleFilter: string;
  statusFilter: string;
  loadingUsers: boolean;
  users: AdminUser[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;
  onPlanFilterChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onResetFilters: () => void;
  onPlanChange: (user: AdminUser, plan: Plan) => void;
  onToggleBan: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

const navSections: SectionId[] = ["overview", "latest", "users"];

const planPill: Record<Plan, string> = {
  free: "bg-slate-100 text-slate-700 border border-slate-200",
  starter: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  agency: "bg-indigo-50 text-indigo-700 border border-indigo-200",
};

const DesktopNav = ({
  sections,
  active,
  onNavigate,
}: {
  sections: SectionId[];
  active: SectionId;
  onNavigate: (section: SectionId) => void;
}) => (
  <div className="hidden lg:flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sticky top-6">
    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 px-2">
      Quick jump
    </p>
    {sections.map((section) => (
      <button
        key={section}
        onClick={() => onNavigate(section)}
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
          active === section
            ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        {section === "overview" && <Gauge size={14} />}
        {section === "latest" && <Sparkles size={14} />}
        {section === "users" && <Users size={14} />}
        <span className="capitalize">{section}</span>
      </button>
    ))}
  </div>
);

const MobileNav = ({
  sections,
  active,
  onNavigate,
}: {
  sections: SectionId[];
  active: SectionId;
  onNavigate: (section: SectionId) => void;
}) => (
  <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
    {sections.map((section) => (
      <button
        key={section}
        onClick={() => onNavigate(section)}
        className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold border transition ${
          active === section
            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
            : "bg-white text-slate-600 border-slate-200"
        }`}
      >
        {section === "overview" && <Gauge size={12} />}
        {section === "latest" && <Sparkles size={12} />}
        {section === "users" && <Users size={12} />}
        <span className="capitalize">{section}</span>
      </button>
    ))}
  </div>
);

const OverviewSection = ({
  loading,
  summary,
  weeklySparkline,
  timeframe,
  onTimeframeChange,
}: OverviewSectionProps) => (
  <div id="admin-overview" className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-indigo-700">
        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
        Snapshot
      </div>
      <Select value={timeframe} onValueChange={onTimeframeChange}>
        <SelectTrigger className="w-36 h-9 bg-white border border-slate-200 text-slate-700 text-xs">
          <SelectValue placeholder="Range" />
        </SelectTrigger>
        <SelectContent
          className="bg-white text-slate-800 border border-slate-200 shadow-xl"
          align="start"
          side="bottom"
        >
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
          <SelectItem value="total">Total</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {loading ? (
        [1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-200 bg-white">
            <CardHeader>
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))
      ) : (
        <>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-indigo-700">Total users</CardTitle>
              <Users size={16} className="text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{summary?.totalUsers ?? 0}</div>
              <p className="text-xs text-slate-500 mt-1">
                {summary?.weekly?.slice(-1)[0]?.count || 0} joined today
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-emerald-700">Upgrades</CardTitle>
              <ArrowUpRight size={16} className="text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">
                {(summary?.plans?.starter || 0) + (summary?.plans?.agency || 0)}
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
              <CardTitle className="text-sm text-blue-700">Security</CardTitle>
              <ShieldCheck size={16} className="text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{summary?.banned ?? 0}</div>
              <p className="text-xs text-slate-500 mt-1">Users restricted</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-amber-700">Revenue (Razorpay)</CardTitle>
              <Wallet2 size={16} className="text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">
                ₹{(summary?.revenue ?? 0).toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">Live settlement view</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>

    <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3 flex flex-col gap-1">
          <CardTitle className="text-lg font-bold text-slate-900">Weekly signups</CardTitle>
          <p className="text-sm text-slate-500">Sparkline over last 7 days</p>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="text-sm font-mono text-slate-700 truncate">
            {weeklySparkline || "No data"}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-slate-900">Live filters</CardTitle>
          <p className="text-sm text-slate-500">Switch timeframe to adjust KPIs.</p>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 text-sm text-slate-600">
          Viewing {timeframe} performance. Hook this dropdown to your API to scope metrics to the selected range.
        </CardContent>
      </Card>
    </div>
  </div>
);

const GrowthSection = ({ summary }: GrowthSectionProps) => {
  const planChart = useMemo(() => {
    const total =
      (summary?.plans?.free || 0) +
      (summary?.plans?.starter || 0) +
      (summary?.plans?.agency || 0);
    return (
      <div className="space-y-2">
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

  const weeklyBars = useMemo(() => {
    if (!summary?.weekly?.length)
      return <p className="text-sm text-slate-600">No data</p>;
    const max = Math.max(...summary.weekly.map((d) => d.count), 1);
    return (
      <div className="flex items-end gap-2 h-28">
        {summary.weekly.map((d) => (
          <div key={d._id} className="flex flex-col items-center gap-1">
            <div
              className="w-8 rounded-full bg-amber-200"
              style={{ height: `${(d.count / max) * 100}%` }}
            />
            <span className="text-[10px] text-slate-500 uppercase">
              {d._id}
            </span>
          </div>
        ))}
      </div>
    );
  }, [summary]);

  return (
    <div className="space-y-6" id="admin-latest">
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
          <CardContent className="pt-4">{weeklyBars}</CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-slate-900">
              Plan mix
            </CardTitle>
            <p className="text-sm text-slate-500">Live distribution.</p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">{planChart}</CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3 flex flex-col gap-1">
          <CardTitle className="text-lg font-bold text-slate-900">
            Latest signups
          </CardTitle>
          <p className="text-sm text-slate-500">
            Fresh accounts in the last few days.
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-3">
          {!summary?.latestUsers?.length ? (
            <p className="text-sm text-slate-500">No recent signups.</p>
          ) : (
            <div className="space-y-3">
              {summary.latestUsers.slice(0, 6).map((user) => (
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
    </div>
  );
};

const UsersSection = ({
  search,
  planFilter,
  roleFilter,
  statusFilter,
  loadingUsers,
  users,
  page,
  pageCount,
  onPageChange,
  onSearchChange,
  onPlanFilterChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onResetFilters,
  onPlanChange,
  onToggleBan,
  onDelete,
}: UsersSectionProps) => (
  <Card id="admin-users" className="border-slate-200 bg-white shadow-sm">
    <CardHeader className="pb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <CardTitle className="text-lg font-bold text-slate-900">
          User directory
        </CardTitle>
        <p className="text-sm text-slate-600">
          Search, filter, and act without leaving the page.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by email or name"
          className="w-full sm:w-64 focus-visible:ring-indigo-500 bg-white border-slate-200 text-slate-900 placeholder:text-slate-500"
        />
        <Select value={planFilter} onValueChange={onPlanFilterChange}>
          <SelectTrigger className="w-full sm:w-32 bg-white border-slate-200 text-slate-700">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent
            className="bg-white text-slate-800 border border-slate-200 shadow-xl"
            align="start"
            side="bottom"
          >
            <SelectItem value="all">All plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="agency">Agency</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-full sm:w-32 bg-white border-slate-200 text-slate-700">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent
            className="bg-white text-slate-800 border border-slate-200 shadow-xl"
            align="start"
            side="bottom"
          >
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-32 bg-white border-slate-200 text-slate-700">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent
            className="bg-white text-slate-800 border border-slate-200 shadow-xl"
            align="start"
            side="bottom"
          >
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={onResetFilters}
          className="text-slate-600 hover:bg-slate-100"
        >
          <RefreshCw size={16} />
        </Button>
      </div>
    </CardHeader>

    <Separator />

    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-800">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">User</th>
              <th className="text-left px-4 py-3 font-semibold">Plan</th>
              <th className="text-left px-4 py-3 font-semibold">Role</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-right px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-200">
                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-48" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Skeleton className="h-8 w-32 ml-auto" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-slate-500"
                  colSpan={5}
                >
                  No users match the filters.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.12 }}
                  className="border-b border-slate-200 last:border-0"
                >
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">
                        {user.name || "Unnamed"}
                      </span>
                      <span className="text-xs text-slate-600">
                        {user.email}
                      </span>
                      {user.isBanned && (
                        <span className="text-[11px] text-rose-600 font-medium">
                          Restricted · contact support to unblock
                        </span>
                      )}
                      {user.createdAt && (
                        <span className="text-[11px] text-slate-500 mt-0.5">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        planPill[user.plan]
                      }`}
                    >
                      <Crown size={12} />
                      {user.plan}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge className="bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                      {user.currentRole}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    {user.isBanned ? (
                      <Badge
                        variant="outline"
                        className="border-rose-200 text-rose-700 bg-rose-50"
                      >
                        Banned
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        Active
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        defaultValue={user.plan}
                        onValueChange={(val) => onPlanChange(user, val as Plan)}
                        disabled={user.isBanned}
                      >
                        <SelectTrigger className="w-[120px] h-9 text-xs bg-white border-slate-200 text-slate-700">
                          <SelectValue placeholder="Plan" />
                        </SelectTrigger>
                        <SelectContent
                          className="bg-white text-slate-800 border border-slate-200 shadow-xl"
                          align="start"
                          side="bottom"
                        >
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="agency">Agency</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 border-slate-200 text-slate-700 hover:bg-slate-100"
                        onClick={() => onToggleBan(user)}
                        title={user.isBanned ? "Reactivate" : "Deactivate"}
                      >
                        {user.isBanned ? (
                          <Unlock size={14} />
                        ) : (
                          <Lock size={14} />
                        )}
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => onDelete(user)}
                        title="Delete user"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </CardContent>

    <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-center bg-slate-50">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => onPageChange(Math.max(1, page - 1))}
            />
          </PaginationItem>
          {Array.from({ length: pageCount }).map((_, idx) => (
            <PaginationItem key={idx}>
              <PaginationLink
                isActive={page === idx + 1}
                onClick={() => onPageChange(idx + 1)}
                className="cursor-pointer"
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() => onPageChange(Math.min(pageCount, page + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </Card>
);

export default function AdminDashboardClient() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeframe, setTimeframe] = useState("week");
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const sectionRefs = {
    overview: useRef<HTMLDivElement | null>(null),
    latest: useRef<HTMLDivElement | null>(null),
    users: useRef<HTMLDivElement | null>(null),
  } satisfies Record<SectionId, React.RefObject<HTMLDivElement>>;

  const scrollToSection = useCallback(
    (section: SectionId) => {
      const target = sectionRefs[section]?.current;
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [sectionRefs]
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingSummary(true);
        const res = await fetch("/api/admin/overview", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load overview");
        const data = await res.json();
        setSummary(data);
      } catch (err: any) {
        toast.error("Unable to load admin overview");
      } finally {
        setLoadingSummary(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const params = new URLSearchParams();
        if (search) params.set("q", search);
        if (planFilter !== "all") params.set("plan", planFilter);
        if (roleFilter !== "all") params.set("role", roleFilter);
        if (statusFilter !== "all") params.set("status", statusFilter);
        const res = await fetch(`/api/admin/users?${params.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setUsers(data.users || []);
        setPage(1);
      } catch (err: any) {
        toast.error("Unable to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    const debounce = setTimeout(loadUsers, 200);
    return () => clearTimeout(debounce);
  }, [search, planFilter, roleFilter, statusFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id") as SectionId;
            if (id) setActiveSection(id);
          }
        });
      },
      { threshold: 0.25 }
    );

    Object.entries(sectionRefs).forEach(([, ref]) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [sectionRefs]);

  const weeklySparkline = useMemo(() => {
    if (!summary?.weekly?.length) return "";
    return summary.weekly.map((d) => `${d._id}:${d.count}`).join(" | ");
  }, [summary]);

  const handlePlanChange = async (user: AdminUser, plan: Plan) => {
    const prev = users;
    const optimistic = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            plan,
          }
        : u
    );
    setUsers(optimistic);

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    if (!res.ok) {
      toast.error("Failed to update plan");
      setUsers(prev);
      return;
    }

    toast.success(`Plan updated to ${plan}`);
  };

  const handleToggleBan = async (user: AdminUser) => {
    const next = !user.isBanned;
    const prev = users;
    const optimistic = users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            isBanned: next,
          }
        : u
    );
    setUsers(optimistic);

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBanned: next }),
    });

    if (!res.ok) {
      toast.error("Failed to update status");
      setUsers(prev);
      return;
    }

    toast.success(next ? "User deactivated" : "User reactivated");
  };

  const handleDelete = async (user: AdminUser) => {
    const confirmed = window.confirm(`Delete ${user.email}? This cannot be undone.`);
    if (!confirmed) return;

    const prev = [...users];
    setUsers(users.filter((u) => u.id !== user.id));

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Failed to delete user");
      setUsers(prev);
      return;
    }

    toast.success("User deleted");
  };

  const pagedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, page]);

  const pageCount = Math.max(1, Math.ceil(users.length / pageSize));

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="text-slate-700 hover:bg-slate-100"
              >
                <Link href="/dashboard">
                  <ArrowLeft size={16} className="mr-2" /> Back to dashboard
                </Link>
              </Button>
              <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs uppercase tracking-[0.12em] text-indigo-700">
                Admin control
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-indigo-700 uppercase tracking-[0.3em]">
              Admin Command
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Operations Control Center
            </h1>
            <p className="text-sm text-slate-600">
              Monitor users, plans, revenue, and actions in real time. Everything is locked to your admin role.
            </p>
          </div>
        </div>

        <div className="space-y-10 lg:grid lg:grid-cols-[260px,1fr] lg:gap-6">
          <DesktopNav
            sections={navSections}
            active={activeSection}
            onNavigate={scrollToSection}
          />

          <div className="space-y-10">
            <MobileNav
              sections={navSections}
              active={activeSection}
              onNavigate={scrollToSection}
            />

            <section ref={sectionRefs.overview} data-section-id="overview">
              <OverviewSection
                loading={loadingSummary}
                summary={summary}
                weeklySparkline={weeklySparkline}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
              />
            </section>

            <section ref={sectionRefs.latest} data-section-id="latest">
              <GrowthSection summary={summary} />
            </section>

            <section ref={sectionRefs.users} data-section-id="users">
              <UsersSection
                search={search}
                planFilter={planFilter}
                roleFilter={roleFilter}
                statusFilter={statusFilter}
                loadingUsers={loadingUsers}
                users={pagedUsers}
                page={page}
                pageCount={pageCount}
                onPageChange={setPage}
                onSearchChange={setSearch}
                onPlanFilterChange={setPlanFilter}
                onRoleFilterChange={setRoleFilter}
                onStatusFilterChange={setStatusFilter}
                onResetFilters={() => {
                  setSearch("");
                  setPlanFilter("all");
                  setRoleFilter("all");
                  setStatusFilter("all");
                  setPage(1);
                }}
                onPlanChange={handlePlanChange}
                onToggleBan={handleToggleBan}
                onDelete={handleDelete}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
