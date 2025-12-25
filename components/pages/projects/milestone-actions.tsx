"use client";

import { Check, RotateCcw, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function MilestoneActions({
  milestone,
  isClient,
}: {
  milestone: any;
  isClient: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await fetch(`/api/projects/milestones/${milestone._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (milestone.status === "approved") return null;

  return (
    <div className="flex items-center gap-3">
      {/* Client Actions */}
      {isClient && milestone.status === "in_review" && (
        <>
          <button
            disabled={loading}
            onClick={() => handleStatusChange("approved")}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-md text-xs font-bold hover:bg-zinc-800 transition-all shadow-sm"
          >
            <Check size={14} strokeWidth={2} /> Approve
          </button>
          <button
            disabled={loading}
            onClick={() => handleStatusChange("pending")}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 text-zinc-900 rounded-md text-xs font-bold hover:bg-zinc-50 transition-all"
          >
            <RotateCcw size={14} /> Revise
          </button>
        </>
      )}

      {/* Vendor Actions */}
      {!isClient && milestone.status === "pending" && (
        <button
          disabled={loading}
          onClick={() => handleStatusChange("in_review")}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-md text-xs font-bold hover:bg-zinc-800 transition-all shadow-sm group"
        >
          Submit Work{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      )}
    </div>
  );
}
