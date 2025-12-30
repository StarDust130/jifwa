"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Zap,
  Slack,
  Layers,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Activity,
  FileText,
  Lock,
  Database,
  Share2,
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 10px 30px -10px rgba(11, 36, 71, 0.05)",
    borderColor: "rgba(226, 232, 240, 1)", // slate-200
  },
  hover: {
    scale: 1.005,
    y: -5,
    boxShadow: "0 25px 60px -15px rgba(11, 36, 71, 0.15)",
    borderColor: "rgba(20, 184, 166, 0.4)", // teal-500/40
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

const scanBeam: Variants = {
  animate: {
    top: ["0%", "100%"],
    opacity: [0, 1, 0],
    transition: { duration: 2, repeat: Infinity, ease: "linear" },
  },
};

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="relative w-full py-32 bg-white text-[#0B2447] overflow-hidden font-sans"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="absolute top-[20%] left-[-10%] w-[800px] h-[800px] bg-teal-50/40 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 text-[#0B2447] text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm"
          >
            <Cpu size={12} className="text-[#14B8A6]" />
            Core Capabilities
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B2447] mb-6 leading-[1.1]"
          >
            Structure, Clarity, and <br />
            <span className="text-[#14B8A6]">Accountability Built In.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Jifwa converts a static contract into a guided execution workspace
            powered by private AI and protected by end-to-end encryption.
          </motion.p>
        </div>

        {/* --- BENTO GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[minmax(360px,auto)]">
          {/* CARD 1: AI-GUIDED MILESTONES (Large Span) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-2 relative bg-white rounded-[2rem] border border-slate-200 p-8 lg:p-10 overflow-hidden group"
          >
            {/* Soft Gradient BG */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-teal-50/20 -z-10"></div>

            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="mb-8 relative">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-[#14B8A6] border border-teal-100">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#0B2447] mb-3 tracking-tight">
                  AI-Guided Milestones
                </h3>
                <p className="text-slate-500 leading-relaxed max-w-lg">
                  Extract contract terms and convert them into clear, actionable
                  execution steps. Deliverables are interpreted and auto-tagged
                  for you.
                </p>
              </div>

              {/* VISUAL: Document Scanning Animation */}
              <div className="relative w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center group-hover:border-teal-200 transition-colors duration-500">
                {/* PDF Icon with Scan Beam */}
                <div className="w-16 h-20 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-2 shrink-0 relative overflow-hidden shadow-inner">
                  <FileText size={24} className="text-slate-400" />
                  <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
                  <div className="w-5 h-1 bg-slate-200 rounded-full"></div>

                  {/* SCAN BEAM (Teal) */}
                  <motion.div
                    variants={scanBeam}
                    animate="animate"
                    className="absolute left-0 w-full h-1.5 bg-[#14B8A6] shadow-[0_0_20px_#14B8A6] blur-[2px]"
                  ></motion.div>
                </div>

                {/* Arrow */}
                <div className="text-slate-300 rotate-90 sm:rotate-0">
                  <ArrowUpRight size={24} />
                </div>

                {/* Extracted Chips (Matches Phone UI Style) */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-3 py-1.5 bg-slate-50 text-[#0B2447] text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={12} className="text-[#14B8A6]" />{" "}
                    Milestone 1
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="px-3 py-1.5 bg-slate-50 text-[#0B2447] text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={12} className="text-[#14B8A6]" /> ₹
                    50,000
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="px-3 py-1.5 bg-slate-50 text-[#0B2447] text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={12} className="text-[#14B8A6]" /> Clause
                    2.4
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: EXECUTION ALIGNMENT (Vertical) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-1 relative bg-[#0B2447] text-white rounded-[2rem] p-8 lg:p-10 overflow-hidden group shadow-2xl shadow-blue-900/20"
          >
            {/* Dark Grid BG */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a5f_1px,transparent_1px),linear-gradient(to_bottom,#1e3a5f_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30 pointer-events-none"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-auto">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Share2 size={24} className="text-[#14B8A6]" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">
                  Execution Alignment
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Jifwa is an execution alignment layer that sits on top of your
                  contracts to ensure delivery happens exactly as agreed.
                </p>
              </div>

              {/* VISUAL: Connected Nodes (The Orbit) */}
              <div className="mt-12 relative h-48 flex items-center justify-center">
                {/* Center Node (Jifwa) */}
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center z-20 shadow-[0_0_40px_rgba(20,184,166,0.4)] border-4 border-[#0B2447]">
                  <span className="text-[#0B2447] font-black text-lg">J</span>
                </div>

                {/* Orbiting Nodes (Representing Email, Drive, WhatsApp) */}
                {[
                  {
                    icon: <Slack size={14} />,
                    bg: "bg-[#4A154B]",
                    pos: "top-0 right-4",
                  },
                  {
                    icon: <Database size={14} />,
                    bg: "bg-blue-600",
                    pos: "bottom-4 left-6",
                  },
                  {
                    icon: <Layers size={14} />,
                    bg: "bg-orange-500",
                    pos: "top-8 left-0",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={pulse}
                    animate="animate"
                    className={`absolute ${item.pos} w-10 h-10 ${item.bg} rounded-full flex items-center justify-center text-white z-10 border-2 border-[#0B2447] shadow-lg`}
                  >
                    {item.icon}
                  </motion.div>
                ))}

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                  <path
                    d="M120 100 L 180 60"
                    stroke="#14B8A6"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M120 100 L 60 140"
                    stroke="#14B8A6"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M120 100 L 40 80"
                    stroke="#14B8A6"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* CARD 3: EXECUTION HEALTH (Small) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-1 relative bg-white rounded-[2rem] border border-slate-200 p-8 lg:p-10 overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-50 rounded-bl-[4rem] -z-10 transition-transform duration-500 group-hover:scale-110"></div>

            <div className="mb-8">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-[#14B8A6] border border-teal-100">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#0B2447] mb-3 tracking-tight">
                Execution Health
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Identify risks early through delay, ambiguity, and dependency
                signals.
              </p>
            </div>

            {/* VISUAL: Risk Indicator */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Project Status
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                  </span>
                  <p className="text-lg font-mono font-bold text-[#0B2447]">
                    On Track
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center text-[#14B8A6] border border-teal-100">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </motion.div>

          {/* CARD 4: SECURITY & PRIVACY (Wide Bottom) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-2 relative bg-slate-50 rounded-[2rem] border border-slate-200 p-8 lg:p-10 overflow-hidden group flex flex-col md:flex-row gap-10 items-center"
          >
            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 text-[#0B2447] border border-slate-200 shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2447] mb-3 tracking-tight">
                Your Contract Data Stays Private
              </h3>
              <p className="text-slate-500 leading-relaxed">
                End-to-end encryption by default. No third-party AI usage. Even
                Jifwa's team cannot view your content.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-[#0B2447] border border-slate-200 flex items-center gap-2 shadow-sm">
                  <Lock size={12} className="text-[#14B8A6]" />
                  AES-256 Encryption
                </div>
                <div className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-[#0B2447] border border-slate-200 flex items-center gap-2 shadow-sm">
                  <ShieldCheck size={12} className="text-[#14B8A6]" />
                  SOC2 Type II Ready
                </div>
              </div>
            </div>

            {/* VISUAL: Shield UI */}
            <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/50 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-2xl">
                <div className="relative">
                  <ShieldCheck
                    size={64}
                    className="text-[#0B2447]"
                    strokeWidth={1.5}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#14B8A6] rounded-full p-1 border-2 border-white">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute bottom-6 right-0 bg-[#0B2447] text-white text-[10px] font-bold px-4 py-1.5 rounded-full border-[3px] border-white shadow-xl flex items-center gap-1.5"
              >
                <Lock size={10} /> SECURE
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
