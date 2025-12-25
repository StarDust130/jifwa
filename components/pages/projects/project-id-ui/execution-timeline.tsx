"use client";

import {
  Calendar,
  Check,
  CircleDashed,
  Clock,
  Loader2,
  ArrowRight,
  CornerDownRight,
  Play,
} from "lucide-react";
import { MilestoneActions } from "../milestone-actions";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ExecutionTimeline({
  milestones,
  isClient,
}: {
  milestones: any[];
  isClient: boolean;
}) {
  if (!milestones || milestones.length === 0) return <EmptyState />;

  // Calculate progress for the "Main Thread"
  const completedCount = milestones.filter(
    (m) => m.status === "approved"
  ).length;
  const progressPercent = Math.min(
    (completedCount / milestones.length) * 100,
    100
  );

  return (
    <div className="relative space-y-6 py-4">
      {/* --- BACKGROUND TRACK --- */}
      <div className="absolute left-[27px] sm:left-[35px] top-4 bottom-8 w-[2px] bg-zinc-100 rounded-full" />

      {/* --- PROGRESS BEAM --- */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${progressPercent}%` }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="absolute left-[27px] sm:left-[35px] top-4 w-[2px] bg-zinc-900 rounded-full z-0"
        style={{ maxHeight: "calc(100% - 60px)" }}
      />

      {milestones.map((m, i) => {
        const isDone = m.status === "approved";
        const isReview = m.status === "in_review";
        const isPending = m.status === "pending";

        // Active = In Review OR Next Pending
        const isActive =
          isReview ||
          (isPending && (i === 0 || milestones[i - 1].status === "approved"));

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative pl-[60px] sm:pl-[80px] group"
          >
            {/* --- TIMELINE NODE --- */}
            <div className="absolute left-0 top-0 w-[56px] sm:w-[70px] h-full flex flex-col items-center">
              {/* Connector Line (Horizontal) */}
              <div
                className={cn(
                  "absolute top-[22px] left-[28px] sm:left-[36px] h-[2px] w-[32px] sm:w-[44px] transition-colors duration-500",
                  isActive
                    ? "bg-zinc-900"
                    : isDone
                    ? "bg-zinc-200"
                    : "bg-zinc-100"
                )}
              />

              {/* The Circle Node */}
              <div
                className={cn(
                  "relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 bg-white mt-1",
                  isDone
                    ? "border-zinc-900 text-zinc-900"
                    : isActive
                    ? "border-zinc-900 text-zinc-900 shadow-md scale-105"
                    : "border-zinc-100 text-zinc-300"
                )}
              >
                {isDone ? (
                  <Check size={16} strokeWidth={3} />
                ) : isReview ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isActive ? (
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                ) : (
                  <span className="text-xs font-bold font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
            </div>

            {/* --- THE COMPACT CARD --- */}
            <div
              className={cn(
                "relative rounded-xl border transition-all duration-300 overflow-hidden",
                // Active State: Pop out
                isActive
                  ? "bg-white border-zinc-900 shadow-xl shadow-zinc-900/5 -translate-y-0.5"
                  : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
              )}
            >
              {/* Active Indicator Strip */}
              {isActive && (
                <div className="absolute top-0 left-0 w-[3px] h-full bg-zinc-900" />
              )}

              <div className="p-4 sm:p-5">
                {/* Header: Title + Status + Date (Compact) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <h3
                      className={cn(
                        "text-sm sm:text-base font-bold truncate",
                        isDone ? "text-zinc-500" : "text-zinc-900"
                      )}
                    >
                      {m.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    {/* Date Tag */}
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-zinc-500 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                      <Calendar size={12} className="text-zinc-400" />
                      <span>
                        {m.due_date
                          ? new Date(m.due_date).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })
                          : "TBD"}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div
                      className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border",
                        isDone
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : isReview
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-zinc-50 text-zinc-400 border-zinc-100"
                      )}
                    >
                      {isReview && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      )}
                      {isDone && <Check size={10} strokeWidth={3} />}
                      {m.status.replace("_", " ")}
                    </div>
                  </div>
                </div>

                {/* Criteria Box (Compact) */}
                <div
                  className={cn(
                    "text-xs leading-relaxed p-3 rounded-lg mb-4 transition-colors font-medium border",
                    isActive
                      ? "bg-zinc-50 border-zinc-100 text-zinc-700"
                      : "bg-white text-zinc-500 border-transparent pl-0"
                  )}
                >
                  {m.criteria}
                </div>

                {/* Action Bar (Hidden unless active/hover) */}
                <div
                  className={cn(
                    "flex items-center justify-between pt-2 border-t border-dashed border-zinc-100",
                    isActive
                      ? "opacity-100"
                      : "opacity-60 group-hover:opacity-100 transition-opacity"
                  )}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {isActive ? (
                      <span className="text-zinc-900 flex items-center gap-1">
                        <CornerDownRight size={12} /> Current Step
                      </span>
                    ) : (
                      <span>Phase {String(i + 1).padStart(2, "0")}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div>
                    <MilestoneActions
                      milestone={{ ...m, _id: m._id.toString() }}
                      isClient={isClient}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm border border-zinc-100">
        <Clock size={16} className="text-zinc-300" />
      </div>
      <p className="text-xs font-bold text-zinc-900">Roadmap Empty</p>
    </div>
  );
}
