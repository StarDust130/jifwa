"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InviteVendorModal({ projectId }: { projectId: string }) {
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
        body: JSON.stringify({ projectId, email }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");

      // Close automatically after 2s
      setTimeout(() => setOpen(false), 2000);
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 border border-zinc-900 rounded-md hover:bg-zinc-800 transition-all shadow-sm">
          <Mail size={12} /> Invite Vendor
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-xl p-6">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">Invite Sent!</h3>
            <p className="text-xs text-zinc-500">
              We've emailed {email} with a secure link.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-zinc-900">
                Invite Collaborator
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                They will receive an email to access this project workspace.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Vendor Email
                </label>
                <input
                  type="email"
                  placeholder="vendor@company.com"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
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

              {status === "error" && (
                <p className="text-xs text-red-600 text-center font-medium">
                  Failed to send invite. Try again.
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
