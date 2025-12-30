"use client";

import {
  Users,
  Mail,
  CheckCircle2,
  Copy,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  CreditCard,
  LayoutList,
  Briefcase,
} from "lucide-react";
import { InviteVendorModal } from "./invite-vendor-modal";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// 👇 Update props to accept 'creator'
export function ProjectMetadata({
  project,
  isClient,
  creator,
}: {
  project: any;
  isClient: boolean;
  creator: { fullName: string; imageUrl: string; email: string };
}) {
  const { vendorId, total_value, summary, _id } = project; // Removed 'parties' usage
  const [copied, setCopied] = useState(false);
  const [vendorEmail, setVendorEmail] = useState(project.vendorEmail);

  useEffect(() => {
    if (project.vendorEmail) setVendorEmail(project.vendorEmail);
  }, [project.vendorEmail]);

  const isActive = !!vendorId;
  const hasEmail = !!vendorEmail;

  const copyId = () => {
    navigator.clipboard.writeText(_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 sticky top-24">
      {/* CARD 1: CONTRACT VALUE */}
      <div className="bg-zinc-900 rounded-xl p-6 text-white shadow-2xl shadow-zinc-900/20 relative overflow-hidden group border border-zinc-800">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none group-hover:bg-white/10 transition-all duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <CreditCard size={12} /> Total Value
            </span>
            <div className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck size={10} /> Escrow Ready
            </div>
          </div>
          <div className="text-3xl font-mono font-bold tracking-tight text-white mb-1">
            {total_value || "$0.00"}
          </div>
          <p className="text-[10px] text-zinc-500 font-medium">
            USD • Fixed Price
          </p>
        </div>
      </div>

      {/* CARD 2: SCOPE */}
      <div className="bg-white border border-zinc-200 rounded-xl p-1 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <Briefcase size={12} className="text-zinc-400" /> Scope of Work
            </h3>
            <button
              onClick={copyId}
              className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-zinc-50 transition-colors"
            >
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-primary">
                {_id.toString().slice(-6)}
              </span>
              {copied ? (
                <CheckCircle2 size={10} className="text-emerald-500" />
              ) : (
                <Copy
                  size={10}
                  className="text-zinc-300 group-hover:text-zinc-500"
                />
              )}
            </button>
          </div>
          <div className="text-xs text-zinc-600 leading-relaxed font-medium">
            {summary || "No summary available."}
          </div>
        </div>
      </div>

      {/* CARD 3: TEAM HUB */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
            <Users size={12} className="text-zinc-400" /> Project Team
          </h3>
          {isActive && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100/50 text-[9px] font-bold text-emerald-700 border border-emerald-100">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />{" "}
              Live
            </span>
          )}
        </div>

        <div className="p-2 space-y-1">
          {/* 1. REAL CLIENT ROW (User Profile) */}
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors">
            {creator.imageUrl ? (
              <img
                src={creator.imageUrl}
                alt="Client"
                className="w-8 h-8 rounded-full border border-zinc-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600 border border-zinc-200">
                {creator.fullName.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-primary truncate">
                {creator.fullName}
              </p>
              <p className="text-[10px] text-zinc-500">Project Owner</p>
            </div>
          </div>

          {/* 2. VENDOR ROW */}
          {hasEmail ? (
            <div
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg border transition-all",
                isActive
                  ? "bg-white border-transparent"
                  : "bg-amber-50/30 border-amber-100 border-dashed"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0",
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "bg-white border border-zinc-200 text-zinc-400"
                )}
              >
                {isActive ? (
                  vendorEmail.charAt(0).toUpperCase()
                ) : (
                  <Mail size={12} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-bold text-primary truncate"
                  title={vendorEmail}
                >
                  {vendorEmail}
                </p>
                <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                  {isActive ? (
                    <span className="text-emerald-600">Active Vendor</span>
                  ) : (
                    <span className="text-amber-600">Invite Sent...</span>
                  )}
                </p>
              </div>
              {isActive && <UserCheck size={14} className="text-emerald-500" />}
            </div>
          ) : (
            <div className="p-3 text-center border border-dashed border-zinc-200 rounded-lg bg-zinc-50/50 mx-2 my-2">
              <p className="text-[10px] text-zinc-400 mb-2 font-medium">
                No vendor assigned
              </p>
              {isClient && (
                <div className="[&_button]:w-full [&_button]:h-7 [&_button]:text-[10px] [&_button]:bg-white [&_button]:text-primary [&_button]:border [&_button]:border-zinc-300 [&_button]:hover:bg-zinc-100 [&_button]:shadow-sm">
                  <InviteVendorModal
                    projectId={_id}
                    onSuccess={(email) => setVendorEmail(email)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-2 border-t border-zinc-100 bg-zinc-50/30">
          <Link
            href={`/milestones`}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-600 hover:text-white hover:bg-zinc-900 py-2.5 rounded-lg transition-all border border-zinc-200 hover:border-zinc-900 bg-white shadow-sm group"
          >
            <LayoutList size={12} /> View Full Milestones
            <ArrowRight
              size={12}
              className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
