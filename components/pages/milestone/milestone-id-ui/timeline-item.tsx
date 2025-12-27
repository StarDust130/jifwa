"use client";

import { useState } from "react";
import {
  Calendar,
  Check,
  Loader2,
  CornerDownRight,
  Play,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MilestoneActions } from "./milestone-actions-id";


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
  // ⚡️ LOCAL STATE FOR INSTANT UI UPDATES
  const [status, setStatus] = useState(m.status);
  const [isProofExpanded, setIsProofExpanded] = useState(false);

  const isDone = status === "approved";
  const isReview = status === "in_review";
  const isPending = status === "pending";
  const isDispute = status === "dispute" || status === "changes_requested";

  // Active Logic
  const isActive =
    isReview ||
    isDispute ||
    (isPending && (i === 0 || prevStatus === "approved"));

  // Handle Instant Optimistic Update
  const handleOptimisticUpdate = (newStatus: string) => {
    setStatus(newStatus);
    if (newStatus === "approved") {
      setIsProofExpanded(false); // Auto-collapse on approve
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="relative pl-[60px] sm:pl-[80px] group"
    >
      {/* --- NODE --- */}
      <div className="absolute left-0 top-0 w-[56px] sm:w-[70px] h-full flex flex-col items-center">
        <div
          className={cn(
            "absolute top-[22px] left-[28px] sm:left-[36px] h-[2px] w-[32px] sm:w-[44px] transition-colors duration-500",
            isActive || isDone ? "bg-zinc-900" : "bg-zinc-100"
          )}
        />
        <div
          className={cn(
            "relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 bg-white mt-1",
            isDone
              ? "border-emerald-500 text-emerald-600"
              : isReview
              ? "border-blue-500 text-blue-600"
              : isDispute
              ? "border-red-500 text-red-500"
              : isActive
              ? "border-zinc-900 text-zinc-900 shadow-md scale-105"
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
            <Play size={14} fill="currentColor" className="ml-0.5" />
          ) : (
            <span className="text-xs font-bold font-mono">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      {/* --- CARD --- */}
      <div
        className={cn(
          "relative rounded-xl border transition-all duration-300 overflow-hidden bg-white",
          isActive
            ? "border-zinc-900 shadow-xl shadow-zinc-900/5 -translate-y-0.5"
            : "border-zinc-200"
        )}
      >
        {isActive && (
          <div
            className={cn(
              "absolute top-0 left-0 w-[4px] h-full",
              isDispute
                ? "bg-red-500"
                : isReview
                ? "bg-blue-500"
                : "bg-zinc-900"
            )}
          />
        )}

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3
              className={cn(
                "text-base font-bold truncate",
                isDone ? "text-zinc-500" : "text-zinc-900"
              )}
            >
              {m.title}
            </h3>
            <div
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border w-fit",
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

          <div className="text-sm leading-relaxed p-4 rounded-lg mb-5 bg-zinc-50 border border-zinc-100 text-zinc-600 font-medium">
            {m.criteria}
          </div>

          {/* --- VENDOR PROOF LOGIC --- */}
          {(isReview || isDone) && (m.proof_url || m.proof_notes) && (
            <div className="mb-6">
              {/* MINIMIZED STATE (For Approved) */}
              {isDone && !isProofExpanded ? (
                <button
                  onClick={() => setIsProofExpanded(true)}
                  className="w-full flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-all group/btn"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 group-hover/btn:text-zinc-900">
                    <Check size={14} className="text-emerald-500" />
                    Submission Approved
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    View Proof <ChevronDown size={14} />
                  </div>
                </button>
              ) : (
                /* EXPANDED STATE (For Review or when clicked) */
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                      <CornerDownRight size={12} /> Submission
                    </h4>
                    {isDone && (
                      <button
                        onClick={() => setIsProofExpanded(false)}
                        className="text-zinc-400 hover:text-zinc-600"
                      >
                        <ChevronUp size={14} />
                      </button>
                    )}
                  </div>

                  {/* Image */}
                  {m.proof_url && m.proof_url.startsWith("data:image") && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50">
                      <img
                        src={m.proof_url}
                        alt="Proof"
                        className="max-w-full h-auto max-h-[300px] object-contain mx-auto"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {m.proof_url && (
                      <a
                        href={m.proof_url}
                        download="proof_file"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
                      >
                        <Download size={14} /> Download File
                      </a>
                    )}
                    {m.link && (
                      <a
                        href={m.link}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
                      >
                        <ExternalLink size={14} /> View Link
                      </a>
                    )}
                  </div>

                  {m.proof_notes && (
                    <div className="mt-3 text-xs text-zinc-500 italic border-l-2 border-zinc-200 pl-3">
                      "{m.proof_notes}"
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* --- REJECTED STATE --- */}
          {isDispute && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-800 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-xs uppercase mb-1">
                  Submission Rejected
                </span>
                Vendor has been notified to re-submit.
              </div>
            </div>
          )}

          {/* --- ACTION BAR --- */}
          <div
            className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-dashed border-zinc-100",
              isActive ? "opacity-100" : "opacity-40 pointer-events-none"
            )}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 sm:mb-0">
              <Calendar size={12} /> Due: {m.due_date || "TBD"}
            </div>

            {/* Pass the Optimistic Handler Down */}
            <MilestoneActions
              milestone={{ ...m, status: status }} // Pass current local status
              projectId={projectId}
              isClient={isClient}
              onUpdate={handleOptimisticUpdate} // 👈 Key for instant update
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
