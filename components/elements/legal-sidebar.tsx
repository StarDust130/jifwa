"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  FileText,
  CreditCard,
  Cpu,
  Mail,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

// Navigation Config
const NAV_ITEMS = [
  { href: "/privacy", label: "Privacy Policy", icon: Shield },
  { href: "/terms", label: "Terms of Use", icon: FileText },
  { href: "/refund", label: "Refund Policy", icon: CreditCard },
  { href: "/ai-security", label: "AI & Security", icon: Cpu },
];

export default function LegalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeLabel =
    NAV_ITEMS.find((i) => i.href === pathname)?.label || "Select Document";

  return (
    <div className="sticky top-8">
      {/* --- BACK BUTTON (FIXED UI) --- */}
      <button
        onClick={() => router.push("/")}
        className="group mb-8 flex items-center gap-3 text-sm font-bold transition-all
          /* MOBILE (Dark Header): Always White text */
          text-white hover:text-white/80
          /* DESKTOP (Light Sidebar): Slate text -> Navy on Hover */
          lg:text-slate-500 lg:hover:text-white"
      >
        <div
          className="
          w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm
          /* MOBILE: Glassy White -> Turns Solid White on Hover */
          bg-white/10 border border-white/20 text-white group-hover:bg-white group-hover:text-[#0B2447]
          /* DESKTOP: White -> Turns Navy on Hover */
          lg:bg-white lg:border-slate-200 lg:text-slate-500 lg:group-hover:bg-[#0B2447] lg:group-hover:border-[#0B2447] lg:group-hover:text-white
        "
        >
          <ArrowLeft size={18} className="transition-colors" />
        </div>
        <span>Back to Home</span>
      </button>

      {/* --- DESKTOP MENU --- */}
      <div className="hidden lg:block space-y-2 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-4 mb-3 mt-1">
          Documents
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                isActive
                  ? "bg-[#0B2447] text-white shadow-md shadow-blue-900/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#0B2447]"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={18}
                  className={
                    isActive
                      ? "text-[#14B8A6]"
                      : "text-slate-400 group-hover:text-[#0B2447]"
                  }
                />
                {item.label}
              </div>
              {isActive && (
                <ChevronRight size={14} className="text-[#14B8A6]" />
              )}
            </Link>
          );
        })}

        {/* Contact Widget */}
        <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-100/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Need Help?
          </p>
          <a
            href="mailto:contact@jifwa.com"
            className="flex items-center gap-2 text-sm font-bold text-[#0B2447] hover:text-[#14B8A6] transition-colors"
          >
            <Mail size={16} /> contact@jifwa.com
          </a>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <div className="lg:hidden relative z-50">
        <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-200">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 font-bold text-[#0B2447]"
          >
            <span className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse"></span>
              {activeLabel}
            </span>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="overflow-hidden border-t border-slate-100 mt-2 pt-2"
              >
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-slate-50 text-[#0B2447]"
                        : "text-slate-500"
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
