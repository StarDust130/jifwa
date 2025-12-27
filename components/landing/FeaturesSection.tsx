"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import {
  FileText,
  Zap,
  Slack,
  Trello,
  Layers,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  RefreshCw,
} from "lucide-react";

// --- ANIMATION VARIANTS (Fixed Types) ---
const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const pulse: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.5, 1, 0.5],
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
      className="relative w-full py-24 bg-white text-gray-900 overflow-hidden font-sans"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-yellow-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6"
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
              Accountability.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500"
          >
            Jifwa converts a static contract into a guided execution workspace
            powered by private AI and protected by end-to-end encryption[cite: 249].
          </motion.p>
        </div>

        {/* --- BENTO GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          {/* CARD 1: AI INTELLIGENCE (Large Span) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-2 relative bg-gray-50/50 rounded-[2rem] border border-gray-100 p-8 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -z-10"></div>

            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="mb-8">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center mb-4 text-black shadow-lg shadow-yellow-200">
                  <Zap size={20} className="fill-black" />
                </div>
                {/* PDF Source: Section 4 - Key Capabilities [cite: 251] */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  AI-Guided Milestones
                </h3>
                <p className="text-gray-500 max-w-md">
                  Extract contract terms and convert them into clear, actionable execution steps. 
                  Deliverables are interpreted and auto-tagged[cite: 252].
                </p>
              </div>

              {/* VISUAL: Document Scanning */}
              <div className="relative w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex gap-6 items-center">
                {/* PDF Icon */}
                <div className="w-12 h-16 bg-gray-100 rounded border border-gray-200 flex flex-col items-center justify-center gap-1 shrink-0 relative overflow-hidden">
                  <div className="w-6 h-1 bg-gray-300 rounded-full"></div>
                  <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
                  <div className="w-6 h-1 bg-gray-300 rounded-full"></div>
                  {/* SCAN BEAM */}
                  <motion.div
                    variants={scanBeam}
                    animate="animate"
                    className="absolute left-0 w-full h-1 bg-yellow-400 shadow-[0_0_10px_#FACC15]"
                  ></motion.div>
                </div>

                {/* Arrow */}
                <div className="text-gray-300">
                  <ArrowUpRight size={20} />
                </div>

                {/* Extracted Chips - Matches PDF Source: Deliverables & Payment Terms [cite: 40, 43] */}
                <div className="flex flex-wrap gap-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 flex items-center gap-1"
                  >
                    <CheckCircle2 size={10} /> App V1.0
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100 flex items-center gap-1"
                  >
                    <CheckCircle2 size={10} /> $15,000
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                    className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100 flex items-center gap-1"
                  >
                    <CheckCircle2 size={10} /> Net 30
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: ALIGNMENT LAYER (Vertical) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-1 relative bg-gray-900 text-white rounded-[2rem] p-8 overflow-hidden group shadow-xl"
          >
            {/* Dark Grid BG */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-auto">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center mb-4 border border-gray-700">
                  <RefreshCw size={20} className="text-white" />
                </div>
                {/* PDF Source: Section 3 - What Jifwa Does [cite: 244] */}
                <h3 className="text-xl font-bold mb-2">Execution Alignment</h3>
                <p className="text-gray-400 text-sm">
                  Jifwa sits on top of your contracts and ensures delivery happens exactly as agreed[cite: 244].
                </p>
              </div>

              {/* VISUAL: Connected Nodes */}
              <div className="mt-8 relative h-40 flex items-center justify-center">
                {/* Center Node (Jifwa) */}
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center z-20 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  <span className="text-black font-bold text-xs">J</span>
                </div>

                {/* Orbiting Nodes */}
                {[
                  {
                    icon: <Slack size={14} />,
                    bg: "bg-[#4A154B]",
                    delay: 0,
                    pos: "top-0 right-4",
                  },
                  {
                    icon: <Trello size={14} />,
                    bg: "bg-blue-600",
                    delay: 1,
                    pos: "bottom-2 left-6",
                  },
                  {
                    icon: <Layers size={14} />,
                    bg: "bg-orange-500",
                    delay: 2,
                    pos: "top-10 left-0",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={pulse}
                    animate="animate"
                    className={`absolute ${item.pos} w-8 h-8 ${item.bg} rounded-full flex items-center justify-center text-white z-10 border-2 border-gray-900`}
                  >
                    {item.icon}
                  </motion.div>
                ))}

                {/* Connection Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                  <line
                    x1="50%"
                    y1="50%"
                    x2="80%"
                    y2="20%"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="20%"
                    y2="80%"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="10%"
                    y2="40%"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* CARD 3: MILESTONE PAYMENTS (Wide Bottom) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-1 relative bg-white rounded-[2rem] border border-gray-200 p-8 overflow-hidden group shadow-sm hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10"></div>

            <div className="mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-700">
                <FileText size={20} />
              </div>
              {/* PDF Source: Milestone Payments [cite: 60, 43] */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Milestone Payments
              </h3>
              <p className="text-gray-500 text-sm">
                Ensure payments are released only when specific acceptance criteria are met[cite: 51].
              </p>
            </div>

            {/* VISUAL: Ticking Number */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  Contract Value
                </p>
                <p className="text-xl font-mono font-bold text-gray-900">
                  $45,200
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </motion.div>

          {/* CARD 4: SECURITY (Wide Bottom) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-2 relative bg-white rounded-[2rem] border border-gray-200 p-8 overflow-hidden group shadow-sm hover:shadow-xl flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="flex-1">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-4 text-gray-700">
                <ShieldCheck size={20} />
              </div>
              {/* PDF Source: Section 6 - Privacy & Security [cite: 274, 277] */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Contract Data Stays Private
              </h3>
              <p className="text-gray-500">
                End-to-end encryption by default. No third-party AI usage. 
                Even Jifwa&apos;s team cannot view your content [cite: 277-280].
              </p>

              <div className="mt-6 flex gap-4">
                <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  AES-256
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div> 
                  SOC2 Type II
                </div>
              </div>
            </div>

            {/* VISUAL: Shield UI */}
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gray-50 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-lg">
                <ShieldCheck
                  size={48}
                  className="text-gray-900"
                  strokeWidth={1.5}
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                SECURE
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;