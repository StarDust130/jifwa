"use client";

import { motion } from "framer-motion";
import {
  Check,
  Clock,
  AlertCircle,
  Loader2,
  CornerDownRight,
  Circle,
  FileText,
  Ban,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VendorSubmitModal } from "./vendor-submit-modal";

interface VendorTaskBoardProps {
  milestones: any[];
  projectId: string;
}

export function VendorTaskBoard({
  milestones,
  projectId,
}: VendorTaskBoardProps) {
  // Sort: Action Required (Fix) -> Pending -> Review -> Approved
  const sortedMilestones = [...milestones].sort((a, b) => {
    const order = {
      changes_requested: 1,
      pending: 2,
      in_review: 3,
      approved: 4,
    };
    return (
      (order[a.status as keyof typeof order] || 5) -
      (order[b.status as keyof typeof order] || 5)
    );
  });

  const total = milestones.length;
  const completed = milestones.filter((m) => m.status === "approved").length;
  const progress = Math.round((completed / total) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* 🟢 HEADER STATS */}
      <div className="flex items-end justify-between mb-10 pl-[30px] sm:pl-[40px]">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Assignment Timeline
          </h2>
          <p className="text-zinc-500 font-medium mt-1 text-sm">
            Follow the steps below to complete the contract.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">
            Total Progress
          </div>
          <div className="text-3xl font-black text-zinc-900">{progress}%</div>
        </div>
      </div>

      <div className="relative space-y-8">
        {/* --- VERTICAL TRACK LINE --- */}
        <div className="absolute left-[27px] sm:left-[35px] top-2 bottom-8 w-[2px] rounded-full" />

        {/* --- MILESTONE LOOP --- */}
        {sortedMilestones.map((milestone, index) => (
          <TimelineItem
            key={milestone._id}
            milestone={milestone}
            projectId={projectId}
            index={index}
          />
        ))}

        {milestones.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}

function TimelineItem({
  milestone,
  projectId,
  index,
}: {
  milestone: any;
  projectId: string;
  index: number;
}) {
  const isDone = milestone.status === "approved";
  const isReview = milestone.status === "in_review";
  const needsFix = milestone.status === "changes_requested";
  const isPending = milestone.status === "pending";

  // "Active" means it's the one the user should look at
  const isActive =
    needsFix ||
    (isPending && index === 0) ||
    (isPending && !isDone && !isReview && !needsFix);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-[60px] sm:pl-[80px] group"
    >
      {/* 1. TIMELINE NODE */}
      <div className="absolute left-0 top-0 w-[56px] sm:w-[70px] h-full flex flex-col items-center">
        {/* Connector Line */}
        <div
          className={cn(
            "absolute top-[22px] left-[28px] sm:left-[36px] h-[2px] w-[32px] sm:w-[44px] transition-all duration-500",
            isActive
              ? "bg-zinc-900 w-[32px]"
              : isDone
              ? "bg-emerald-200"
              : "bg-zinc-100"
          )}
        />

        {/* The Node Circle */}
        <div
          className={cn(
            "relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 bg-white shadow-sm mt-1",
            isDone
              ? "border-emerald-500 text-emerald-600"
              : needsFix
              ? "border-red-500 text-red-500 shadow-red-100"
              : isReview
              ? "border-amber-400 text-amber-500"
              : isActive
              ? "border-zinc-900 text-zinc-900 scale-110 shadow-lg"
              : "border-zinc-200 text-zinc-300"
          )}
        >
          {isDone ? (
            <Check size={18} strokeWidth={3} />
          ) : needsFix ? (
            <AlertCircle size={18} strokeWidth={3} />
          ) : isReview ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <span className="text-xs font-bold font-mono">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      {/* 2. THE CARD */}
      <div
        className={cn(
          "relative rounded-2xl border transition-all duration-300 overflow-hidden bg-white",
          isActive
            ? "border-zinc-900 shadow-xl shadow-zinc-900/5 ring-1 ring-zinc-900/5"
            : "border-zinc-200 hover:border-zinc-300 hover:shadow-md",
          needsFix && "border-red-200 bg-red-50/10"
        )}
      >
        {/* Active Strip */}
        {isActive && !needsFix && (
          <div className="absolute top-0 left-0 w-[4px] h-full bg-zinc-900" />
        )}
        {needsFix && (
          <div className="absolute top-0 left-0 w-[4px] h-full bg-red-500" />
        )}
        {isDone && (
          <div className="absolute top-0 left-0 w-[4px] h-full bg-emerald-500" />
        )}

        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={milestone.status} />
                <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">
                  {milestone.amount}
                </span>
              </div>
              <h3
                className={cn(
                  "text-lg font-bold text-zinc-900",
                  isDone && "line-through text-zinc-400"
                )}
              >
                {milestone.title}
              </h3>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100 self-start">
              <Clock size={14} className="text-zinc-400" />
              <span>
                Due {new Date(milestone.due_date).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Criteria */}
          <div className="text-sm text-zinc-600 leading-relaxed mb-6">
            {milestone.criteria}
          </div>

          {/* Feedback Section (If Rejected) */}
          {needsFix && milestone.feedback && (
            <div className="mb-6 p-4 bg-white rounded-xl border border-red-100 shadow-sm">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
                <AlertCircle size={14} /> Client Feedback
              </div>
              <p className="text-sm text-zinc-700">{milestone.feedback}</p>
            </div>
          )}

          {/* Footer / Action Area */}
          <div
            className={cn(
              "pt-4 border-t border-dashed border-zinc-100 flex items-center justify-between",
              !isActive && !isDone && !isReview && "opacity-50"
            )}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {isActive ? (
                <span className="text-zinc-900 flex items-center gap-1">
                  <CornerDownRight size={14} /> Current Task
                </span>
              ) : isDone ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <Check size={14} /> Completed
                </span>
              ) : (
                <span>Upcoming</span>
              )}
            </div>

            {/* ACTION BUTTON: Only show if allowed */}
            {!isDone && !isReview && (
              <VendorSubmitModal milestone={milestone} projectId={projectId} />
            )}

            {isReview && (
              <div className="text-amber-600 text-xs font-bold flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg">
                <Loader2 size={14} className="animate-spin" /> Pending Review
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-zinc-100 text-zinc-500 border-zinc-200",
    in_review: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    changes_requested: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border",
        styles[status as keyof typeof styles] || styles.pending
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-zinc-100">
        <FileText size={20} className="text-zinc-300" />
      </div>
      <p className="text-sm font-bold text-zinc-900">No milestones assigned</p>
    </div>
  );
}
