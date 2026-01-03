"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Gauge, Sparkles, Users, ShieldCheck, PanelTop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/overview", label: "Overview", icon: Gauge },
  { href: "/admin/latest", label: "Latest", icon: Sparkles },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminFrame({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 flex gap-6">
        <aside className="hidden lg:block w-64 shrink-0">
          <Card className="sticky top-6 bg-white/90 backdrop-blur border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
                    Admin
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Control Center
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 space-y-1">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="block">
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition border",
                        active
                          ? "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm"
                          : "bg-white text-slate-700 border-slate-100 hover:bg-slate-50"
                      )}
                    >
                      <Icon size={16} />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </aside>

        <main className="flex-1 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-indigo-600 font-semibold">
                  Admin Console
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-black text-slate-900 leading-tight">
                    {title}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 border border-slate-200">
                    <PanelTop size={14} />
                    Live panel
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                  {description}
                </p>
              </div>
              {action ? (
                <div className="flex items-center gap-2">{action}</div>
              ) : null}
            </div>

            <div className="lg:hidden -mx-1 flex gap-2 overflow-x-auto pb-2">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant={active ? "default" : "secondary"}
                    size="sm"
                    asChild
                    className={cn(
                      "rounded-full px-3",
                      active
                        ? "bg-indigo-600 hover:bg-indigo-500"
                        : "bg-white text-slate-700 border-slate-200"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <Icon size={14} /> {item.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
