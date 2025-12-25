"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, RefreshCw, Terminal } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden text-red-500 font-mono">
      
      {/* --- TV NOISE OVERLAY --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-20"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>
      
      {/* --- SCANLINES --- */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />

      {/* --- GLOW --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-30 flex flex-col items-center max-w-lg text-center px-6 border-l-2 border-r-2 border-red-900/30 py-12 bg-black/40 backdrop-blur-sm">
        
        {/* Animated Glitch Icon */}
        <motion.div
           animate={{ 
             x: [-2, 2, -2, 0],
             opacity: [1, 0.8, 1]
           }}
           transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
           className="mb-8"
        >
          <AlertOctagon size={64} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-white uppercase">
          System <span className="text-red-500">Failure</span>
        </h1>
        
        <div className="flex items-center gap-2 justify-center mb-6 text-red-400/60 text-xs">
          <Terminal size={12} />
          <span>ERR_CODE: {error.digest || "RUNTIME_EXCEPTION_0x82"}</span>
        </div>

        <p className="text-gray-400 mb-10 text-sm leading-relaxed max-w-xs mx-auto">
          A critical execution error occurred within the Jifwa neural core. The process has been terminated to protect data integrity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Cyber Button 1 */}
          <button
            onClick={() => reset()}
            className="h-12 px-8 bg-red-600 hover:bg-red-500 text-black font-bold uppercase tracking-wider text-xs transition-all duration-200 clip-path-polygon hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center justify-center gap-2"
            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
          >
            <RefreshCw size={14} className="animate-spin-slow" />
            Reboot System
          </button>
          
          {/* Cyber Button 2 */}
          <button
            onClick={() => window.location.href = '/'}
            className="h-12 px-8 bg-transparent border border-red-900/50 text-red-500 hover:border-red-500 hover:text-white font-bold uppercase tracking-wider text-xs transition-all duration-200 flex items-center justify-center"
          >
            Abort & Return
          </button>
        </div>
      </div>
      
      {/* Decorative Bottom Text */}
      <div className="absolute bottom-8 text-[10px] text-red-900 font-mono tracking-[0.3em] opacity-50">
        JIFWA_SECURE_ENVIRONMENT_V2.0
      </div>
    </div>
  );
}