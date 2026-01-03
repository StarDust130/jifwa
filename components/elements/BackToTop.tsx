"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Logic: Show after 400px of scrolling
      const scrolled = window.scrollY;
      if (scrolled > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // 2. Logic: Calculate scroll percentage for the progress ring
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = (scrolled / height) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 cursor-pointer group"
        >
          {/* --- THE COOL UI: PROGRESS RING + BUTTON --- */}
          <div className="relative h-14 w-14 flex items-center justify-center">
            {/* SVG Progress Ring (SaaS Depth) */}
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
              <circle
                cx="28"
                cy="28"
                r="26"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                className="text-gray-100"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="26"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                strokeDasharray="163.36" // 2 * PI * r
                initial={{ strokeDashoffset: 163.36 }}
                animate={{
                  strokeDashoffset: 163.36 - (163.36 * scrollProgress) / 100,
                }}
                className="text-black"
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              />
            </svg>

            {/* The Actual Button (Glass-morphism) */}
            <div className="h-11 w-11 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 flex items-center justify-center shadow-xl group-hover:bg-black group-hover:border-black transition-all duration-300">
              <ArrowUp
                size={20}
                className="text-black group-hover:text-white transition-colors duration-300"
                strokeWidth={3}
              />
            </div>

            {/* Tooltip (Only for PC) */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden lg:block">
              Top
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
