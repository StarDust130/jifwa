"use client";

import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import {
  BookOpen,
  LifeBuoy,
  LogOut,
  ChevronRight,
  Eclipse,
  Check,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getPlanId, getPlanMeta, PlanId } from "@/lib/plans";
import { getPlanContext } from "@/app/actions/plan";

interface SidebarFooterProps {
  currentRole: string;
}

export function SidebarFooter({ currentRole }: SidebarFooterProps) {
  const { signOut } = useClerk();
  const [showLogout, setShowLogout] = useState(false);
  const [plan, setPlan] = useState<PlanId>("free");

  const handleLogout = () => {
    signOut({ redirectUrl: "/" });
  };

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const ctx = await getPlanContext();
        if (ctx?.plan) setPlan(getPlanId(ctx.plan));
      } catch (e) {
        // ignore
      }
    };

    fetchPlan();
  }, []);

  const planMeta = getPlanMeta(plan);

  return (
    <>
      <div className="p-3 mt-auto flex flex-col gap-2">
        {/* Plan CTA card (varies by current plan) */}
        {currentRole === "client" && (
          <Link
            href={
              plan === "agency"
                ? "mailto:contact@jifwa.com?subject=Enterprise%20Plan%20Inquiry"
                : "/billing"
            }
            className="block mb-1"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-xl bg-white border border-zinc-200 shadow-sm cursor-pointer h-14"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white via-zinc-50 to-white" />

              <div className="relative z-10 h-full flex items-center justify-between px-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200">
                    {plan === "agency" ? (
                      <Mail size={14} className="text-emerald-500" />
                    ) : (
                      <Eclipse size={14} className="text-amber-500" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-900 tracking-tight">
                        {planMeta.label}
                      </span>
                      {plan === "free" && (
                        <span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[7px] font-black uppercase tracking-widest text-emerald-600">
                          Upgrade
                        </span>
                      )}
                      {plan === "starter" && (
                        <span className="px-2 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[7px] font-black uppercase tracking-widest text-indigo-600">
                          Go Agency
                        </span>
                      )}
                      {plan === "agency" && (
                        <span className="px-2 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[7px] font-black uppercase tracking-widest text-zinc-700">
                          Enterprise
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      {plan === "agency"
                        ? "Need Enterprise Scale?"
                        : plan === "starter"
                        ? "Scale to unlimited projects"
                        : "Unlock more projects"}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  size={14}
                  className="text-zinc-400 group-hover:text-zinc-900 transition-colors"
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
