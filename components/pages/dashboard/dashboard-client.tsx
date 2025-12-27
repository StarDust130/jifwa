"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Briefcase,
  Clock,
  Wallet,
  Zap,
  CheckCircle2,
  Calendar,
  Building2,
  MoreHorizontal,
  Plus,
  AlertCircle,
  FileText,
  ChevronRight,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// 🛠️ HELPER: The "NaN" Killer
// ------------------------------------------------------------------
const formatCurrency = (value: string | number | undefined) => {
  if (!value) return "$0";

  // 1. Convert to string
  const strVal = String(value);

  // 2. Remove everything that isn't a number or a dot (removes $, , etc)
  const cleanStr = strVal.replace(/[^0-9.-]+/g, "");

  // 3. Parse
  const num = parseFloat(cleanStr);

  // 4. Fallback to 0 if still NaN
  if (isNaN(num)) return "$0";

  // 5. Format nicely
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
};

// ------------------------------------------------------------------
// 🛠️ TYPES
// ------------------------------------------------------------------
export interface SerializedProject {
  _id: string;
  contractName: string;
  status: "active" | "completed" | "archived" | "processing" | "pending";
  createdAt: string;
  vendorEmail?: string;
  totalValue?: string | number;
  progress: number;
  clientName?: string;
  nextDeadline?: string;
  isUrgent?: boolean;
}

export interface DashboardData {
  role: "client" | "vendor";
  user: {
    name: string;
    email: string;
    photo: string;
  };
  stats: {
    totalProjects: number;
    activeCount: number;
    pendingCount: number;
    totalValue: number;
  };
  projects: SerializedProject[];
}

// ------------------------------------------------------------------
// 🎭 ANIMATION VARIANTS
// ------------------------------------------------------------------
const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVar: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 12 },
  },
};

// ------------------------------------------------------------------
// 🚀 MAIN COMPONENT
// ------------------------------------------------------------------
export default function DashboardClient({ data }: { data: DashboardData }) {
  const { role, stats, projects } = data;
  const isClient = role === "client";

  return (
    <div className="min-h-screen bg-[#F8F9FC] pb-20 font-sans">
      <motion.div
        variants={containerVar}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10"
      >
        {/* 🟢 1. HEADER */}
        <motion.div
          variants={itemVar}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                {isClient ? "Overview" : "Assignments"}
              </h1>
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  isClient
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-indigo-600 text-white border-indigo-600"
                )}
              >
                {isClient ? "Client" : "Vendor"}
              </span>
            </div>
            <p className="text-zinc-500 font-medium max-w-md">
              {isClient
                ? "Manage your active contracts and track progress."
                : "Track your upcoming deliverables and earnings."}
            </p>
          </div>

          {/* Quick Actions (Client Only) */}
          {isClient && (
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-zinc-900 text-white pl-5 pr-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-zinc-900/10 hover:bg-zinc-800 transition-all"
              >
                <Plus size={18} /> New Contract
              </motion.button>
            </Link>
          )}
        </motion.div>

        {/* 🟢 2. CLEAN STATS ROW */}
        <motion.div
          variants={itemVar}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            label="Active Projects"
            value={stats.activeCount}
            icon={Zap}
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <StatCard
            label={isClient ? "Approvals Pending" : "Due Soon"}
            value={stats.pendingCount}
            icon={Clock}
            color="text-indigo-600"
            bg="bg-indigo-50"
          />
          <StatCard
            label="Completed"
            value={stats.totalProjects - stats.activeCount}
            icon={CheckCircle2}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            label={isClient ? "Total Budget" : "Pipeline Value"}
            value={formatCurrency(stats.totalValue)}
            icon={Wallet}
            color="text-zinc-900"
            bg="bg-white border-zinc-200"
          />
        </motion.div>

        {/* 🟢 3. PROJECTS GRID */}
        <motion.div variants={itemVar} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <FileText size={20} className="text-zinc-400" />
              {isClient ? "Recent Contracts" : "Your Works"}
            </h3>
          </div>

          {projects.length === 0 ? (
            <EmptyState isClient={isClient} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) =>
                isClient ? (
                  <ClientProjectCard key={project._id} project={project} />
                ) : (
                  <VendorProjectCard key={project._id} project={project} />
                )
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ------------------------------------------------------------------
// 🧩 SUB-COMPONENTS
// ------------------------------------------------------------------

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white border border-zinc-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-default group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl", bg, color)}>
          <Icon size={22} />
        </div>
      </div>
      <div>
        <h4 className="text-3xl font-black text-zinc-900 tracking-tight">
          {value}
        </h4>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ isClient }: { isClient: boolean }) {
  return (
    <div className="py-20 text-center bg-white border-2 border-dashed border-zinc-200 rounded-3xl">
      <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Briefcase className="text-zinc-300" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900">No active contracts</h3>
      <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
        {isClient
          ? "Upload a contract PDF to let AI generate milestones."
          : "You haven't been assigned to any contracts yet."}
      </p>
      {isClient && (
        <Link
          href="/projects"
          className="inline-block mt-6 text-sm font-bold text-indigo-600 hover:underline"
        >
          Create first project &rarr;
        </Link>
      )}
    </div>
  );
}

