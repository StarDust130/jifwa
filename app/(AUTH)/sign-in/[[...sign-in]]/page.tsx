"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SignIn, useClerk } from "@clerk/nextjs";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Globe,
} from "lucide-react";

export default function AuthPage() {
  const { loaded } = useClerk();
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Buffer to ensure no flickering if Clerk loads instantly
  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setShowSkeleton(false), 200);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 font-sans bg-white overflow-hidden">
      {/* ================= LEFT: DESKTOP BRANDING ================= */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[#050505] text-white px-16 py-12">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(79,70,229,0.15)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        <Link
          href="/"
          className="relative z-10 inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-white transition group w-fit"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>

        <div className="relative z-10 max-w-xl">
          <h1 className="text-[4.5rem] font-black tracking-tighter leading-[0.9] uppercase italic mb-8">
            Contracts, <br />
            turned into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-purple-400">
              Clear Actions.
            </span>
          </h1>

          <p className="text-neutral-400 text-lg font-medium max-w-md mb-12 leading-relaxed">
            Stop reading. Start executing. Jifwa instantly syncs your legal
            obligations to your daily workflow.
          </p>

          <div className="space-y-4 relative">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 ring-1 ring-indigo-500/30">
                <FileText size={20} />
              </div>
              <div className="flex-1 text-sm font-semibold text-neutral-300">
                MSA_Global_v2.pdf{" "}
                <span className="text-[10px] text-neutral-500 ml-2 italic tracking-widest">
                  PARSING...
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md ml-12">
              <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 ring-1 ring-green-500/30">
                <CheckCircle2 size={20} />
              </div>
              <div className="flex-1 text-sm font-semibold text-white">
                Created Jira Ticket: DEV-104
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} /> SOC2 Type II
            </span>
            <span className="flex items-center gap-2">
              <Globe size={14} /> Global Compliance
            </span>
          </div>
          <p>Auth_Kernel_v4.0</p>
        </div>
      </div>

      {/* ================= RIGHT: THE AUTH FORM ================= */}
      <div className="flex flex-col items-center justify-center min-h-screen relative bg-[#F8F9FA] lg:bg-white px-4">
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 px-6 flex justify-between items-center z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-tighter"
          >
            <ArrowLeft size={16} /> Home
          </Link>
        </div>

        <div className="w-full max-w-[400px] mt-10 lg:mt-0 relative">
          {/* SKELETON LOADER */}
          {showSkeleton && (
            <div className="w-full bg-white border border-gray-100 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] lg:border-none lg:shadow-none animate-pulse">
              <div className="h-8 w-40 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 w-60 bg-gray-100 rounded-md mb-8" />
              <div className="space-y-4">
                <div className="h-12 w-full bg-gray-50 rounded-xl" />
                <div className="h-px w-full bg-gray-100" />
                <div className="h-4 w-24 bg-gray-100 rounded-md" />
                <div className="h-12 w-full bg-gray-50 rounded-xl" />
                <div className="h-12 w-full bg-gray-900/10 rounded-xl mt-4" />
              </div>
            </div>
          )}

          {/* CLERK COMPONENT */}
          <div
            className={`transition-opacity duration-500 ${
              showSkeleton ? "opacity-0 absolute inset-0 -z-10" : "opacity-100"
            }`}
          >
            <div className="bg-white rounded-[2rem] p-1 shadow-[0_20px_50px_rgba(0,0,0,0.05)] lg:shadow-none lg:p-0">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "mx-auto shadow-none border-none w-full",
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="mailto:support@jifwa.com"
            className="text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
          >
            Need Help? Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
