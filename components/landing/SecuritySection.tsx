"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  FileKey,
  Fingerprint,
  Cpu,
  Activity,
  CheckCircle2,
  Server,
} from "lucide-react";

// --- ANIMATIONS ---

const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
  hover: {
    scale: 1.02,
    y: -5,
    boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const shimmerText: Variants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: { duration: 5, repeat: Infinity, ease: "linear" as const },
  },
};

const matrixRain: Variants = {
  animate: {
    y: ["0%", "100%"],
    opacity: [0, 1, 0],
    transition: { duration: 2, repeat: Infinity, ease: "linear" as const },
  },
};

const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      "0 0 0 0px rgba(168, 85, 247, 0.4)",
      "0 0 0 20px rgba(168, 85, 247, 0)",
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};

const SecuritySection = () => {
  return (
    <section
      id="security"
      className="relative w-full py-24 bg-white text-gray-900 overflow-hidden font-sans border-b border-gray-100"
    >
      {/* Background: Clean Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm"
          >
            <ShieldCheck size={12} />
            Zero-Trust Architecture
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6"
          >
            Your data never leaves <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
              our secure environment.
            </span>
          </motion.h2>

          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            We don't use OpenAI or Claude wrappers. We run our own self-hosted
            models so your contracts are never shared with third parties.
          </p>
        </div>

        {/* --- SECURITY BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]">
          {/* CARD 1: PRIVATE AI (The "Hero" Feature) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-2 relative bg-[#0F172A] text-white rounded-[2.5rem] p-10 overflow-hidden group shadow-2xl flex flex-col md:flex-row items-center gap-10 border border-gray-800"
          >
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 mix-blend-screen" />

            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner">
                <Cpu size={24} className="text-indigo-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Self-Hosted AI Models
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Unlike others, we don't send your data to OpenAI or Anthropic
                API. Jifwa runs a specialized legal LLM entirely within our own
                private cloud.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[10px] font-bold text-indigo-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>{" "}
                  NO EXTERNAL API CALLS
                </div>
                <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[10px] font-bold text-indigo-200 flex items-center gap-2">
                  <Lock size={10} /> DATA ISOLATION
                </div>
              </div>
            </div>

            {/* VISUAL: The "Obsidian Box" */}
            <div className="relative w-64 h-64 shrink-0 flex items-center justify-center">
              {/* Rotating Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-indigo-500/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border border-gray-700 rounded-full opacity-50"
              />

              {/* Core Cube */}
              <motion.div
                variants={pulseGlow}
                animate="animate"
                className="relative w-32 h-32 bg-gradient-to-br from-gray-800 to-black rounded-3xl border border-gray-700 flex items-center justify-center shadow-2xl z-20"
              >
                <Cpu
                  size={48}
                  className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />

                {/* Internal Activity Light */}
                <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* CARD 2: ENCRYPTION (Matrix Rain Effect) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-1 relative bg-white rounded-[2.5rem] border border-gray-200 p-8 overflow-hidden group shadow-lg"
          >
            {/* Matrix Rain BG */}
            <div className="absolute inset-0 flex justify-between px-8 opacity-[0.03] pointer-events-none select-none overflow-hidden font-mono text-xs">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  variants={matrixRain}
                  animate="animate"
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  010101
                  <br />
                  101010
                  <br />
                  001100
                  <br />
                  110011
                </motion.div>
              ))}
            </div>

            <div className="mb-auto relative z-10">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 border border-green-100 shadow-sm">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AES-256 Encryption
              </h3>

              {/* COOL HIGHLIGHT ANIMATION */}
              <p className="text-gray-500 text-sm leading-relaxed">
                Data at rest is{" "}
                <motion.span
                  variants={shimmerText}
                  animate="animate"
                  className="font-bold bg-gradient-to-r from-green-600 via-emerald-400 to-green-600 bg-[length:200%_auto] text-transparent bg-clip-text"
                >
                  locked with bank-grade keys.
                </motion.span>{" "}
                Not even our engineers can read your PDFs.
              </p>
            </div>

            {/* VISUAL: Floating Keys */}
            <div className="mt-8 flex items-center justify-center relative h-24">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bg-white p-3 rounded-xl shadow-lg border border-gray-100 z-10"
              >
                <FileKey size={28} className="text-green-500" />
              </motion.div>
              <div className="absolute inset-0 bg-green-500/5 blur-2xl rounded-full transform scale-75"></div>
            </div>
          </motion.div>

          {/* CARD 3: REAL-TIME AUDIT */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-1 relative bg-white rounded-[2.5rem] border border-gray-200 p-8 overflow-hidden group shadow-lg"
          >
            <div className="mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 border border-blue-100 shadow-sm">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Audit Logging
              </h3>
              <p className="text-gray-500 text-sm">
                Every action—view, download, or edit—is logged and timestamped.
              </p>
            </div>

            {/* VISUAL: Live Log */}
            <div className="mt-auto bg-slate-50 rounded-xl p-4 border border-slate-100 font-mono text-[9px] text-slate-400 space-y-2 shadow-inner">
              <div className="flex gap-2 items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>
                <span>[ACCESS_GRANTED] :: ADMIN_01</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>
                <span>[DECRYPTION_OK] :: FILE_22</span>
              </div>
              <div className="flex gap-2 items-center opacity-60">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                <span>[SYNC_COMPLETE] :: JIRA_ID</span>
              </div>
            </div>
          </motion.div>

          {/* CARD 4: SOC2 COMPLIANCE */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-2 relative bg-white rounded-[2.5rem] border border-gray-200 p-8 overflow-hidden group shadow-lg flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700">
                  <Fingerprint size={20} />
                </div>
                <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded border border-green-200">
                  Verified
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">
                SOC2 Type II Ready
              </h3>
              <p className="text-gray-500 text-sm max-w-md">
                Our infrastructure is continuously monitored. We maintain
                comprehensive evidence logs automatically.
              </p>
            </div>

            {/* VISUAL: Server Status */}
            <div className="relative w-48 h-32 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center gap-3 shadow-inner overflow-hidden">
              {/* Scanning Line */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-green-400/50 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
              />

              <div className="flex gap-2 w-3/4">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[90%] shadow-[0_0_5px_#22c55e]"></div>
                </div>
              </div>
              <div className="flex gap-2 w-3/4">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[75%] shadow-[0_0_5px_#22c55e]"></div>
                </div>
              </div>

              <div className="absolute bottom-3 right-4 flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-bold text-gray-400">
                  SYSTEM_OPTIMAL
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
