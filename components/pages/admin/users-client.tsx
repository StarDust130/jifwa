"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Lock,
  RefreshCw,
  Trash,
  Unlock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminFrame } from "./AdminFrame";
import type { AdminSummary, Plan } from "./overview-client";

export type AdminUser = {
  id: string;
  name?: string | null;
  email: string;
  plan: Plan;
  currentRole: "client" | "vendor" | "admin";
  isBanned?: boolean;
  createdAt?: string;
};

const planPill: Record<Plan, string> = {
  free: "bg-slate-100 text-slate-700 border border-slate-200",
  starter: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  agency: "bg-indigo-50 text-indigo-700 border border-indigo-200",
};

export default function UsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);

  const pageSize = 10;

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
      } catch (err) {
        toast.error("Unable to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    const debounce = setTimeout(loadUsers, 200);
    return () => clearTimeout(debounce);
  }, [search, planFilter, roleFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(users.length / pageSize));
  const pagedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, page]);

  const handlePlanChange = async (user: AdminUser, plan: Plan) => {
    const prev = users;
    const optimistic = users.map((u) =>
      u.id === user.id ? { ...u, plan } : u
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

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const user = pendingDelete;
    setPendingDelete(null);

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

  return (
    <AdminFrame
      title="Users"
      description="Search, filter, and manage accounts with guardrails."
      action={
        <Button
          variant="outline"
          size="sm"
          className="border-slate-200 text-slate-700"
          onClick={() => {
            setSearch("");
            setPlanFilter("all");
            setRoleFilter("all");
            setStatusFilter("all");
            setPage(1);
          }}
        >
          <RefreshCw size={14} className="mr-2" /> Reset
        </Button>
      }
    >
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              Directory
            </CardTitle>
            <p className="text-sm text-slate-600">
              Fine-grained controls for plans, roles, and bans.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name"
              className="w-full sm:w-64 bg-white border-slate-200 text-slate-900 placeholder:text-slate-500"
            />
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-32 bg-white border-slate-200 text-slate-700">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent
                className="bg-white text-slate-800 border border-slate-200 shadow-xl"
                align="start"
              >
                <SelectItem value="all">All plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-32 bg-white border-slate-200 text-slate-700">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent
                className="bg-white text-slate-800 border border-slate-200 shadow-xl"
                align="start"
              >
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32 bg-white border-slate-200 text-slate-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent
                className="bg-white text-slate-800 border border-slate-200 shadow-xl"
                align="start"
              >
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
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
                  <th className="text-right px-4 py-3 font-semibold">
                    Actions
                  </th>
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
                ) : pagedUsers.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-slate-500"
                      colSpan={5}
                    >
                      No users match the filters.
                    </td>
                  </tr>
                ) : (
                  pagedUsers.map((user) => (
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
                            <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                              <ShieldCheck size={12} /> Restricted · contact
                              support
                            </span>
                          )}
                          {user.createdAt && (
                            <span className="text-[11px] text-slate-500 mt-0.5">
                              Joined{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
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
                            onValueChange={(val) =>
                              handlePlanChange(user, val as Plan)
                            }
                            disabled={user.isBanned}
                          >
                            <SelectTrigger className="w-[120px] h-9 text-xs bg-white border-slate-200 text-slate-700">
                              <SelectValue placeholder="Plan" />
                            </SelectTrigger>
                            <SelectContent
                              className="bg-white text-slate-800 border border-slate-200 shadow-xl"
                              align="start"
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
                            onClick={() => handleToggleBan(user)}
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
                            onClick={() => setPendingDelete(user)}
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
                  onClick={() => setPage(Math.max(1, page - 1))}
                />
              </PaginationItem>
              {Array.from({ length: pageCount }).map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                    className="cursor-pointer"
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  onClick={() => setPage(Math.min(pageCount, page + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={() => setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. {pendingDelete?.email} will be
              removed permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminFrame>
  );
}
