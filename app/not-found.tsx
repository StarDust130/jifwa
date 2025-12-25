"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    // CHANGED: bg-[#050505] -> bg-white, text-white -> text-gray-900
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center overflow-hidden font-sans text-gray-900 selection:bg-indigo-100">
      
      {/* --- BACKGROUND GRAPHICS (The Dotted Swirl) --- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 800 800" className="opacity-60 max-w-[1000px] max-h-[1000px]">
          <defs>
            <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {/* CHANGED: Adjusted colors slightly for better visibility on white */}
              <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo-600 */}
              <stop offset="100%" stopColor="#A855F7" /> {/* Purple-500 */}
            </linearGradient>
          </defs>

          {/* Rotating Dot Field */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          >
            {Array.from({ length: 40 }).map((_, i) => {
              const angle = (i / 40) * Math.PI * 2;
              return Array.from({ length: 20 }).map((_, j) => {
                const radius = 150 + j * 10;
                const x = 400 + Math.cos(angle + j * 0.1) * radius;
                const y = 400 + Math.sin(angle + j * 0.1) * radius;
                const size = (j / 20) * 2;
                return (
                  <circle
                    key={`${i}-${j}`}
                    cx={x}
                    cy={y}
                    r={size}
                    fill="url(#dotGradient)"
                    // CHANGED: Increased base opacity slightly so dots aren't invisible on white
                    opacity={0.4 + (j / 20) * 0.5}
                  />
                );
              });
            })}
          </motion.g>

          {/* Thin Orbital Rings */}
          <motion.circle
            cx="400" cy="400" r="250"
            fill="none" 
            stroke="#6366F1" // Indigo-500
            strokeWidth="0.5" 
            strokeOpacity="0.4"
            strokeDasharray="10 20"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />
          <motion.path
             d="M 400 400 m -300, 0 a 300,300 0 1,0 600,0 a 300,300 0 1,0 -600,0"
             fill="none"
             stroke="#8B5CF6" // Violet-500
             strokeWidth="1"
             strokeOpacity="0.3"
             strokeDasharray="50 150"
             animate={{ rotate: 360 }}
             transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
             style={{ transformOrigin: "center" }}
          />
        </svg>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        {/* The 404 Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          {/* Number 4 */}
          {/* CHANGED: text-white -> text-gray-900 */}
          <span className="text-[8rem] md:text-[10rem] font-bold leading-none tracking-tighter text-gray-900">
            4
          </span>

          {/* The Central Swirl Logo (The '0') */}
          <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
            {/* Logo SVG */}
            {/* CHANGED: Added text-indigo-600 to color the logo paths */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-600 fill-current">
               <motion.g
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 style={{ transformOrigin: "center" }}
               >
                 <path d="M50 50 m-40 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray="60 200" opacity="0.1" />
                 
                 {/* Inner Swirls */}
                 {/* CHANGED: fill="white" -> fill="currentColor" (takes the indigo color) */}
                 <path d="M50 20 A 30 30 0 0 1 80 50 L 50 50 Z" fill="currentColor" />
                 <path d="M80 50 A 30 30 0 0 1 50 80 L 50 50 Z" fill="currentColor" />
                 <path d="M50 80 A 30 30 0 0 1 20 50 L 50 50 Z" fill="currentColor" />
                 <path d="M20 50 A 30 30 0 0 1 50 20 L 50 50 Z" fill="currentColor" />
                 
                 {/* Center hole */}
                 {/* CHANGED: fill="#050505" -> fill="#ffffff" (matches the new background) */}
                 <circle cx="50" cy="50" r="12" fill="#ffffff" />
               </motion.g>
            </svg>
          </div>

          {/* Number 4 */}
          {/* CHANGED: text-white -> text-gray-900 */}
          <span className="text-[8rem] md:text-[10rem] font-bold leading-none tracking-tighter text-gray-900">
            4
          </span>
        </motion.div>

        {/* Text */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          // CHANGED: text-white -> text-gray-900
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          // CHANGED: text-gray-400 -> text-gray-500 (Better contrast on white)
          className="text-gray-500 text-lg mb-10 max-w-md mx-auto"
        >
          Sorry, we couldn't find the page you're looking for.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/"
            // CHANGED: Adjusted shadow to be lighter and colored (indigo-200) instead of a dark glow
            className="px-8 py-3 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
          >
            Back To Home
          </Link>
        </motion.div>

      </div>
    </div>
  );
}