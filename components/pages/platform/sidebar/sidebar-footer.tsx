"use client";

import { useState } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import {
  BookOpen,
  LifeBuoy,
  LogOut,
  ChevronRight,
  Eclipse,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarFooterProps {
  currentRole: string;
}

export function SidebarFooter({ currentRole }: SidebarFooterProps) {
  const { signOut } = useClerk();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <>
      <div className="p-3 mt-auto flex flex-col gap-2">
        {/* 🟢 COMPACT "MICRO-CARD" (Fixed Size) */}
        {currentRole === "client" && (
          <Link href="/billing" className="block mb-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-xl bg-[#09090B] border border-zinc-800 shadow-lg cursor-pointer h-14" // Fixed height
            >
              {/* 1. Liquid Light Shimmer (Faster & Sharper) */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: "-200%" }}
                animate={{ x: "200%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "linear",
                  repeatDelay: 1,
                }}
              />

              {/* 2. Content Layout (Horizontal Flex) */}
              <div className="relative z-10 h-full flex items-center justify-between px-3">
                <div className="flex items-center gap-3">
                  {/* Glowing Icon Box */}
                  <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800/50 border border-zinc-700/50 group-hover:bg-zinc-800 transition-colors">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-[6px] rounded-full" />
                    <Eclipse
                      size={14}
                      className="text-yellow-400  relative z-10"
                    />
                  </div>

                  {/* Text Stack */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white tracking-tight">
                        Starter Plan
                      </span>
                      <span className="px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[6px] font-bold uppercase tracking-widest text-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.3)] backdrop-blur-md">
                        Must Try
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium group-hover:text-zinc-400 transition-colors">
                      Upgrade Workspace
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight
                  size={14}
                  className="text-zinc-600 group-hover:text-white transition-colors"
                />
              </div>
            </motion.div>
          </Link>
        )}

        {/* 🟢 TOOLS GRID (Compact) */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Docs", href: "/docs", icon: BookOpen },
            { name: "Support", href: "/support", icon: LifeBuoy },
          ].map((item) => (
            <Link key={item.name} href={item.href} className="col-span-1">
              <div className="flex flex-col items-center justify-center py-2 rounded-lg bg-white border border-zinc-200 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer group">
                <item.icon
                  size={14}
                  className="text-zinc-400 group-hover:text-primary transition-colors mb-1"
                />
                <span className="text-[10px] font-bold text-zinc-500 group-hover:text-primary transition-colors">
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 🟢 EXIT BUTTON (Slimmer) */}
        <button
          onClick={() => setShowLogout(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-red-50 hover:border-red-100 hover:text-red-600 text-zinc-500 transition-all group"
        >
          <LogOut
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="text-[11px] font-bold">Sign Out</span>
        </button>
      </div>

      {/* 🟢 LOGOUT MODAL (No Changes - It was perfect) */}
      <AnimatePresence>
        {showLogout && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogout(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[4px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              className="relative w-full max-w-[320px] bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 mb-4 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <LogOut size={20} className="text-red-600 ml-1" />
                  </div>
                </div>
                <h3 className="text-lg font-black text-primary mb-2">
                  Signing out?
                </h3>
                <p className="text-[13px] text-zinc-500 font-medium leading-relaxed px-2">
                  You will need to enter your credentials again to access the
                  workspace.
                </p>
              </div>
              <div className="grid grid-cols-2 border-t border-zinc-100 divide-x divide-zinc-100">
                <button
                  onClick={() => setShowLogout(false)}
                  className="p-4 text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="p-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Yes, Exit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
