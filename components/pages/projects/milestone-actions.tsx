"use client";

import {
  Check,
  RotateCcw,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MilestoneActions({
  milestone,
  isClient,
}: {
  milestone: any;
  isClient: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openRevise, setOpenRevise] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await fetch(`/api/projects/milestones/${milestone._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setOpenApprove(false);
      setOpenRevise(false);
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
          {/* --- APPROVE DIALOG --- */}
          <Dialog open={openApprove} onOpenChange={setOpenApprove}>
            <DialogTrigger asChild>
              <button
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-md text-xs font-bold hover:bg-zinc-800 transition-all shadow-sm"
              >
                <Check size={14} strokeWidth={2} /> Approve
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-white rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-zinc-900 font-bold">
                  Confirm Approval
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-sm">
                  Are you sure you want to approve this milestone? This action
                  will mark the work as complete and final.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-2 justify-end mt-4">
                <button
                  onClick={() => setOpenApprove(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleStatusChange("approved")}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    "Yes, Approve"
                  )}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* --- REVISE DIALOG --- */}
          <Dialog open={openRevise} onOpenChange={setOpenRevise}>
            <DialogTrigger asChild>
              <button
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 text-zinc-900 rounded-md text-xs font-bold hover:bg-zinc-50 transition-all"
              >
                <RotateCcw size={14} /> Revise
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-white rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-red-600 font-bold flex items-center gap-2">
                  <AlertCircle size={18} /> Request Revision
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-sm">
                  This will notify the vendor that changes are needed. The
                  status will return to pending for re-submission.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-2 justify-end mt-4">
                <button
                  onClick={() => setOpenRevise(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleStatusChange("pending")}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all shadow-sm shadow-red-100"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    "Confirm Revision"
                  )}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Vendor Actions */}
      {!isClient && milestone.status === "pending" && (
        <button
          disabled={loading}
          onClick={() => handleStatusChange("in_review")}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-md text-xs font-bold hover:bg-zinc-800 transition-all shadow-sm group"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            "Submit Work"
          )}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      )}
    </div>
  );
}
