"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Zap,
  Slack,
  Loader2,
  CreditCard,
  Search,
  AlertCircle,
  Sparkles,
  Wifi,
  Battery,
} from "lucide-react";
import Link from "next/link";

// --- BRAND COLORS ---
// Navy: #0B2447
// Teal: #14B8A6

// --- DATA CONFIG (Real SaaS Data) ---
const LEFT_NOTIFICATIONS = [
  {
    id: 1,
    icon: <Slack size={14} />,
    bg: "bg-[#4A154B]",
    title: "Vendor Update",
    text: "Proof submitted for M1",
    position: "top-[15%] left-[-10px] md:left-[-40px]",
  },
  {
    id: 2,
    icon: <AlertCircle size={14} />,
    bg: "bg-rose-500",
    title: "Risk Alert",
    text: "Deadline approaching",
    position: "top-[45%] left-[-5px] md:left-[-50px]",
  },
];

const RIGHT_NOTIFICATIONS = [
  {
    id: 1,
    icon: <Zap size={14} />,
    bg: "bg-[#14B8A6]",
    title: "AI Analysis",
    text: "3 Deliverables extracted",
    position: "top-[25%] right-[-10px] md:right-[-30px]",
  },
  {
    id: 2,
    icon: <CreditCard size={14} />,
    bg: "bg-blue-600",
    title: "Payment Ready",
    text: "₹ 50,000 Escrow",
    position: "bottom-[20%] right-[-5px] md:right-[-25px]",
  },
];

