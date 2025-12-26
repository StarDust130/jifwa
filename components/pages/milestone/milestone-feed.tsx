"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  UploadCloud,
  XCircle,
  ShieldCheck,
  DollarSign,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MilestoneFeedProps {
  project: any;
  isClient: boolean;
}

export function MilestoneFeed({ project, isClient }: MilestoneFeedProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null); // For submit mode

  // Input State
  const [proofLink, setProofLink] = useState("");
  const [proofNote, setProofNote] = useState("");

  const handleUpdate = async (
    milestoneId: string,
    action: string,
    data?: any
  ) => {
    setLoadingId(milestoneId);
    try {
      await fetch("/api/milestones/update", {
        // 👈 CALLING NEW API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project._id,
          milestoneId,
          action,
          data,
        }),
      });
      setActiveId(null);
      setProofLink("");
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">
            Execution Ledger
          </h1>
          <p className="text-zinc-500 font-medium mt-1">
            Proof of work verification system.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100/50">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Escrow Secured
          </span>
        </div>
      </div>

      <div className="relative border-l-2 border-zinc-100 ml-4 sm:ml-6 space-y-12">
        {project.milestones.map((m: any, i: number) => {
          const isDone = m.status === "approved";
          const isReview = m.status === "in_review";
          const isSubmitMode = activeId === m._id;
          const isLoading = loadingId === m._id;

          return (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              key={m._id}
              className="relative pl-8 sm:pl-12"
            >
              {/* Timeline Dot */}
              <div
                className={cn(
                  "absolute -left-[9px] top-0 w-[18px] h-[18px] rounded-full border-[3px] bg-white transition-colors duration-300 z-10",
                  isDone
                    ? "border-emerald-500"
                    : isReview
                    ? "border-amber-500 animate-pulse"
                    : "border-zinc-300"
                )}
              />

              {/* THE CARD */}
              <motion.div
                layout
                className={cn(
                  "rounded-2xl border overflow-hidden transition-all duration-500 group",
                  isReview
                    ? "bg-white border-amber-200 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/20"
                    : isDone
                    ? "bg-zinc-50/50 border-zinc-200 opacity-75 hover:opacity-100"
                    : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
                )}
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="space-y-1">
                      <h3
                        className={cn(
                          "text-lg font-bold text-zinc-900 leading-tight",
                          isDone && "line-through text-zinc-400"
                        )}
                      >
                        {m.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
                        <span className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded">
                          <Clock size={12} />{" "}
                          {m.due_date
                            ? new Date(m.due_date).toLocaleDateString()
                            : "TBD"}
                        </span>
                        {m.amount && (
                          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                            <DollarSign size={12} /> {m.amount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Chip */}
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        isDone
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : isReview
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200"
                      )}
                    >
                      {m.status.replace("_", " ")}
                    </div>
                  </div>

                  <div className="text-sm text-zinc-600 leading-relaxed bg-zinc-50/50 p-4 rounded-xl border border-zinc-100/80">
                    {m.criteria}
                  </div>
                </div>

                {/* ACTION AREA (Animated Expand) */}
                <AnimatePresence mode="wait">
                  {/* 1. SUBMIT FORM */}
                  {isSubmitMode && !isLoading && (
                    <motion.div
                      key="submit-form"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-zinc-50 border-t border-zinc-100 p-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-zinc-900 uppercase tracking-wide block mb-2">
                            Proof URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://drive.google.com/..."
                            className="w-full text-sm p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 bg-white"
                            value={proofLink}
                            onChange={(e) => setProofLink(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-900 uppercase tracking-wide block mb-2">
                            Notes
                          </label>
                          <input
                            type="text"
                            placeholder="Added the requested features..."
                            className="w-full text-sm p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-400 bg-white"
                            value={proofNote}
                            onChange={(e) => setProofNote(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() =>
                              handleUpdate(m._id, "submit_proof", {
                                proof_url: proofLink,
                                proof_notes: proofNote,
                              })
                            }
                            disabled={!proofLink}
                            className="bg-zinc-900 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center gap-2"
                          >
                            Submit Proof <ChevronRight size={14} />
                          </button>
                          <button
                            onClick={() => setActiveId(null)}
                            className="text-zinc-500 text-xs font-bold px-4 py-3 hover:text-zinc-900 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 2. REVIEW MODE */}
                  {isReview && !isLoading && (
                    <motion.div
                      key="review-mode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-amber-50/50 border-t border-amber-100 p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
                    >
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-amber-900">
                            Submission Received
                          </h4>
                          <a
                            href={m.proof_url}
                            target="_blank"
                            className="text-xs font-medium text-amber-700 hover:text-amber-900 hover:underline flex items-center gap-1 mt-1"
                          >
                            View Work <ExternalLink size={10} />
                          </a>
                          {m.proof_notes && (
                            <p className="text-xs text-amber-600/80 mt-1 italic">
                              "{m.proof_notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {isClient ? (
                        <div className="flex gap-3 w-full sm:w-auto">
                          <button
                            onClick={() => handleUpdate(m._id, "approve")}
                            className="flex-1 sm:flex-none bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleUpdate(m._id, "reject")}
                            className="flex-1 sm:flex-none bg-white border border-red-100 text-red-600 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-amber-100">
                          Awaiting Approval
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* 3. DEFAULT (START BUTTON) */}
                  {!isSubmitMode &&
                    !isReview &&
                    !isDone &&
                    !isLoading &&
                    !isClient && (
                      <motion.div className="p-6 pt-2">
                        <button
                          onClick={() => setActiveId(m._id)}
                          className="w-full flex items-center justify-center gap-2 bg-white border border-dashed border-zinc-300 text-zinc-500 text-xs font-bold py-3 rounded-xl hover:bg-zinc-50 hover:border-zinc-400 hover:text-zinc-900 transition-all group/btn"
                        >
                          <UploadCloud
                            size={14}
                            className="group-hover/btn:-translate-y-0.5 transition-transform"
                          />{" "}
                          Upload Deliverable
                        </button>
                      </motion.div>
                    )}

                  {/* LOADING STATE */}
                  {isLoading && (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-8 flex justify-center bg-zinc-50/30 border-t border-zinc-100"
                    >
                      <Loader2
                        size={24}
                        className="animate-spin text-zinc-400"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
