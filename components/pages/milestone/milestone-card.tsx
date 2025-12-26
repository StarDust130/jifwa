"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  UploadCloud,
  AlertCircle,
  FileText,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MilestoneProps {
  milestone: any;
  projectId: string;
  isClient: boolean; // True = Owner, False = Vendor
}

export function MilestoneCard({
  milestone,
  projectId,
  isClient,
}: MilestoneProps) {
  const [status, setStatus] = useState(milestone.status); // pending, in_review, approved
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- HANDLERS ---
  const handleUpload = async () => {
    setLoading(true);
    // 1. Upload File Logic Here (Reuse your upload API)
    // 2. Call the Update API
    await fetch("/api/milestones/update", {
      method: "POST",
      body: JSON.stringify({
        projectId,
        milestoneId: milestone._id,
        action: "submit_proof",
        data: { fileUrl: "https://fake-url.com/proof.pdf" }, // Replace with real URL
      }),
    });
    setStatus("in_review");
    setLoading(false);
  };

  const handleReview = async (decision: "approve" | "reject") => {
    setLoading(true);
    await fetch("/api/milestones/update", {
      method: "POST",
      body: JSON.stringify({
        projectId,
        milestoneId: milestone._id,
        action: decision,
        data: decision === "reject" ? { feedback: "Needs changes" } : {},
      }),
    });
    setStatus(decision === "approve" ? "approved" : "changes_requested");
    setLoading(false);
  };

  // --- STYLES ---
  const statusColors = {
    pending: "bg-zinc-100 text-zinc-500 border-zinc-200",
    in_review: "bg-orange-50 text-orange-600 border-orange-100",
    approved: "bg-green-50 text-green-600 border-green-100",
    changes_requested: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="relative pl-12 pb-12 last:pb-0">
      {/* Timeline Line */}
      <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-zinc-100" />

      {/* Timeline Icon */}
      <div
        className={cn(
          "absolute left-0 top-6 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-colors",
          status === "approved"
            ? "bg-green-500 text-white"
            : "bg-white border-zinc-200 text-zinc-400"
        )}
      >
        {status === "approved" ? (
          <CheckCircle2 size={18} />
        ) : (
          <Circle size={18} />
        )}
      </div>

      {/* The Card */}
      <motion.div
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "group bg-white rounded-[24px] border p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-zinc-200/50 relative overflow-hidden",
          status === "in_review"
            ? "border-orange-200 ring-4 ring-orange-50"
            : "border-zinc-200"
        )}
      >
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {milestone.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs font-medium">
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full border uppercase tracking-wider",
                  statusColors[status as keyof typeof statusColors]
                )}
              >
                {status.replace("_", " ")}
              </span>
              <span className="text-zinc-400 flex items-center gap-1">
                <Clock size={12} /> Due{" "}
                {new Date(milestone.due_date).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-xs text-zinc-400 uppercase font-bold tracking-wider">
              Value
            </span>
            <span className="text-sm font-mono font-bold text-slate-900">
              {milestone.amount}
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-zinc-100 pt-4 mt-4 relative z-10"
            >
              <div className="bg-zinc-50 rounded-xl p-4 mb-4 text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-900 block mb-1">
                  Deliverables:
                </strong>
                {milestone.criteria}
              </div>

              {/* --- ACTION AREA --- */}

              {/* Case 1: Client Reviewing */}
              {isClient && status === "in_review" && (
                <div className="flex gap-3 animate-in fade-in slide-in-from-top-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReview("approve");
                    }}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20"
                  >
                    Approve Release
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReview("reject");
                    }}
                    disabled={loading}
                    className="px-6 bg-white border border-zinc-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-zinc-50 transition-colors"
                  >
                    Request Changes
                  </button>
                </div>
              )}

              {/* Case 2: Vendor Submitting */}
              {!isClient && status !== "approved" && status !== "in_review" && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  className="border-2 border-dashed border-zinc-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-50 hover:border-indigo-400 transition-all cursor-pointer group/upload"
                >
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover/upload:scale-110 transition-transform">
                    {loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent" />
                    ) : (
                      <UploadCloud size={24} className="text-indigo-600" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    Upload Proof of Work
                  </p>
                  <p className="text-xs text-zinc-500">
                    PDF, Zip, or Image (Max 50MB)
                  </p>
                </div>
              )}

              {/* Case 3: Waiting */}
              {status === "pending" && isClient && (
                <div className="flex items-center gap-2 text-zinc-400 text-sm italic bg-zinc-50 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-pulse" />
                  Waiting for vendor submission...
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
