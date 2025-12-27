"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Zap,
  Slack,
  Play,
  Loader2,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Search,
  AlertCircle,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";

// --- UPDATED DATA: LEFT SIDE (Execution Workflow from PDF) ---
const LEFT_NOTIFICATIONS = [
  {
    id: 1,
    icon: <Slack size={16} />,
    bg: "bg-[#4A154B]", // Slack color
    title: "Vendor Update",
    text: "Proof submitted for Milestone 2", // [cite: 57]
    position: "top-[20%] left-[-40px]",
  },
  {
    id: 2,
    icon: <AlertCircle size={16} />,
    bg: "bg-red-500", // Dispute color
    title: "Dispute Flagged",
    text: "Missing evidence for deliverable", // [cite: 13, 68]
    position: "top-[45%] left-[-50px]",
  },
  {
    id: 3,
    icon: <CheckSquare size={16} />,
    bg: "bg-[#0052CC]", // jifwa/Task color
    title: "Task Exported",
    text: "Review Acceptance Criteria", // [cite: 51]
    position: "bottom-[25%] left-[-35px]",
  },
];

// --- UPDATED DATA: RIGHT SIDE (Revenue & AI Intelligence from PDF) ---
const RIGHT_NOTIFICATIONS = [
  {
    id: 1,
    icon: <Zap size={16} />,
    bg: "bg-yellow-500",
    title: "AI Extraction",
    text: "5 Deliverables identified", // 
    position: "top-[25%] right-[-30px]",
  },
  {
    id: 2,
    icon: <ShieldCheck size={16} />,
    bg: "bg-green-500",
    title: "Secure Env",
    text: "AES-256 Encryption Active", // 
    position: "top-[50%] right-[-45px]",
  },
  {
    id: 3,
    icon: <TrendingUp size={16} />,
    bg: "bg-blue-500",
    title: "Revenue Ops",
    text: "$45,200 Unlocked", //  - Matching PDF number
    position: "bottom-[30%] right-[-25px]",
  },
];

