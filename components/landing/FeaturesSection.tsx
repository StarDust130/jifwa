"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Zap,
  Slack,
  Trello,
  Layers,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Activity,
  FileText,
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
  },
  hover: {
    scale: 1.01,
    y: -8,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const pulse: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

const scanBeam: Variants = {
  animate: {
    top: ["0%", "100%"],
    opacity: [0, 1, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: "linear" },
  },
};

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="relative w-full py-28 bg-white text-gray-900 overflow-hidden font-sans"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-yellow-50/40 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm"
          >
            <Cpu size={12} />
            System Capabilities
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6"
          >
            Structure, Clarity, and <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900">
              Accountability Built In.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Jifwa converts a static contract into a guided execution workspace
            powered by private AI and protected by end-to-end encryption.
          </motion.p>
        </div>

        {/* --- BENTO GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(340px,auto)]">
          {/* CARD 1: AI-GUIDED MILESTONES (Large Span) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-2 border relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem]  border-black/30 p-8 lg:p-10 overflow-hidden group ring-1 ring-gray-100"
          >
            {/* Soft Gradient BG */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-blue-50/30 -z-10"></div>

            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="mb-8 relative">
                <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 text-black shadow-lg shadow-yellow-400/20 ring-4 ring-yellow-50/50">
                  <Zap size={22} className="fill-black" />
                </div>
                {/* Source: PDF Page 10 */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  AI-Guided Milestones
                </h3>
                <p className="text-gray-500 leading-relaxed max-w-lg">
                  We extract contract terms and convert them into clear,
                  actionable execution steps. Deliverables are interpreted and
                  auto-tagged for you.
                </p>
              </div>

              {/* VISUAL: Document Scanning Animation */}
              <div className="relative w-full bg-white rounded-2xl border border-black/30  p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center group-hover:border-yellow-200 transition-colors duration-500">
                {/* PDF Icon */}
                <div className="w-14 h-20 bg-gray-50 rounded-lg border border-black/30  flex flex-col items-center justify-center gap-1.5 shrink-0 relative overflow-hidden">
                  <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
                  <div className="w-5 h-1.5 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
                  {/* SCAN BEAM */}
                  <motion.div
                    variants={scanBeam}
                    animate="animate"
                    className="absolute left-0 w-full h-1.5 bg-yellow-400 shadow-[0_0_15px_#FACC15] blur-[1px]"
                  ></motion.div>
                </div>

                {/* Arrow */}
                <div className="text-gray-300 rotate-90 sm:rotate-0">
                  <ArrowUpRight size={24} />
                </div>

                {/* Extracted Chips */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={12} /> App V1.0
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={12} /> $15,000
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={12} /> Net 30
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
            className="md:col-span-1 relative bg-gray-900 text-white rounded-[2.5rem] p-8 lg:p-10 overflow-hidden group shadow-2xl ring-1 ring-gray-800"
          >
            {/* Dark Grid BG */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-auto">
                <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 border border-gray-700 shadow-inner">
                  <RefreshCw size={22} className="text-white" />
                </div>
                {/* Source: PDF Page 10 */}
                <h3 className="text-xl font-bold mb-3 tracking-tight">
                  Execution Alignment
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Jifwa is an alignment layer that sits on top of your contracts
                  to ensure delivery happens exactly as agreed.
                </p>
              </div>

              {/* VISUAL: Connected Nodes */}
              <div className="mt-10 relative h-48 flex items-center justify-center">
                {/* Center Node (Jifwa) */}
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center z-20 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <span className="text-black font-black text-lg">J</span>
                </div>

                {/* Orbiting Nodes */}
                {[
                  {
                    icon: <Slack size={14} />,
                    bg: "bg-[#4A154B]",
                    pos: "top-0 right-4",
                  },
                  {
                    icon: <Trello size={14} />,
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
                    className={`absolute ${item.pos} w-9 h-9 ${item.bg} rounded-full flex items-center justify-center text-white z-10 border-2 border-gray-900 shadow-lg`}
                  >
                    {item.icon}
                  </motion.div>
                ))}

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <path
                    d="M120 100 L 180 60"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M120 100 L 60 140"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M120 100 L 40 80"
                    stroke="white"
                    strokeWidth="1"
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
            className="md:col-span-1 relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-black/30  p-8 lg:p-10 overflow-hidden group ring-1 ring-gray-100"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-[4rem] -z-10 transition-transform duration-500 group-hover:scale-110"></div>

            <div className="mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-700 ring-4 ring-blue-50">
                <Activity size={22} />
              </div>
              {/* Source: PDF Page 11 */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                Execution Health
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Identify risks early through delay, ambiguity, and dependency
                signals.
              </p>
            </div>

            {/* VISUAL: Risk Indicator */}
            <div className="bg-white rounded-xl p-4 border border-black/30  flex justify-between items-center shadow-sm">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Project Status
                </p>
                <p className="text-lg font-mono font-bold text-gray-900 mt-0.5">
                  On Track
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md shadow-green-200">
                <CheckCircle2 size={18} />
              </div>
            </div>
          </motion.div>

          {/* CARD 4: SECURITY & PRIVACY (Wide Bottom) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-2 relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-black/30  p-8 lg:p-10 overflow-hidden group flex flex-col md:flex-row gap-10 items-center ring-1 ring-gray-100"
          >
            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 text-gray-700 ring-4 ring-gray-50">
                <ShieldCheck size={22} />
              </div>
              {/* Source: PDF Page 11 */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                Your Contract Data Stays Private
              </h3>
              <p className="text-gray-500 leading-relaxed">
                End-to-end encryption by default. No third-party AI usage. Even
                Jifwa&apos;s team cannot view your content.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-gray-700 border border-black/30  flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  AES-256 Encryption
                </div>
                <div className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-gray-700 border border-black/30  flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  SOC2 Type II Ready
                </div>
              </div>
            </div>

            {/* VISUAL: Shield UI */}
            <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gray-50/80 rounded-full animate-pulse"></div>
              <div className="absolute inset-6 bg-white border border-black/30  rounded-full flex items-center justify-center shadow-2xl">
                <ShieldCheck
                  size={56}
                  className="text-gray-900"
                  strokeWidth={1.5}
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute bottom-4 right-4 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full border-4 border-white shadow-lg"
              >
                SECURE
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
