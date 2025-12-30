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
      className="relative pl-[60px] sm:pl-[80px] group mb-8"
    >
      {/* NODE */}
      <div className="absolute left-0 top-0 w-[56px] sm:w-[70px] h-full flex flex-col items-center">
        <div
          className={cn(
            "absolute top-[22px] left-[28px] sm:left-[36px] h-[2px] w-[32px] sm:w-[44px] transition-colors",
            isActive || isDone ? "bg-primary" : "bg-zinc-100"
          )}
        />
        <div
          className={cn(
            "relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3px] flex items-center justify-center transition-all bg-white mt-1",
            isDone
              ? "border-emerald-500 text-emerald-600"
              : isReview
              ? "border-blue-500 text-blue-600"
              : isDispute
              ? "border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              : isActive
              ? "border-zinc-900 shadow-md scale-105"
              : "border-zinc-100 text-zinc-300"
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
            <span className="text-xs font-mono">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      {/* CARD */}
      <div
        className={cn(
          "relative rounded-2xl border transition-all overflow-hidden bg-white",
          isActive ? "border-zinc-900 shadow-xl" : "border-zinc-200"
        )}
      >
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <h3
                className={cn(
                  "text-base font-bold",
                  isDone ? "text-zinc-500" : "text-primary"
                )}
              >
                {m.title}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Calendar size={12} /> Due: {formatDate(m.due_date)}
              </div>
            </div>
            <div
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border w-fit",
                isDone
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : isReview
                  ? "bg-blue-50 text-blue-700 border-blue-100"
                  : isDispute
                  ? "bg-red-50 text-red-700 border-red-100"
                  : "bg-zinc-50 text-zinc-400 border-zinc-100"
              )}
            >
              {status.replace("_", " ")}
            </div>
          </div>

          <div className="text-sm p-4 rounded-xl mb-5 bg-zinc-50 border border-zinc-100 text-zinc-600 font-medium">
            {m.criteria}
          </div>

          {/* PROOF SECTION: IMAGE VS LINK LOGIC */}
          {(isReview || isDone) && (m.proof_url || m.proof_notes) && (
            <div className="mb-6">
              <button
                onClick={() => setIsProofExpanded(!isProofExpanded)}
                className="w-full flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
                  {isImage(m.proof_url) ? (
                    <FileText size={14} className="text-blue-500" />
                  ) : (
                    <LinkIcon size={14} className="text-indigo-500" />
                  )}
                  {isDone ? "Approved Submission" : "Review Deliverables"}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
                  {isProofExpanded ? "Hide" : "View"}{" "}
                  {isImage(m.proof_url) ? "Image" : "Link"}{" "}
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
                    <div className="mt-3 p-4 bg-white rounded-xl border border-zinc-200 shadow-inner space-y-4">
                      {/* IF IMAGE: Show Preview and Download Only */}
                      {m.proof_url && isImage(m.proof_url) ? (
                        <div className="space-y-3">
                          <div className="rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50 relative group">
                            <img
                              src={m.proof_url}
                              alt="Proof"
                              className="w-full h-auto max-h-[400px] object-contain mx-auto"
                            />
                          </div>
                          <a
                            href={m.proof_url}
                            download={`proof-${m.title}`}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-black transition-all"
                          >
                            <Download size={14} /> Download Image
                          </a>
                        </div>
                      ) : m.proof_url ? (
                        /* IF LINK: Show Clean URL Bar with Actions */
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] font-black uppercase text-zinc-400 ml-1">
                            Deliverable Link
                          </p>
                          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                            <div className="flex-1 truncate text-xs font-medium text-zinc-600">
                              {m.proof_url}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(m.proof_url);
                                  toast.success("Copied");
                                }}
                                className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-500 transition-all"
                                title="Copy Link"
                              >
                                <Copy size={14} />
                              </button>
                              <a
                                href={m.proof_url}
                                target="_blank"
                                className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-500 transition-all"
                                title="Open Link"
                              >
                                <ExternalLink size={14} />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {m.proof_notes && (
                        <div className="p-3 bg-indigo-50/30 rounded-lg border-l-4 border-indigo-200 text-xs text-zinc-600 italic">
                          <span className="font-bold text-indigo-700 not-italic block mb-1 uppercase tracking-tighter">
                            Vendor Notes
                          </span>
                          "{m.proof_notes}"
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ACTION BAR: Positioned to avoid overlap with Rejection Input */}
          <div
            className={cn(
              "pt-4 border-t border-dashed border-zinc-100 min-h-[60px]",
              isActive ? "opacity-100" : "opacity-40 pointer-events-none"
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
