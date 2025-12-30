"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Cpu,
  Activity,
  FileKey,
  Server,
  EyeOff,
  CheckCircle2,
  Database,
} from "lucide-react";

// --- BRAND COLORS ---
// Navy: #0B2447
// Teal: #14B8A6

// --- ANIMATIONS ---
const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(11, 36, 71, 0.05)",
    borderColor: "rgba(226, 232, 240, 1)", // slate-200
  },
  hover: {
    scale: 1.01,
    y: -6,
    boxShadow: "0 20px 40px -10px rgba(11, 36, 71, 0.15)",
    borderColor: "rgba(20, 184, 166, 0.4)", // teal-500/40
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const matrixRain: Variants = {
  animate: {
    y: ["0%", "100%"],
    opacity: [0, 1, 0],
    transition: { duration: 3, repeat: Infinity, ease: "linear" },
  },
};

const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      "0 0 0 0px rgba(20, 184, 166, 0.4)",
      "0 0 0 20px rgba(20, 184, 166, 0)",
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};

const SecuritySection = () => {
  return (
    <section
      id="security"
      className="relative w-full py-32 bg-white text-[#0B2447] overflow-hidden font-sans border-t border-slate-100"
    >
      {/* Background: Clean Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 text-[#14B8A6] text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm"
          >
            <ShieldCheck size={12} />
            Privacy-First Architecture
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B2447] mb-6"
          >
            Your Contract Data <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B2447] to-teal-600">
              Stays Private. Always.
            </span>
          </motion.h2>

          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
            Jifwa is built for confidentiality-critical workflows. End-to-end
            encryption by default. No third-party AI usage. Your secrets stay
            secret.
          </p>
        </div>

        {/* --- SECURITY BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(340px,auto)]">
          {/* CARD 1: PRIVATE AI (The "Obsidian Core") */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-2 relative bg-[#0B2447] text-white rounded-[2.5rem] p-10 overflow-hidden group shadow-2xl flex flex-col md:flex-row items-center gap-10 border border-[#162e4f]"
          >
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14B8A6]/10 rounded-full blur-[120px] -z-10 mix-blend-screen" />

            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner">
                <Cpu size={24} className="text-[#14B8A6]" />
              </div>

              <h3 className="text-2xl font-bold mb-4 text-white">
                No Third-Party AI APIs
              </h3>
              {/* PDF Source: Page 15, AI Usage  */}
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                We do not send your data to OpenAI, Claude, or external
                services. Jifwa runs specialized AI models entirely within our
                own secure infrastructure. Your data never trains our models.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="px-3 py-1.5 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full text-[10px] font-bold text-[#2DD4BF] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#14B8A6] rounded-full animate-pulse"></div>
                  ZERO DATA RETENTION
                </div>
                <div className="px-3 py-1.5 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full text-[10px] font-bold text-[#2DD4BF] flex items-center gap-2">
                  <EyeOff size={10} /> PRIVATE CLOUD
                </div>
              </div>
            </div>

            {/* VISUAL: The "Obsidian Core" */}
            <div className="relative w-64 h-64 shrink-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-[#14B8A6]/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border border-white/10 rounded-full opacity-50"
              />
              <motion.div
                variants={pulseGlow}
                animate="animate"
                className="relative w-32 h-32 bg-gradient-to-br from-[#0f1f38] to-black rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl z-20"
              >
                <Server
                  size={48}
                  className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]"
                />
                <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-[#14B8A6] rounded-full shadow-[0_0_10px_#14B8A6]"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* CARD 2: AES ENCRYPTION (Matrix Rain) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-1 relative bg-white rounded-[2.5rem] border border-slate-200 p-8 overflow-hidden group shadow-lg"
          >
            {/* Matrix Rain BG */}
            <div className="absolute inset-0 flex justify-between px-8 opacity-[0.04] pointer-events-none select-none overflow-hidden font-mono text-xs text-[#14B8A6]">
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
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-[#14B8A6] border border-teal-100 shadow-sm">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#0B2447] mb-3">
                AES-256 Encryption
              </h3>
              {/* PDF Source: Page 20 [cite: 466] */}
              <p className="text-slate-500 text-sm leading-relaxed">
                Data at rest is{" "}
                <span className="font-bold text-[#14B8A6]">
                  locked with bank-grade keys.
                </span>
                Even our engineers cannot read your PDFs.
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
                className="absolute bg-white p-3 rounded-xl shadow-lg border border-slate-100 z-10"
              >
                <FileKey size={28} className="text-[#14B8A6]" />
              </motion.div>
              <div className="absolute inset-0 bg-teal-100/30 blur-2xl rounded-full transform scale-75"></div>
            </div>
          </motion.div>

          {/* CARD 3: ZERO-KNOWLEDGE ACCESS (Logs) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-1 relative bg-white rounded-[2.5rem] border border-slate-200 p-8 overflow-hidden group shadow-lg"
          >
            <div className="mb-6">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-[#0B2447] border border-slate-200 shadow-sm">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#0B2447] mb-2">
                Zero-Knowledge Access
              </h3>
              {/* PDF Source: Page 20  */}
              <p className="text-slate-500 text-sm">
                Admins see only usage logs and metadata. Contract content
                remains encrypted and invisible to us.
              </p>
            </div>

            {/* VISUAL: Real Technical Logs (From Prompt) */}
            <div className="mt-auto bg-[#0B2447] rounded-xl p-4 border border-[#162e4f] font-mono text-[9px] text-slate-400 space-y-2 shadow-inner">
              <div className="flex gap-2 items-center">
                <div className="w-1.5 h-1.5 bg-[#14B8A6] rounded-full shadow-[0_0_5px_#14B8A6]"></div>
                <span>[AES_256_INIT] :: MSA_V1.PDF ... LOCKED</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_5px_#f43f5e]"></div>
                <span>[RBAC_CHECK] :: ADMIN_VIEW ... DENIED</span>
              </div>
              <div className="flex gap-2 items-center opacity-70">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                <span>[IMMUTABLE_LEDGER] :: HASH_#9X8_SAVED</span>
              </div>
            </div>
          </motion.div>

          {/* CARD 4: DEFENSE-IN-DEPTH (Security Stack) */}
          <motion.div
            variants={cardHover}
            initial="rest"
            whileHover="hover"
            className="md:col-span-2 relative bg-slate-50 rounded-[2.5rem] border border-slate-200 p-8 overflow-hidden group shadow-sm flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0B2447] shadow-sm border border-slate-200">
                  <ShieldCheck size={20} />
                </div>
                <span className="px-2.5 py-1 bg-white text-[#0B2447] text-[10px] font-bold uppercase rounded border border-slate-200">
                  Defense-in-Depth
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-2 text-[#0B2447]">
                Defense-in-Depth
              </h3>
              {/* PDF Source: Page 20 [cite: 465-467] */}
              <p className="text-slate-500 text-sm max-w-md">
                TLS 1.3 for data in transit. AES-256 for data at rest.
                Role-based access controls (RBAC) ensure only authorized users
                access key data.
              </p>
            </div>

            {/* VISUAL: Security Handshake */}
            <div className="relative w-48 h-32 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3 shadow-inner overflow-hidden">
              {/* Scanning Line */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-[#14B8A6]/50 shadow-[0_0_10px_rgba(20,184,166,0.5)]"
              />

              <div className="flex gap-2 w-3/4 items-center">
                <span className="text-[8px] font-bold text-[#0B2447] w-8">
                  TLS 1.3
                </span>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#14B8A6] w-[100%] shadow-[0_0_5px_#14B8A6]"></div>
                </div>
              </div>
              <div className="flex gap-2 w-3/4 items-center">
                <span className="text-[8px] font-bold text-[#0B2447] w-8">
                  AES-256
                </span>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#14B8A6] w-[100%] shadow-[0_0_5px_#14B8A6]"></div>
                </div>
              </div>

              <div className="absolute bottom-3 right-4 flex gap-1.5 items-center">
                <CheckCircle2 size={10} className="text-[#14B8A6]" />
                <span className="text-[8px] font-bold text-slate-400">
                  HANDSHAKE_SECURE
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