const HeroSection = () => {
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [simulationKey, setSimulationKey] = useState(0);

  // --- RESPONSIVE CHECK & TIME ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 10000);

    // Animation Loop
    const loopInterval = setInterval(() => {
      setSimulationKey((prev) => prev + 1);
    }, 12000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(loopInterval);
    };
  }, []);

  // --- NOTIFICATION CYCLING ---
  useEffect(() => {
    const timer = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % LEFT_NOTIFICATIONS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRightIndex((prev) => (prev + 1) % RIGHT_NOTIFICATIONS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // --- ANIMATION VARIANTS ---
  const highlightVariant: Variants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.8, delay: 0.2, ease: "circOut" },
    },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.5,
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    }),
  };

  return (
    <section className="relative w-full min-h-screen lg:min-h-[800px] flex flex-col justify-center items-center bg-white text-[#0B2447] overflow-hidden font-sans pt-28 pb-16 lg:pt-0 lg:pb-0">
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0 pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative z-10 items-center">
        {/* --- LEFT COLUMN: CONTENT --- */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-1">
          {/* HEADLINE */}
          <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-extrabold tracking-tight text-[#0B2447] leading-[1.05] mb-6 relative z-10">
            Turn Contracts <br className="hidden lg:block" /> Into <br />
            Predictable, Trackable, <br />
            <span className="relative inline-block mt-1 whitespace-nowrap">
              <motion.span
                variants={highlightVariant}
                initial="hidden"
                animate="visible"
                style={{ originX: 0 }}
                className="absolute bottom-3 left-[-2%] w-[104%] h-[30%] bg-[#2DD4BF] -z-10 -rotate-1 rounded-sm opacity-60 mix-blend-multiply"
              />
              <span className="relative z-10">Execution.</span>
            </span>
          </h1>

          {/* SUB-HEADLINE */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg mb-8 font-medium">
            Jifwa is an AI-native, fully encrypted contract execution platform
            that ensures what's agreed in a contract actually happens during
            delivery—with clarity, accountability, and zero ambiguity.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
            <Link
              href="/dashboard"
              className="h-14 px-8 rounded-full bg-[#0B2447] text-white font-bold text-base hover:bg-[#15345A] hover:shadow-xl hover:shadow-[#0B2447]/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              Get Started
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* --- RIGHT COLUMN: PHONE UI --- */}
        <div className="relative w-full flex items-center justify-center lg:justify-end order-2 mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="
              relative z-20 
              w-[280px] sm:w-[300px] lg:w-[320px] 
              h-[580px] sm:h-[620px] lg:h-[630px] 
              bg-[#0B2447] rounded-[2.5rem] p-[6px] 
              shadow-[0_40px_80px_-20px_rgba(11,36,71,0.3)] 
              ring-1 ring-white/10
            "
          >
            {/* Glossy Edge Reflection */}
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/5 pointer-events-none z-30"></div>

            {/* Screen Content */}
            <div className="h-full w-full bg-slate-50 rounded-[2.2rem] overflow-hidden flex flex-col relative shadow-inner">
              {/* Status Bar */}
              <div className="h-10 w-full bg-white relative z-20 flex items-center justify-between px-5 pt-1.5 shrink-0">
                <span className="text-[11px] font-bold text-slate-900 font-mono">
                  {currentTime}
                </span>

                {/* Dynamic Island - AI Status */}
                <div className="absolute left-1/2 top-2.5 -translate-x-1/2 bg-black h-[26px] px-3 rounded-full flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.4)] z-30 overflow-hidden ring-1 ring-white/10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 size={11} className="text-[#14B8A6]" />
                  </motion.div>
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-[9px] font-bold text-white tracking-widest uppercase whitespace-nowrap"
                  >
                    AI Processing
                  </motion.span>
                </div>

                <div className="flex gap-1 items-center text-slate-800">
                  <Wifi size={13} />
                  <Battery size={13} />
                </div>
              </div>

              {/* App Body */}
              <div className="flex-1 p-4 flex flex-col relative">
                {/* Search */}
                <div className="bg-white h-9 rounded-xl border border-slate-200 flex items-center px-3 gap-2 mb-4 shadow-sm">
                  <Search size={14} className="text-slate-400" />
                  <span className="text-[11px] text-slate-400">
                    Search contracts...
                  </span>
                </div>

                {/* Main PDF Card */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden mb-4 group">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center text-[#14B8A6] border border-teal-100">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-bold text-[#0B2447] truncate">
                        MSA_Jifwa_Final.pdf
                      </div>
                      <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-[#14B8A6] rounded-full animate-pulse"></span>
                        Ready for extraction
                      </div>
                    </div>
                  </div>
                  {/* Scanning Beam */}
                  <motion.div
                    key={simulationKey}
                    className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-transparent via-[#14B8A6]/10 to-transparent z-0 pointer-events-none"
                    initial={{ top: "-100%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 2, ease: "linear" }}
                  />
                </div>

                {/* Extracted Data Section */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Jifwa AI Intelligence
                  </span>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-[#14B8A6] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                    <Sparkles size={9} /> Analysis Complete
                  </div>
                </div>

                <div className="space-y-2.5">
                  {/* Card 1 */}
                  <motion.div
                    key={simulationKey + "c1"}
                    custom={1}
                    variants={itemVariant}
                    initial="hidden"
                    animate="visible"
                    className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm border-l-[3px] border-l-[#0B2447]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={13} className="text-[#0B2447]" />
                      <span className="text-[11px] font-bold text-slate-800">
                        Milestone 1: Prototype
                      </span>
                    </div>
                    <div className="pl-5 text-[10px] text-slate-400">
                      Extracted from{" "}
                      <span className="font-semibold text-slate-500">
                        Clause 2.4
                      </span>
                    </div>
                  </motion.div>

                  {/* Card 2 */}
                  <motion.div
                    key={simulationKey + "c2"}
                    custom={2}
                    variants={itemVariant}
                    initial="hidden"
                    animate="visible"
                    className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm border-l-[3px] border-l-[#14B8A6]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard size={13} className="text-[#14B8A6]" />
                      <span className="text-[11px] font-bold text-slate-800">
                        Advance: ₹ 50,000
                      </span>
                    </div>
                    <div className="pl-5 text-[10px] text-slate-400">
                      Syncing to{" "}
                      <span className="font-semibold text-slate-500">
                        Razorpay
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Button */}
                <div className="mt-auto mb-1">
                  <Link href="/dashboard">
                    <button className="w-full h-10 bg-[#0B2447] text-white rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg hover:bg-[#15345A] transition-colors">
                      <Zap size={12} className="fill-white" /> Create Execution
                      Flow
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating Notifications (Visible on larger screens) */}
            <div className="hidden sm:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={rightIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`absolute ${RIGHT_NOTIFICATIONS[rightIndex].position} z-50 bg-white/95 backdrop-blur-sm border border-slate-100 p-2.5 rounded-xl shadow-lg flex items-center gap-3 min-w-[160px]`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${RIGHT_NOTIFICATIONS[rightIndex].bg}`}
                  >
                    {RIGHT_NOTIFICATIONS[rightIndex].icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#0B2447]">
                      {RIGHT_NOTIFICATIONS[rightIndex].title}
                    </div>
                    <div className="text-[9px] text-slate-500 font-medium">
                      {RIGHT_NOTIFICATIONS[rightIndex].text}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={leftIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`absolute ${LEFT_NOTIFICATIONS[leftIndex].position} z-50 bg-white/95 backdrop-blur-sm border border-slate-100 p-2.5 rounded-xl shadow-lg flex items-center gap-3 min-w-[160px]`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${LEFT_NOTIFICATIONS[leftIndex].bg}`}
                  >
                    {LEFT_NOTIFICATIONS[leftIndex].icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#0B2447]">
                      {LEFT_NOTIFICATIONS[leftIndex].title}
                    </div>
                    <div className="text-[9px] text-slate-500 font-medium">
                      {LEFT_NOTIFICATIONS[leftIndex].text}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
