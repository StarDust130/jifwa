"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    // Background is #FFF6E9. With a transparent image, this will look perfect.
    <div className="min-h-screen w-full bg-[#FFF6E9] flex items-center justify-center p-6 font-sans">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >

        {/* LEFT SIDE — TEXT */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1 space-y-6">
          <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">
            Error
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold text-[#0f172a] leading-tight">
            Something <br /> went wrong!
          </h1>

          <p className="text-lg text-gray-600 max-w-md">
            The page you're trying to access encountered an unexpected error. 
            Don’t worry, this isn’t your fault.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/">
              <button className="px-8 py-3 bg-[#5468FF] hover:bg-[#4254cf] text-white text-lg font-semibold rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95">
                Go Back Home
              </button>
            </Link>

            <button
              onClick={() => reset()}
              className="px-8 py-3 bg-transparent border-2 border-[#5468FF] text-[#5468FF] hover:bg-[#5468FF] hover:text-white text-lg font-semibold rounded-full transition-all transform hover:scale-105 active:scale-95"
            >
              Try Again
            </button>
          </div>
        </div>

        {/* RIGHT SIDE — ILLUSTRATION */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center order-1 md:order-2"
        >
          <div className="relative w-full max-w-2xl">
            {/* Ensure this file is the transparent PNG provided above */}
            <img 
              src="/mammoth-error.png" 
              alt="Error Illustration" 
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}