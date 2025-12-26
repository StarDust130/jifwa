"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Check,
  Zap,
  LogOut,
  Loader2,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
// 👇 This will now work because you created the file in Step 1
import { toggleUserRole } from "@/app/actions/user";

export default function Sidebar({
  initialRole = "client",
}: {
  initialRole?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // State to track role locally for immediate UI feedback
  const [currentRole, setCurrentRole] = useState(initialRole);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Sync state if parent prop changes (e.g. on refresh)
  useEffect(() => {
    setCurrentRole(initialRole);
  }, [initialRole]);

  // --- ROLE SWITCH LOGIC ---
  const handleRoleSwitch = async () => {
    if (isSwitching) return;

    setIsSwitching(true);
    try {
      // Call the Server Action
      const result = await toggleUserRole();

      if (result.success && result.role) {
        // 1. Update UI Immediately (Hides Billing)
        setCurrentRole(result.role);
        setIsSwitcherOpen(false);

        // 2. Refresh Server Data (Updates Page Content)
        router.refresh();
      } else {
        console.error("Failed to toggle role:", result.error);
      }
    } catch (e) {
      console.error("Action failed:", e);
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

  // 🔒 LOGIC: Only show Billing if the current role is 'client'
  if (currentRole === "client") {
    managementLinks.unshift({
      name: "Billing",
      href: "/billing",
      icon: CreditCard,
    });
  }

  const NavItem = ({ link }: { link: any }) => {
    const isActive =
      pathname === link.href ||
      (link.href !== "/dashboard" && pathname.startsWith(link.href));
    return (
      <Link
        href={link.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive
            ? "bg-zinc-100 text-zinc-900 border border-zinc-200/50"
            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
        )}
      >
        <link.icon
          size={16}
          className={cn(
            "transition-colors",
            isActive
              ? "text-zinc-900"
              : "text-zinc-400 group-hover:text-zinc-600"
          )}
        />
        <span>{link.name}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-200 w-64">
      {/* 1. BRAND HEADER */}
      <div className="h-16 flex items-center px-5 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
            <span className="text-white font-black text-xs">J</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-900">
            Jifwa.
          </span>
        </div>
      </div>

      {/* 2. ROLE SWITCHER */}
      <div className="p-4 relative">
        <button
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 hover:border-zinc-300 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-colors",
                currentRole === "client" ? "bg-zinc-900" : "bg-emerald-600"
              )}
            >
              {currentRole === "client" ? (
                <Briefcase size={14} />
              ) : (
                <Box size={14} />
              )}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-900 capitalize group-hover:text-black">
                {currentRole} View
              </p>
              <p className="text-[10px] text-zinc-500 font-medium">
                {currentRole === "client" ? "Manage Projects" : "Execute Work"}
              </p>
            </div>
          </div>
          <ChevronsUpDown
            size={14}
            className="text-zinc-400 group-hover:text-zinc-600"
          />
        </button>

        <AnimatePresence>
          {isSwitcherOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              className="absolute top-[80px] left-4 right-4 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 p-1 ring-1 ring-black/5"
            >
              <button
                disabled={isSwitching}
                onClick={handleRoleSwitch}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors text-left"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded flex items-center justify-center border",
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
                  <span className="text-xs font-bold text-zinc-700 block">
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

      {/* 3. NAVIGATION LIST */}
      <div className="flex-1 px-4 space-y-8 overflow-y-auto">
        <div className="space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Platform
          </p>
          {navLinks.map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </div>

        <div className="space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Account
          </p>
          {managementLinks.map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </div>
      </div>

      {/* 4. UPGRADE CARD (Only for Client) */}
      {currentRole === "client" && (
        <div className="px-4 pb-4">
          <Link
            href="/billing"
            className="group block rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-all duration-300 hover:border-zinc-300 hover:shadow-md hover:bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shadow-sm">
                <Zap size={14} className="fill-current" />
              </div>
              <span className="text-[9px] font-black bg-white border border-zinc-200 px-2 py-0.5 rounded-full text-zinc-600 uppercase tracking-wide">
                Pro
              </span>
            </div>
            <div>
              <p className="text-xs font-black text-zinc-900 uppercase tracking-wide">
                Upgrade Plan
              </p>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">
                Unlock higher limits
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* 5. FOOTER */}
      <div className="p-4 mt-auto border-t border-zinc-100 bg-zinc-50/50">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Link
            href="/docs"
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-zinc-200 transition-all text-zinc-500 hover:text-zinc-900"
          >
            <BookOpen size={14} className="mb-1" />
            <span className="text-[10px] font-medium">Docs</span>
          </Link>
          <Link
            href="/support"
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-zinc-200 transition-all text-zinc-500 hover:text-zinc-900"
          >
            <LifeBuoy size={14} className="mb-1" />
            <span className="text-[10px] font-medium">Help</span>
          </Link>
        </div>

        <SignOutButton>
          <button className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