// 👔 CLIENT CARD
function ClientProjectCard({ project }: { project: SerializedProject }) {
  return (
    <Link href={`/milestones/${project._id}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white border border-zinc-200 rounded-2xl p-6 h-full hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-300 relative"
      >
        {/* Header: Status & Menu */}
        <div className="flex justify-between items-start mb-4">
          <span
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border",
              project.status === "active"
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-zinc-50 text-zinc-400 border-zinc-100"
            )}
          >
            {project.status}
          </span>
          <MoreHorizontal
            size={16}
            className="text-zinc-300 group-hover:text-zinc-600 transition-colors"
          />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-zinc-900 mb-2  group-hover:text-indigo-600 transition-colors h-10">
          {project.contractName}
        </h3>

        {/* Vendor Info (Safe Check) */}
        <div className="mb-6">
          {project.vendorEmail ? (
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-100">
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[9px] font-bold">
                {project.vendorEmail[0].toUpperCase()}
              </div>
              <span className="truncate max-w-[180px]">
                {project.vendorEmail}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100">
              <AlertCircle size={14} /> Waiting for Vendor
            </div>
          )}
        </div>

        {/* Footer: Progress & Value */}
        <div className="mt-auto pt-4 border-t border-zinc-50">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase mb-2">
            <span>Completion</span>
            <span>{project.progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-zinc-900 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar size={12} />{" "}
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
            {/* 🛡️ FIX IS HERE: Use helper */}
            <span className="text-zinc-900 font-bold">
              {formatCurrency(project.totalValue)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// 👷 VENDOR CARD
function VendorProjectCard({ project }: { project: SerializedProject }) {
  return (
    <Link href={`/assignments/${project._id}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white border border-zinc-200 rounded-2xl p-6 h-full hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Building2 size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase">
                Client
              </p>
              <p className="text-xs font-bold text-zinc-900 leading-none truncate max-w-[120px]">
                {project.clientName || "Client"}
              </p>
            </div>
          </div>
          {project.isUrgent && (
            <div className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 animate-pulse">
              <span className="text-[10px] font-black uppercase tracking-wide">
                Urgent
              </span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-zinc-900 mb-6 line-clamp-2 group-hover:text-indigo-600 transition-colors h-14">
          {project.contractName}
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase">
              Deadline
            </p>
            <p
              className={cn(
                "text-xs font-bold mt-0.5 truncate",
                project.isUrgent ? "text-rose-600" : "text-zinc-900"
              )}
            >
              {project.nextDeadline || "None"}
            </p>
          </div>
          <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase">
              Value
            </p>
            {/* 🛡️ FIX IS HERE: Use helper */}
            <p className="text-xs font-bold text-emerald-600 mt-0.5">
              {formatCurrency(project.totalValue)}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-zinc-400">
            <span>Milestones</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
