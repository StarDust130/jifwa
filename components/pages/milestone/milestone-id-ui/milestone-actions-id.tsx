"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateMilestone } from "@/app/actions/milestone";

interface MilestoneActionsProps {
  milestone: any;
  projectId: string;
  isClient: boolean;
  onUpdate?: (status: string) => void; // Optional callback for instant UI
}

export function MilestoneActions({
  milestone,
  projectId,
  isClient,
  onUpdate,
}: MilestoneActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [feedback, setFeedback] = useState("");

  const status = milestone.status;

  // Only Clients can act on "In Review" items
  if (!isClient || status !== "in_review") return null;

  const handleAction = async (action: "approve" | "reject") => {
    if (action === "reject" && !feedback.trim()) {
      toast.error("Please explain why you are rejecting.");
      return;
    }

    setLoading(true);

    // ⚡️ OPTIMISTIC UI UPDATE (Instant feedback)
    if (onUpdate) {
      onUpdate(action === "approve" ? "approved" : "changes_requested");
    }

    try {
      // Call Server Action
      await updateMilestone(projectId, milestone._id, action, { feedback });

      toast.success(action === "approve" ? "Approved" : "Sent back to Vendor");
      setShowRejectInput(false);
    } catch (error) {
      toast.error("Action failed. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  if (showRejectInput) {
    return (
      <div className="w-full mt-2 animate-in fade-in slide-in-from-top-1">
        <label className="text-[10px] uppercase font-bold text-red-800 mb-1 block">
          Reason for Rejection
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Explain what needs fixing..."
          className="w-full text-sm p-3 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-red-50 text-primary mb-2 resize-none"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleAction("reject")}
            disabled={loading}
            className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
          >
            {loading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              "Confirm Reject"
            )}
          </button>
          <button
            onClick={() => setShowRejectInput(false)}
            className="px-3 py-2 bg-white border border-zinc-200 text-zinc-600 text-xs font-bold rounded-lg hover:bg-zinc-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleAction("approve")}
        disabled={loading}
        className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-black shadow-md shadow-zinc-900/10 transition-all active:scale-95"
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Check size={14} />
        )}
        Approve
      </button>

      <button
        onClick={() => setShowRejectInput(true)}
        disabled={loading}
        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 text-xs font-bold rounded-lg hover:bg-zinc-50 hover:text-red-600 hover:border-red-200 transition-all active:scale-95"
      >
        <X size={14} />
        Reject
      </button>
    </div>
  );
}