const HeroSection = () => {
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % LEFT_NOTIFICATIONS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRightIndex((prev) => (prev + 1) % RIGHT_NOTIFICATIONS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const highlightVariant: Variants = {
    hidden: { width: "0%" },
    visible: {
      width: "105%",
      transition: { duration: 0.8, delay: 0.5, ease: "circOut" },
    },
  };

  const scanLine: Variants = {
    animate: {
      top: ["5%", "95%", "5%"],
      opacity: [0.6, 1, 0.6],
      transition: { duration: 3, repeat: Infinity, ease: "linear" },
    },
  };

  return (
    <section className="relative w-full mt-5 min-h-[92vh] bg-white text-gray-900 overflow-hidden flex items-center justify-center pt-24 pb-20 lg:pt-0 lg:pb-0 font-sans selection:bg-yellow-200 selection:text-black">
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0 pointer-events-none opacity-40" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        {/* --- LEFT COLUMN --- */}
        <div className="flex flex-col items-start text-left max-w-2xl mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-[11px] font-bold tracking-wide uppercase rounded-full mb-8 shadow-xl shadow-gray-200/50 ring-1 ring-black/5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Jifwa AI Intelligence v2.0
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[0.95] mb-8">
            Turn Contracts Into <br />
            <span className="relative inline-block whitespace-normal z-0">
              <motion.span
                variants={highlightVariant}
                initial="hidden"
                animate="visible"
                className="absolute bottom-2 left-[-1%] h-[0.5em] bg-yellow-300 -z-10 -rotate-1 rounded-sm mix-blend-multiply opacity-100"
              />
              <span className="relative z-10">
                Predictable, Trackable Execution.
              </span>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-lg mb-10 font-medium">
            Jifwa is an AI-native, fully encrypted contract execution platform
            that ensures what's agreed in a contract actually happens during
            delivery - with clarity, accountability, and zero ambiguity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
            <Link
              href="/dashboard"
              className="h-14 px-8 rounded-full bg-gray-900 text-white font-bold text-sm sm:text-base hover:bg-black hover:scale-105 transition-all duration-300 shadow-2xl shadow-gray-900/20 flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <button className="h-14 px-8 rounded-full bg-white text-gray-700 border border-gray-200 font-bold text-sm sm:text-base hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
              <Play size={18} className="fill-gray-700" />
              Book Demo
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-bold text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gray-900" /> SOC2 Type II
              Ready
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gray-900" /> No credit card
              needed
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: DEVICE --- */}
        <div className="relative h-[650px] w-full flex items-center justify-center lg:justify-end perspective-[2500px]">
          <motion.div
            initial={{ rotateY: -20, rotateX: 5, opacity: 0 }}
            animate={{ rotateY: -10, rotateX: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-[280px] h-[580px] bg-gray-900 rounded-[3rem] p-[4px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] z-20"
          >
            <div className="absolute inset-0 rounded-[3rem] border border-gray-600/40 pointer-events-none z-50 ring-1 ring-inset ring-white/10"></div>

            <div className="h-full w-full bg-white rounded-[2.7rem] overflow-hidden flex flex-col relative">
              {/* --- STATUS BAR FIXED --- */}
              <div className="h-12 w-full bg-white relative z-20">
                {/* Time: Pinned to absolute left */}
                <span className="absolute left-5 top-5 text-[11px] font-bold text-gray-900 font-mono tracking-tight z-40">
                  {currentTime}
                </span>

                {/* Dynamic Island: Centered */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black rounded-full z-30 flex items-center gap-2 px-3 py-1.5 shadow-xl min-w-[100px] justify-center">
                  <Loader2 size={10} className="text-gray-400 animate-spin" />
                  <span className="text-[9px] font-bold text-white tracking-wide uppercase whitespace-nowrap">
                    AI Scanning
                  </span>
                </div>

                {/* Battery: Pinned to absolute right */}
                <div className="absolute right-5 top-5 flex gap-1.5 items-end z-40">
                  <div className="w-4 h-2.5 bg-gray-900 rounded-[2px]"></div>
                  <div className="w-0.5 h-1.5 bg-gray-400 rounded-[1px]"></div>
                </div>
              </div>

              {/* APP UI */}
              <div className="flex-1 bg-gray-50/60 pt-12 px-4 pb-6 flex flex-col font-sans relative">
                <div className="bg-gray-200/50 h-8 rounded-xl mb-4 flex items-center px-3 gap-2">
                  <Search size={12} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-medium">
                    Search contracts...
                  </span>
                </div>

                {/* Document Card */}
                <div className="bg-white p-3 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 mb-5 relative overflow-hidden group">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-gray-900 truncate">
                        MSA_Jifwa_Final.pdf
                      </div>
                      <div className="text-[9px] text-gray-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Ready for extraction
                      </div>
                    </div>
                  </div>
                  <motion.div
                    variants={scanLine}
                    animate="animate"
                    className="absolute left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] z-0 pointer-events-none blur-[0.5px]"
                  />
                </div>

                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    Jifwa AI Intelligence
                  </span>
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    Analysis Complete
                  </span>
                </div>

                {/* Tasks - Content from PDF [cite: 17, 18, 43] */}
                <div className="space-y-2.5">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1.5 border-l-4 border-l-blue-500"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-blue-500" />
                        <span className="text-[11px] font-bold text-gray-800">
                          App V1.0 Milestone
                        </span>
                      </div>
                    </div>
                    <div className="pl-5 text-[9px] text-gray-400">
                      Extracted from{" "}
                      <span className="text-gray-600 font-medium">
                        Clause 2.4
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8 }}
                    className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1.5 border-l-4 border-l-green-500"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <CreditCard size={12} className="text-green-500" />
                        <span className="text-[11px] font-bold text-gray-800">
                          Initial Deposit: $15,000
                        </span>
                      </div>
                    </div>
                    <div className="pl-5 text-[9px] text-gray-400">
                      Syncing to{" "}
                      <span className="text-gray-600 font-medium">
                        Quickbooks
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Pill - Black as requested */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="mt-auto mx-auto bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 mb-1"
                >
                  <Zap size={10} className="fill-white" />
                  <span className="text-[10px] font-bold tracking-wide">
                    Push 2 Updates to jifwa
                  </span>
                </motion.div>
              </div>
            </div>

            {/* --- REVENUE CARD (Right Side) --- */}
            <AnimatePresence mode="wait">
              <motion.div
                key={RIGHT_NOTIFICATIONS[rightIndex].id}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute ${RIGHT_NOTIFICATIONS[rightIndex].position} z-30 flex items-center gap-3 bg-white/90 backdrop-blur-md p-2.5 pr-4 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 w-auto min-w-[180px]`}
              >
                <div
                  className={`w-8 h-8 ${RIGHT_NOTIFICATIONS[rightIndex].bg} rounded-full flex items-center justify-center text-white shrink-0 shadow-sm`}
                >
                  {RIGHT_NOTIFICATIONS[rightIndex].icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-900">
                    {RIGHT_NOTIFICATIONS[rightIndex].title}
                  </p>
                  <p className="text-[9px] text-gray-500 truncate w-24">
                    {RIGHT_NOTIFICATIONS[rightIndex].text}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* --- INTEGRATION SWARM (Left Side) --- */}
            <AnimatePresence mode="wait">
              <motion.div
                key={LEFT_NOTIFICATIONS[leftIndex].id}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute ${LEFT_NOTIFICATIONS[leftIndex].position} z-30 flex items-center gap-3 bg-white/90 backdrop-blur-md p-2.5 pr-4 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 w-auto min-w-[180px]`}
              >
                <div
                  className={`w-8 h-8 ${LEFT_NOTIFICATIONS[leftIndex].bg} rounded-full flex items-center justify-center text-white shrink-0 shadow-sm`}
                >
                  {LEFT_NOTIFICATIONS[leftIndex].icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-900">
                    {LEFT_NOTIFICATIONS[leftIndex].title}
                  </p>
                  <p className="text-[9px] text-gray-500 truncate w-24">
                    {LEFT_NOTIFICATIONS[leftIndex].text}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;