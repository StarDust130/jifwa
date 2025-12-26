"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function ErrorPage({
  error,
}: {
  error?: Error & { digest?: string };
}) {
  const router = useRouter();

  // Use the specific code or fall back
  const errCode = error?.digest || "3709750365";

  return (
    // Updated background to a very light sky blue tint
    <div className="min-h-screen w-full bg-[#F0F9FF] flex items-center justify-center p-6 md:p-12 font-sans overflow-hidden">
      <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-4">
        
        {/* --- LEFT COLUMN: TEXT & BUTTONS --- */}
        <div className="flex-1 flex flex-col items-start text-left">
          
          {/* --- ERROR CODE LABEL (Sky-500) --- */}
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5 }}
             className="flex items-center gap-2 mb-4"
          >
            <p className="text-sky-500 font-bold text-sm md:text-base font-mono tracking-wider">
              ERR_CODE: {errCode}
            </p>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight"
          >
            Something <br />
            went wrong.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl mb-12 max-w-md leading-relaxed"
          >
            We couldn't find this page. Don't let this stop you and keep browsing.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            {/* Primary Button (Sky-500) */}
            <Link
              href="/"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-sky-500 text-white font-bold rounded-full shadow-[0_10px_25px_-5px_rgba(14,165,233,0.5)] hover:shadow-[0_15px_35px_-5px_rgba(14,165,233,0.6)] hover:bg-sky-600 transition-all duration-300 active:scale-95"
            >
              <Home size={20} />
              <span>Go to home</span>
            </Link>

            {/* Secondary Button */}
            <button
              onClick={() => router.back()}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-sky-200 text-sky-500 font-bold rounded-full hover:bg-sky-50 hover:border-sky-300 transition-all duration-300 active:scale-95"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Previous page</span>
            </button>
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN: SVG ILLUSTRATION (Blue Theme) --- */}
        <div className="flex-1 relative w-full max-w-xl h-[400px] md:h-[500px] flex items-center justify-center">
          <svg viewBox="0 0 500 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Beam Gradient: Sky Blue */}
              <linearGradient id="beam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.3" /> {/* sky-500 */}
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Floating background particles (Light Sky) */}
            {[...Array(6)].map((_, i) => (
              <motion.circle
                key={i}
                cx={Math.random() * 500}
                cy={Math.random() * 500}
                r={Math.random() * 5 + 2}
                fill="#E0F2FE" // sky-100
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: Math.random() * 3 + 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* UFO Container */}
            <motion.g
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M250 260 L 150 500 L 350 500 Z" fill="url(#beam-grad)" />
              
              {/* UFO Top Dome: Darker Blue */}
              <ellipse cx="250" cy="180" rx="60" ry="35" fill="#0284C7" /> {/* sky-600 */}
              <ellipse cx="250" cy="170" rx="40" ry="20" fill="#0EA5E9" /> {/* sky-500 */}

              {/* UFO Body Disk: Light Blue */}
              <ellipse cx="250" cy="220" rx="140" ry="40" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="3" /> {/* sky-200 body, sky-400 stroke */}
              <ellipse cx="250" cy="215" rx="120" ry="30" fill="#E0F2FE" /> {/* sky-100 */}

              {/* UFO Lights: Sky-500 */}
              <circle cx="160" cy="235" r="8" fill="#0EA5E9" />
              <circle cx="205" cy="245" r="8" fill="#0EA5E9" />
              <circle cx="250" cy="250" r="8" fill="#0EA5E9" />
              <circle cx="295" cy="245" r="8" fill="#0EA5E9" />
              <circle cx="340" cy="235" r="8" fill="#0EA5E9" />
            </motion.g>

            {/* Ghost being beamed up */}
            <motion.g
              animate={{ y: [0, -40, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <path
                d="M220 420 C 220 380, 280 380, 280 420 L 280 460 C 280 470, 270 480, 260 470 C 250 460, 240 470, 230 470 C 220 460, 220 450, 220 460 Z"
                fill="white"
              />
              <circle cx="240" cy="410" r="4" fill="#1E293B" /> {/* slate-800 eyes */}
              <circle cx="260" cy="410" r="4" fill="#1E293B" />
            </motion.g>
          </svg>
        </div>
      </div>
    </div>
  );
}