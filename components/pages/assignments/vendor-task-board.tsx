"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Calendar,
  AlertCircle,
  Eye,
  FileText,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VendorSubmitModal } from "./vendor-submit-modal";

interface VendorTaskBoardProps {
  milestones: any[];
  projectId: string; // 👈 Required String
}

export function VendorTaskBoard({
  milestones,
  projectId,
}: VendorTaskBoardProps) {
  // Sort: Dispute/Fix -> Pending -> Review -> Approved
  const sortedMilestones = [...milestones].sort((a, b) => {
    const order = { dispute: 1, pending: 2, in_review: 3, approved: 4 };
    const getOrder = (status: string) =>
      order[status as keyof typeof order] || 5;
    return getOrder(a.status) - getOrder(b.status);
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {sortedMilestones.map((milestone, index) => (
        <TaskCard
          key={milestone._id}
          milestone={milestone}
          projectId={projectId}
          index={index}
        />
      ))}
      {milestones.length === 0 && <EmptyState />}
    </div>
  );
}

function TaskCard({
  milestone,
  projectId,
  index,
}: {
  milestone: any;
  projectId: string;
  index: number;
}) {
  // ⚡️ LOCAL STATE for Instant Updates
  const [status, setStatus] = useState(milestone.status);

  const isDone = status === "approved";
  const isInReview = status === "in_review";
  const needsFix = status === "dispute";
  const isPending = status === "pending";

  const isActive = needsFix || isInReview || (isPending && index === 0);

  // Parse feedback
  const feedbackMessage = milestone.proof_notes?.includes("[CLIENT REJECTED]:")
    ? milestone.proof_notes
        .split("\n\n")[0]
        .replace("[CLIENT REJECTED]:", "")
        .trim()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative pl-12 group"
    >
      {/* Connector */}
      <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-center">
        <div
          className={cn(
            "absolute top-8 bottom-[-24px] w-[2px] transition-colors",
            isDone ? "bg-primary" : "bg-zinc-100"
          )}
        />
        <div
          className={cn(
            "relative z-10 w-8 h-8 mt-4 rounded-full border-[2px] flex items-center justify-center bg-white",
            isDone
              ? "border-emerald-500 text-emerald-600"
              : isInReview
              ? "border-blue-500 text-blue-600"
              : needsFix
              ? "border-red-500 text-red-600"
              : isActive
              ? "border-zinc-900 text-primary"
              : "border-zinc-200 text-zinc-300"
          )}
        >
          {isDone ? (
            <Check size={14} strokeWidth={3} />
          ) : needsFix ? (
            <AlertCircle size={14} />
          ) : isInReview ? (
            <Eye size={14} />
          ) : (
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-primary" : "bg-zinc-300"
              )}
            />
          )}
        </div>
      </div>

      {/* Card */}
      <div
        className={cn(
          "relative rounded-xl border transition-all overflow-hidden bg-white",
          isActive ? "border-zinc-300 shadow-lg" : "border-zinc-100"
        )}
      >
        {isActive && (
          <div
            className={cn(
              "absolute top-0 left-0 w-[4px] h-full",
              needsFix
                ? "bg-red-500"
                : isInReview
                ? "bg-blue-500"
                : isDone
                ? "bg-emerald-500"
                : "bg-zinc-800"
            )}
          />
        )}

        <div className="p-5">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                    isDone
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : isInReview
                      ? "bg-blue-50 text-blue-700 border-blue-100"
                      : needsFix
                      ? "bg-red-50 text-red-700 border-red-100"
                      : "bg-zinc-100 text-zinc-500 border-zinc-200"
                  )}
                >
                  {status.replace("_", " ")}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {milestone.amount}
                </span>
              </div>
              <h3
                className={cn(
                  "text-base font-bold",
                  isDone ? "text-zinc-400 line-through" : "text-primary"
                )}
              >
                {milestone.title}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-50 px-2 py-1 rounded border border-zinc-100">
              <Calendar size={12} /> {milestone.due_date}
            </div>
          </div>

          <p className="text-sm text-zinc-500 mb-5">{milestone.criteria}</p>

          {/* Feedback Box */}
          {needsFix && feedbackMessage && (
            <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-red-700 uppercase">
                  Client Feedback
                </p>
                <p className="text-sm text-zinc-800 font-medium">
                  "{feedbackMessage}"
                </p>
              </div>
            </div>
          )}

          {/* Action Area */}
          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            {!isDone && !isInReview && (
              <VendorSubmitModal
                milestone={milestone}
                projectId={projectId}
                onOptimisticUpdate={() => setStatus("in_review")} // 👈 Updates UI instantly
              />
            )}
            {isInReview && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                <Eye size={14} /> In Review
              </div>
            )}
            {isDone && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                <Check size={14} /> Approved
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
      <FileText size={20} className="text-zinc-300 mx-auto mb-2" />
      <p className="text-sm font-bold text-primary">No milestones yet</p>
    </div>
  );
}
