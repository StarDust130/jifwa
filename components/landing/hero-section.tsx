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
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Search,
  AlertCircle,
  CheckSquare,
  Sparkles,
  Play,
} from "lucide-react";
import Link from "next/link";

// --- DATA CONFIG ---
const LEFT_NOTIFICATIONS = [
  {
    id: 1,
    icon: <Slack size={14} />,
    bg: "bg-[#4A154B]",
    title: "Vendor Update",
    text: "Proof submitted",
    position: "top-[12%] left-[-5px] sm:left-[-40px]",
  },
  {
    id: 2,
    icon: <AlertCircle size={14} />,
    bg: "bg-red-500",
    title: "Dispute Flagged",
    text: "Missing evidence",
    position: "top-[38%] left-[-10px] sm:left-[-50px]",
  },
  {
    id: 3,
    icon: <CheckSquare size={14} />,
    bg: "bg-[#0052CC]",
    title: "Task Exported",
    text: "Review Criteria",
    position: "bottom-[25%] left-[-5px] sm:left-[-35px]",
  },
];

const RIGHT_NOTIFICATIONS = [
  {
    id: 1,
    icon: <Zap size={14} />,
    bg: "bg-yellow-500",
    title: "AI Extraction",
    text: "5 Deliverables found",
    position: "top-[18%] right-[-5px] sm:right-[-30px]",
  },
  {
    id: 2,
    icon: <ShieldCheck size={14} />,
    bg: "bg-green-500",
    title: "Secure Env",
    text: "AES-256 Encryption",
    position: "top-[42%] right-[-15px] sm:right-[-45px]",
  },
  {
    id: 3,
    icon: <TrendingUp size={14} />,
    bg: "bg-blue-500",
    title: "Revenue Ops",
    text: "$45,200 Unlocked",
    position: "bottom-[30%] right-[-5px] sm:right-[-25px]",
  },
];

