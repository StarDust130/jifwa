"use client";

import { motion, Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ComingSoon({ name = "Jifwa" }: { name?: string }) {
  const router = useRouter();

  // FIXED: Explicitly typed variants to resolve your TS errors
  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    initial: { opacity: 0, y: 40 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1], // The bezier curve for "Apple-like" smoothness
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-[#fcfcfc] text-black flex flex-col p-8 md:p-16 font-sans antialiased selection:bg-black selection:text-white overflow-hidden">
      {/* 1. Navigation */}
      <nav className="z-50">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-all"
        >
          <ArrowLeft
            size={16}
            strokeWidth={2.5}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          Back
        </button>
      </nav>

      {/* 2. Content */}
      <main className="flex-1 flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="max-w-6xl"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-8"
          >
      
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-400">
               {name} Page. Comming Soon
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-[13vw] md:text-[8vw] font-black leading-[0.9] tracking-[-0.06em] uppercase mb-12"
          >
            Building <br />
            <span className="text-zinc-200 italic font-medium tracking-tight mr-4">
              Something
            </span>{" "}
            <br />
            Special.
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-8 items-start md:items-center"
          >
            <motion.p
              variants={itemVariants}
              className="text-2xl md:text-3xl font-medium text-zinc-400 max-w-xl leading-tight tracking-tight text-balance"
            >
              We're crafting {name} with care. <br />
              <span className="text-black underline underline-offset-8 decoration-zinc-100 hover:decoration-black transition-all duration-300">
                Exciting updates coming soon 🚀
              </span>
            </motion.p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
