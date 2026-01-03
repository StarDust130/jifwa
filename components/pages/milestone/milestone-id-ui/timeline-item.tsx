"use client";

import { useState } from "react";
import {
  Calendar,
  Check,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
  Copy,
  Link as LinkIcon,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MilestoneActions } from "./milestone-actions-id";
import { toast } from "sonner";
import { format } from "date-fns";

export function TimelineItem({
  m,
  i,
  prevStatus,
  projectId,
  isClient,
}: {
  m: any;
  i: number;
  prevStatus: string;
  projectId: string;
  isClient: boolean;
}) {
  const [status, setStatus] = useState(m.status);
  const [isProofExpanded, setIsProofExpanded] = useState(false);

  const isDone = status === "approved";
  const isReview = status === "in_review";
  const isPending = status === "pending";
  const isDispute = status === "dispute" || status === "changes_requested";

  const isActive =
    isReview ||
    isDispute ||
    (isPending && (i === 0 || prevStatus === "approved"));

  const reviewLabel = isClient ? "Awaiting your review" : "Submitted to client";

  const statusPill = () => {
    if (isDone)
      return {
        label: "Approved",
        className: "bg-emerald-50 text-emerald-700 border-emerald-100",
      };
    if (isReview)
      return {
        label: "In review",
        className: "bg-blue-50 text-blue-700 border-blue-100",
      };
    if (isDispute)
      return {
        label: "Needs changes",
        className: "bg-red-50 text-red-700 border-red-100",
      };
    return {
      label: "Pending",
      className: "bg-zinc-50 text-zinc-500 border-zinc-100",
    };
  };

  // 🗓️ Format Date: 25 Dec 2025
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "dd MMM yyyy");
    } catch {
      return dateStr || "TBD";
    }
  };

  const handleOptimisticUpdate = (newStatus: string) => {
    setStatus(newStatus);
    if (newStatus === "approved") setIsProofExpanded(false);
  };

  // 🖼️ Helper to check if string is an image
  const isImage = (url: string) =>
    url?.startsWith("data:image") ||
    url?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="relative pl-[56px] sm:pl-[72px] group mb-8"
    >
      {/* NODE */}
      <div className="absolute left-0 top-0 w-[52px] sm:w-[66px] h-full flex flex-col items-center">
        <div
          className={cn(
            "absolute top-[22px] left-[26px] sm:left-[32px] h-[2px] w-[30px] sm:w-[40px] transition-colors",
            isActive || isDone ? "bg-zinc-900" : "bg-zinc-100"
          )}
        />
        <div
          className={cn(
            "relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all bg-white mt-1",
            isDone
              ? "border-emerald-500 text-emerald-600"
              : isReview
              ? "border-blue-500 text-blue-600"
              : isDispute
              ? "border-red-500 text-red-500"
              : isActive
              ? "border-zinc-900"
              : "border-zinc-200 text-zinc-300"
          )}
        >
          {isDone ? (
            <Check size={16} strokeWidth={3} />
          ) : isReview ? (
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
          ) : isDispute ? (
            <AlertCircle size={16} />
          ) : isActive ? (
            <Play size={14} fill="currentColor" />
          ) : (
            <span className="text-[11px] font-mono text-zinc-400">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      {/* CARD */}
      <div
        className={cn(
          "relative rounded-2xl border transition-all overflow-hidden bg-white",
          isActive || isDone ? "border-zinc-300 shadow-sm" : "border-zinc-200"
        )}
      >
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-900 leading-tight">
                {m.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                <Calendar size={12} /> Due {formatDate(m.due_date)}
              </div>
              {isReview && (
                <p className="text-xs text-blue-700 font-semibold flex items-center gap-1">
                  Vendor submission • {reviewLabel}
                </p>
              )}
            </div>
            <div
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-semibold border",
                statusPill().className
              )}
            >
              {statusPill().label}
            </div>
          </div>

          <div className="text-sm p-4 rounded-xl bg-zinc-50 text-zinc-700 leading-relaxed">
            {m.criteria}
          </div>

          {/* PROOF SECTION: IMAGE VS LINK LOGIC */}
          {(isReview || isDone) && (m.proof_url || m.proof_notes) && (
            <div className="mb-4">
              <button
                onClick={() => setIsProofExpanded(!isProofExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all text-sm font-medium text-zinc-700"
              >
                <div className="flex items-center gap-2">
                  {isImage(m.proof_url) ? (
                    <FileText size={14} className="text-blue-600" />
                  ) : (
                    <LinkIcon size={14} className="text-indigo-600" />
                  )}
                  <span>
                    {isDone ? "Approved submission" : "Review deliverable"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  {isProofExpanded ? "Hide" : "View"}
                  {isProofExpanded ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isProofExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-4 bg-white rounded-xl border border-zinc-200 space-y-4">
                      {m.proof_url && isImage(m.proof_url) ? (
                        <div className="space-y-3">
                          <div className="rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50">
                            <img
                              src={m.proof_url}
                              alt="Proof"
                              className="w-full h-auto max-h-[360px] object-contain mx-auto"
                            />
                          </div>
                          <a
                            href={m.proof_url}
                            download={`proof-${m.title}`}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition-all"
                          >
                            <Download size={14} /> Download image
                          </a>
                        </div>
                      ) : m.proof_url ? (
                        <div className="flex flex-col gap-2">
                          <p className="text-[11px] font-semibold text-zinc-500">
                            Deliverable link
                          </p>
                          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                            <div className="flex-1 truncate text-sm font-medium text-zinc-700">
                              {m.proof_url}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(m.proof_url);
                                  toast.success("Copied");
                                }}
                                className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-500 transition-all"
                                title="Copy link"
                              >
                                <Copy size={14} />
                              </button>
                              <a
                                href={m.proof_url}
                                target="_blank"
                                className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-500 transition-all"
                                title="Open link"
                              >
                                <ExternalLink size={14} />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {m.proof_notes && (
                        <div className="p-3 rounded-lg bg-indigo-50 text-zinc-700 text-sm border border-indigo-100">
                          <span className="block text-xs font-semibold text-indigo-700 mb-1">
                            Vendor notes
                          </span>
                          {m.proof_notes}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {isDispute && m.dispute_summary && (
            <div className="mb-4 p-4 rounded-xl border border-red-100 bg-red-50 text-sm text-red-800">
              <p className="text-xs font-semibold text-red-700 mb-2">
                Dispute summary
              </p>
              <p className="whitespace-pre-wrap leading-relaxed">
                {m.dispute_summary}
              </p>
            </div>
          )}

          {/* ACTION BAR: Positioned to avoid overlap with Rejection Input */}
          <div
            className={cn(
              "pt-4 border-t border-zinc-100",
              isActive ? "opacity-100" : "opacity-50 pointer-events-none"
            )}
          >
            <MilestoneActions
              milestone={{ ...m, status }}
              projectId={projectId}
              isClient={isClient}
              onUpdate={handleOptimisticUpdate}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