const HeroSection = () => {
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isMobile, setIsMobile] = useState(false);
  const [simulationKey, setSimulationKey] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();

    const timeInterval = setInterval(updateTime, 1000);
    const loopInterval = setInterval(() => {
      setSimulationKey((prev) => prev + 1);
    }, 8000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(loopInterval);
      window.removeEventListener("resize", checkMobile);
    };
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

  // --- VARIANTS ---
  const highlightVariant: Variants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.8, delay: 0.8, ease: "circOut" },
    },
  };

  const scanLineVariant: Variants = {
    initial: { top: "0%", opacity: 0 },
    animate: {
      top: ["0%", "100%"],
      opacity: [1, 1, 0],
      transition: { duration: 2.5, ease: "linear" },
    },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: custom * 0.8, type: "spring", stiffness: 150 },
    }),
  };

  return (
    <section className="relative w-full min-h-screen bg-white text-gray-900 overflow-hidden pt-28  pb-10 font-sans selection:bg-yellow-200 selection:text-black">
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0 pointer-events-none opacity-50" />

      {/* --- BLOBS --- */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-100/60 rounded-full blur-[100px] -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-50/60 rounded-full blur-[100px] -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10">
        {/* --- LEFT COLUMN: CONTENT --- */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-6 lg:pt-0">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.0] mb-8 relative z-10">
            Turn Contracts Into <br />
            Predictable, Trackable, <br />
            {/* FIX: Highlight is strictly restricted to "Execution" */}
            <span className="relative inline-block mt-1">
              <motion.span
                variants={highlightVariant}
                initial="hidden"
                animate="visible"
                style={{ originX: 0 }}
                className="absolute bottom-2 left-[-2%] w-[104%] h-[40%] bg-yellow-300 -z-10 -rotate-1 rounded-sm opacity-100 mix-blend-multiply"
              />
              <span className="relative z-10">Execution.</span>
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-md lg:max-w-lg mb-8 lg:mb-10 font-medium px-2 lg:px-0">
            Jifwa is an AI-native, fully encrypted contract execution platform
            that ensures what's agreed in a contract actually happens during
            delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12 justify-center lg:justify-start px-6 sm:px-0">
            <Link
              href="/dashboard"
              className="h-14 px-8 rounded-full bg-gray-900 text-white font-bold text-base hover:bg-black hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-900/20 flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <button className="h-14 px-8 rounded-full bg-white text-gray-700 border border-gray-200 font-bold text-base hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
              <Play size={18} className="fill-gray-700" />
              Book Demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-bold text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gray-900" /> SOC2 Type II
              Ready
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gray-900" /> No credit card
              needed
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: PHONE UI --- */}
        <div className="relative h-[550px] lg:h-[570px] w-full flex items-center lg:items-start justify-center lg:justify-end perspective-[2500px] mt-8 lg:mt-0">
          <motion.div
            initial={{
              rotateY: isMobile ? 0 : -15,
              rotateX: isMobile ? 0 : 5,
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              rotateY: isMobile ? 0 : -10,
              rotateX: 0,
              opacity: 1,
              scale: 1,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-[280px] sm:w-[320px] h-full max-h-[600px] lg:max-h-[660px] bg-gray-900 rounded-[2.5rem] lg:rounded-[3rem] p-[6px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] z-20"
          >
            {/* Phone Bezel Reflection */}
            <div className="absolute inset-0 rounded-[2.5rem] lg:rounded-[3rem] border border-gray-600/30 pointer-events-none z-50 ring-1 ring-inset ring-white/10"></div>

            <div className="h-full w-full bg-white rounded-[2.2rem] lg:rounded-[2.7rem] overflow-hidden flex flex-col relative">
              {/* --- STATUS BAR --- */}
              <div className="h-12 w-full bg-white relative z-20 shrink-0 border-b border-gray-50">
                <span className="absolute left-6 top-4 text-[11px] font-bold text-gray-900 font-mono tracking-tight z-40">
                  {currentTime}
                </span>

                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black rounded-full z-30 flex items-center gap-2 px-3 py-1.5 shadow-xl min-w-[100px] justify-center overflow-hidden">
                  <motion.div
                    key={simulationKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Loader2 size={10} className="text-gray-400 animate-spin" />
                  </motion.div>
                  <motion.span
                    key={simulationKey + "txt"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2.5, times: [0, 0.1, 0.8, 1] }}
                    className="text-[10px] font-bold text-white tracking-wide uppercase whitespace-nowrap"
                  >
                    AI Scanning
                  </motion.span>
                </div>

                <div className="absolute right-6 top-4 flex gap-1.5 items-end z-40">
                  <div className="w-5 h-2.5 bg-gray-900 rounded-[2px]"></div>
                  <div className="w-0.5 h-1.5 bg-gray-400 rounded-[1px]"></div>
                </div>
              </div>

              {/* APP CONTENT */}
              <div className="flex-1 bg-gray-50/40 pt-6 px-4 pb-6 flex flex-col font-sans relative">
                <div className="bg-gray-100 h-9 rounded-xl mb-4 flex items-center px-3 gap-2">
                  <Search size={14} className="text-gray-400" />
                  <span className="text-[11px] text-gray-400 font-medium">
                    Search contracts...
                  </span>
                </div>

                {/* PDF Scanning Card */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 relative overflow-hidden group">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold text-gray-900 truncate">
                        MSA_Jifwa_Final.pdf
                      </div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Ready for extraction
                      </div>
                    </div>
                  </div>

                  {/* Laser Line */}
                  <motion.div
                    key={simulationKey}
                    variants={scanLineVariant}
                    initial="initial"
                    animate="animate"
                    className="absolute left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] z-0 pointer-events-none blur-[0.5px]"
                  />
                  {/* Laser Trail */}
                  <motion.div
                    key={simulationKey + "trail"}
                    initial={{ height: "0%", opacity: 0 }}
                    animate={{ height: "100%", opacity: 0.1 }}
                    transition={{ duration: 2.5, ease: "linear" }}
                    className="absolute top-0 left-0 right-0 bg-indigo-500 z-0 pointer-events-none"
                  />
                </div>

                {/* AI Badge */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    Jifwa AI Intelligence
                  </span>
                  <motion.div
                    key={simulationKey + "badge"}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 2.5, type: "spring" }}
                    className="flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md"
                  >
                    <Sparkles size={10} /> Analysis Complete
                  </motion.div>
                </div>

                {/* Extracted Data Items */}
                <div className="space-y-3">
                  <motion.div
                    key={simulationKey + "item1"}
                    custom={1}
                    variants={itemVariant}
                    initial="hidden"
                    animate="visible"
                    className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 border-l-[3px] border-l-blue-500"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-blue-500" />
                      <span className="text-[11px] font-bold text-gray-800">
                        App V1.0 Milestone
                      </span>
                    </div>
                    <div className="pl-5 text-[9px] text-gray-400">
                      Extracted from{" "}
                      <span className="text-gray-600 font-medium">
                        Clause 2.4
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    key={simulationKey + "item2"}
                    custom={2.5}
                    variants={itemVariant}
                    initial="hidden"
                    animate="visible"
                    className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 border-l-[3px] border-l-green-500"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard size={13} className="text-green-500" />
                      <span className="text-[11px] font-bold text-gray-800">
                        Initial Deposit: $15,000
                      </span>
                    </div>
                    <div className="pl-5 text-[9px] text-gray-400">
                      Syncing to{" "}
                      <span className="text-gray-600 font-medium">
                        Quickbooks
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Action Button */}
                <motion.div
                  key={simulationKey + "btn"}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 3.2, type: "spring" }}
                  className="mt-auto mx-auto bg-gray-900 text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 mb-2 hover:scale-105 transition-transform cursor-pointer"
                >
                  <Zap size={11} className="fill-white" />
                  <span className="text-[10px] font-bold tracking-wide">
                    Push 2 Updates to jifwa
                  </span>
                </motion.div>
              </div>
            </div>

            {/* --- FLOATING NOTIFICATIONS (Right) --- */}
            <AnimatePresence mode="wait">
              <motion.div
                key={RIGHT_NOTIFICATIONS[rightIndex].id}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: isMobile ? 0.85 : 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute ${RIGHT_NOTIFICATIONS[rightIndex].position} z-30 flex items-center gap-3 bg-white/80 backdrop-blur-xl p-2.5 pr-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/40 w-auto min-w-[170px]`}
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
                  <p className="text-[9px] text-gray-500 font-medium truncate w-24">
                    {RIGHT_NOTIFICATIONS[rightIndex].text}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* --- FLOATING NOTIFICATIONS (Left) --- */}
            <AnimatePresence mode="wait">
              <motion.div
                key={LEFT_NOTIFICATIONS[leftIndex].id}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: isMobile ? 0.85 : 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute ${LEFT_NOTIFICATIONS[leftIndex].position} z-30 flex items-center gap-3 bg-white/80 backdrop-blur-xl p-2.5 pr-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/40 w-auto min-w-[170px]`}
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
                  <p className="text-[9px] text-gray-500 font-medium truncate w-24">
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
