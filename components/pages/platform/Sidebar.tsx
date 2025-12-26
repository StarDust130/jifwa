"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  FolderKanban,
  CreditCard,
  Settings,
  BookOpen,
  LifeBuoy,
  FileText,
  Briefcase,
  Box,
  ChevronsUpDown,
  Zap,
  LogOut,
  Loader2,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { toggleUserRole } from "@/app/actions/user";

export default function Sidebar({
  initialRole = "client",
}: {
  initialRole?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentRole, setCurrentRole] = useState(initialRole);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    setCurrentRole(initialRole);
  }, [initialRole]);

  // --- LOGIC: SWITCH ROLE ---
  const handleRoleSwitch = async () => {
    if (isSwitching) return;
    setIsSwitching(true);

    try {
      const result = await toggleUserRole();

      if (result.success && result.role) {
        setCurrentRole(result.role);
        setIsSwitcherOpen(false);
        if (result.role === "vendor" && pathname.includes("/billing")) {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (e) {
      console.error("Action error:", e);
    } finally {
      setIsSwitching(false);
    }
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Milestones", href: "/milestones", icon: FileText },
  ];

  const managementLinks = [
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  if (currentRole === "client") {
    managementLinks.unshift({
      name: "Billing",
      href: "/billing",
      icon: CreditCard,
    });
  }

  // --- NAV ITEM COMPONENT ---
  const NavItem = ({ link }: { link: any }) => {
    const isActive =
      pathname === link.href ||
      (link.href !== "/dashboard" && pathname.startsWith(link.href));
    return (
      <Link
        href={link.href}
        className={cn(
          "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
          isActive
            ? "bg-zinc-100 text-zinc-900 shadow-sm border border-zinc-200/60" // "Dark White" Active State
            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
        )}
      >
        {/* ICON ANIMATION: Pops when you hover ANYWHERE on the link */}
        <div
          className={cn(
            "transition-all duration-300 ease-out",
            "group-hover:scale-110 group-hover:-rotate-3 group-hover:text-zinc-900", // Animation triggers on group hover
            isActive ? "text-zinc-900" : "text-zinc-400"
          )}
        >
          <link.icon size={18} strokeWidth={2} />
        </div>

        <span>{link.name}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-200 w-64 shadow-[2px_0_20px_-10px_rgba(0,0,0,0.03)]">
      {/* 1. LOGO HEADER (Fixed: Big Image, No Text) */}
      <Link href="/dashboard">
        <div className="h-20 flex items-center px-6">
          <div className="relative w-32 h-16">
        <Image
          src="/logo.png"
          alt="Jifwa"
          fill
          className="object-contain object-left"
          priority
        />
          </div>
        </div>
      </Link>

      {/* 2. ROLE SWITCHER */}
      <div className="px-4 mb-6 relative z-20">
        <button
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm transition-all group active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm transition-colors",
                currentRole === "client" ? "bg-zinc-900" : "bg-emerald-600"
              )}
            >
              {currentRole === "client" ? (
                <Briefcase size={16} />
              ) : (
                <Box size={16} />
              )}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-900 capitalize leading-tight">
                {currentRole} View
              </p>
              <p className="text-[10px] text-zinc-500 font-medium">
                {currentRole === "client" ? "Manage" : "Execute"}
              </p>
            </div>
          </div>
          <ChevronsUpDown
            size={14}
            className="text-zinc-400 group-hover:text-zinc-600 transition-transform"
          />
        </button>

        <AnimatePresence>
          {isSwitcherOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.98 }}
              transition={{ duration: 0.1 }}
              className="absolute top-full left-4 right-4 mt-2 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 p-1 ring-1 ring-black/5"
            >
              <button
                disabled={isSwitching}
                onClick={handleRoleSwitch}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors text-left group"
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center border transition-colors",
                    currentRole === "client"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600"
                  )}
                >
                  {currentRole === "client" ? (
                    <UserCircle size={14} />
                  ) : (
                    <Briefcase size={14} />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-zinc-700 block group-hover:text-zinc-900">
                    Switch to {currentRole === "client" ? "Vendor" : "Client"}
                  </span>
                </div>
                {isSwitching && (
                  <Loader2 size={12} className="animate-spin text-zinc-400" />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. LINKS */}
      <div className="flex-1 px-4 space-y-8 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Platform
          </p>
          {navLinks.map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </div>

        <div className="space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Account
          </p>
          {managementLinks.map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </div>
      </div>

      {/* 4. UPGRADE CARD (CLIENT ONLY) */}
      {currentRole === "client" && (
        <div className="px-4 pb-4">
          <Link
            href="/billing"
            className="group block rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50/50 p-4 transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <Zap size={14} className="fill-current" />
              </div>
              <span className="text-[9px] font-black bg-white border border-zinc-200 px-2 py-0.5 rounded-full text-zinc-900 uppercase tracking-wide">
                Pro
              </span>
            </div>
            <div>
              <p className="text-xs font-black text-zinc-900 uppercase tracking-wide">
                Upgrade Plan
              </p>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium leading-snug">
                Unlock AI limits & team seats
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* 5. FOOTER (Clean Hover) */}
      <div className="p-4 mt-auto border-t border-zinc-100 bg-zinc-50/30">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link
            href="/docs"
            className="group flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 hover:shadow-sm transition-all duration-200"
          >
            <BookOpen
              size={16}
              className="mb-1.5 text-zinc-400 group-hover:text-zinc-900 group-hover:scale-110 transition-all"
            />
            <span className="text-[10px] font-bold">Docs</span>
          </Link>
          <Link
            href="/support"
            className="group flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 hover:shadow-sm transition-all duration-200"
          >
            <LifeBuoy
              size={16}
              className="mb-1.5 text-zinc-400 group-hover:text-zinc-900 group-hover:scale-110 transition-all"
            />
            <span className="text-[10px] font-bold">Help</span>
          </Link>
        </div>

        <SignOutButton>
          <button className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all group">
            <LogOut
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />{" "}
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
