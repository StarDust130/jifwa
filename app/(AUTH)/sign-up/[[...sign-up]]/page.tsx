"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SignUp, ClerkLoaded } from "@clerk/nextjs";
import { ArrowLeft, FileText, ShieldCheck, Globe, Zap } from "lucide-react";
import Image from "next/image";

export default function SignUpPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle the 1-2s loading state for Clerk
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 font-sans bg-white overflow-hidden">
      {/* ================= LEFT: DESKTOP BRANDING (SAME UI, DIFFERENT TEXT) ================= */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[#020203] text-white px-16 py-12 overflow-hidden border-r border-white/5">
        {/* --- INDUSTRIAL DEPTH LAYERS --- */}
        <div className="absolute inset-0 z-0">
          {/* High-Frequency Pulse Glow */}
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-1000" />

          {/* Micro-Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        {/* --- TOP: KERNEL STATUS --- */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-white hover:border-indigo-500/50 transition-all"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            TERMINATE_SESSION
          </Link>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                Live_Extraction_Mode
              </span>
            </div>
            <span className="text-[8px] font-mono text-neutral-600 mt-1 uppercase tracking-widest">
              Latency: 14ms
            </span>
          </div>
        </div>

        {/* --- MAIN: THE ENGINE --- */}
        <div className="relative z-10">
          <div className="mb-10">
            <h1 className="text-[5.5rem] font-black tracking-tighter leading-[0.8] uppercase italic mb-6">
              Command <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-white to-purple-500 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                Your Data.
              </span>
            </h1>
            <p className="text-neutral-500 text-lg font-bold max-w-sm leading-tight uppercase tracking-tighter opacity-80 italic">
              The Neural Infrastructure for <br /> Contract Execution.
            </p>
          </div>

          {/* --- LIVE PROCESSING FEED (The "Money" View) --- */}
          <div className="relative space-y-3">
            {/* Parsing Block */}
            <div className="relative group p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-2xl transition-all duration-500 hover:border-indigo-500/40">
              <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 rounded-full" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <FileText size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                      Ingest_Thread_01
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-mono text-neutral-500 border border-white/10 uppercase tracking-widest italic animate-pulse">
                      Scanning...
                    </span>
                  </div>
                  <div className="text-xl font-black text-neutral-100 tracking-tight italic">
                    Service_Agreement_v4.pdf
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Logic Arrow */}
            <div className="flex justify-center w-14">
              <div className="h-8 w-px bg-gradient-to-b from-indigo-500 to-transparent opacity-50" />
            </div>

            {/* Sync Block */}
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.01] border border-white/5 backdrop-blur-sm opacity-60 hover:opacity-100 transition-opacity">
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-1">
                  Workflow_Push
                </p>
                <p className="text-sm font-bold text-neutral-400">
                  Mapping <span className="text-white">Milestones</span> to
                  Slack Node...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM: PROTOCOLS --- */}
        <div className="relative z-10 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex gap-12">
              <div className="space-y-2">
                <p className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.3em]">
                  Protocol_Stack
                </p>
                <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 italic">
                  <ShieldCheck size={14} className="text-indigo-500" />{" "}
                  SOC2_TYPE_II
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.3em]">
                  Global_Sync
                </p>
                <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 italic">
                  <Globe size={14} className="text-purple-500" />{" "}
                  ISO_27001_READY
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="text-[9px] font-mono text-neutral-700 font-bold tracking-widest mb-2">
                SYSTEM_AUTH_V4.1
              </span>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-6 rounded-full ${
                      i < 3 ? "bg-indigo-500/50" : "bg-neutral-900"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT: THE AUTH FORM ================= */}
      <div className="flex flex-col items-center justify-center min-h-screen relative bg-[#F8F9FA] lg:bg-white px-4">
        {/* Mobile-only Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 px-6 flex justify-between items-center z-[100] bg-white border-b border-gray-100 shadow-sm">
          <Link
            href="/"
            className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-tighter"
          >
            <ArrowLeft size={18} />
            <span>Home</span>
          </Link>
         
        </div>

        {/* Form Area with Skeleton */}
        <div className="w-full max-w-[400px] mt-20 lg:mt-0 relative">
          {!isLoaded && (
            <div className="w-full h-[580px] bg-white border border-gray-200 rounded-xl p-8 flex flex-col gap-6 animate-pulse">
              <div className="h-8 w-48 bg-gray-100 rounded-md mb-4" />
              <div className="h-4 w-64 bg-gray-50 rounded-md mb-8" />
              <div className="h-12 w-full bg-gray-100 rounded-xl" />
              <div className="h-px w-full bg-gray-100 my-2" />
              <div className="space-y-4">
                <div className="h-4 w-20 bg-gray-100 rounded-md" />
                <div className="h-12 w-full bg-gray-50 rounded-xl" />
              </div>
              <div className="h-12 w-full bg-gray-900 rounded-xl mt-4" />
            </div>
          )}

          <div
            className={`${
              isLoaded
                ? "opacity-100"
                : "opacity-0 absolute inset-0 pointer-events-none"
            } transition-opacity duration-500`}
          >
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "mx-auto w-full",
                },
              }}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="mailto:support@jifwa.com"
            className="text-[10px] font-black text-gray-400 hover:text-black transition-colors uppercase tracking-[0.2em]"
          >
            Need Help? Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
