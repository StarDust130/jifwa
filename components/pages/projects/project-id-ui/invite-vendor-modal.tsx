"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export function InviteVendorModal({
  projectId,
  onSuccess,
}: {
  projectId: string;
  onSuccess?: (email: string) => void;
}) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleInvite = async () => {
    if (!email.includes("@")) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/projects/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          email,
          senderName: user?.fullName || "A Client",
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");

      // 👇 UPDATE PARENT INSTANTLY (No Refresh)
      if (onSuccess) onSuccess(email);

      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
        setEmail("");
      }, 1500);
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 border border-zinc-900 rounded-md hover:bg-zinc-800 transition-all shadow-sm w-full justify-center">
          <Mail size={12} /> Invite Vendor
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-xl p-6">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-4 text-center space-y-3 animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-1">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Invite Sent!</h3>
              <p className="text-xs text-zinc-500 mt-1">
                We've emailed {email}.
              </p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-zinc-900">
                Invite Collaborator
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Send an invite to your vendor or freelancer.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Vendor Email
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                onClick={handleInvite}
                disabled={status === "sending" || !email}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {status === "sending" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Send Invite"
                )}
                {status !== "sending" && <ArrowRight size={14} />}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
