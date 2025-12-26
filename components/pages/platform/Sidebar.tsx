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
  ChevronDown,
  Circle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { toggleUserRole } from "@/app/actions/user";
import { getVendorSidebarData } from "@/app/actions/sidebar";

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

  // Vendor State
  const [vendorTasks, setVendorTasks] = useState<any[]>([]);
  const [isMilestonesOpen, setIsMilestonesOpen] = useState(true);

  useEffect(() => {
    setCurrentRole(initialRole);
    if (initialRole === "vendor") {
      fetchVendorTasks();
    }
  }, [initialRole]);

  const fetchVendorTasks = async () => {
    const tasks = await getVendorSidebarData();
    setVendorTasks(tasks);
  };

  const handleRoleSwitch = async () => {
    if (isSwitching) return;
    setIsSwitching(true);

    try {
      const result = await toggleUserRole();
      if (result.success && result.role) {
        setCurrentRole(result.role);
        setIsSwitcherOpen(false);

        if (result.role === "vendor") {
          if (pathname.includes("/billing")) router.push("/dashboard");
          fetchVendorTasks();
        }

        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSwitching(false);
    }
  };

  // --- MENU CONFIG ---
  let navLinks = [
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
  } else {
    navLinks = navLinks.filter((link) => link.name !== "Projects");
  }

  // --- NAV ITEM COMPONENT ---
  const NavItem = ({ link }: { link: any }) => {
    const isActive =
      pathname === link.href ||
      (link.href !== "/dashboard" && pathname.startsWith(link.href));
    const hasDropdown =
      currentRole === "vendor" &&
      link.name === "Milestones" &&
      vendorTasks.length > 0;

    return (
      <div className="mb-1">
        <Link
          href={link.href}
          className={cn(
            "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
            isActive
              ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 ring-1 ring-black/5"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
          )}
        >
          {/* Active Gradient Shine */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-20 pointer-events-none" />
          )}

          <div className="flex items-center gap-3 relative z-10">
            <div
              className={cn(
                "transition-all duration-300 ease-spring",
                "group-hover:scale-110 group-hover:-rotate-6",
                isActive
                  ? "text-white"
                  : "text-zinc-400 group-hover:text-zinc-900"
              )}
            >
              <link.icon size={18} strokeWidth={2} />
            </div>
            <span>{link.name}</span>
          </div>

          {hasDropdown && (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMilestonesOpen(!isMilestonesOpen);
              }}
              className="p-1 -mr-1 rounded-md hover:bg-white/10 text-current transition-colors cursor-pointer z-20"
            >
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform duration-300",
                  isMilestonesOpen && "rotate-180"
                )}
              />
            </div>
          )}
        </Link>

        {/* --- TREE VIEW TASKS --- */}
        <AnimatePresence>
          {hasDropdown && isMilestonesOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="ml-[21px] pl-4 border-l border-zinc-100 pt-2 pb-2 space-y-1">
                <p className="px-2 py-1 text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={8} className="text-amber-400" /> Priority
                </p>
                {vendorTasks.map((task, i) => (
                  <Link
                    key={i}
                    href={`/projects/${task.projectId}`}
                    className="group/item flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors"
                  >
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full ring-2 ring-white shadow-sm",
                        task.status === "in_review"
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      )}
                    />
                    <span className="text-xs font-medium text-zinc-500 group-hover/item:text-zinc-900 truncate max-w-[140px]">
                      {task.title}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-200 w-64 shadow-[2px_0_40px_-20px_rgba(0,0,0,0.05)]">
      {/* 1. LOGO */}
      <div className="h-20 flex items-center px-6 mb-2">
        <div className="relative w-32 h-10">
          <Image
            src="/logo.png"
            alt="Jifwa"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </div>

      {/* 2. SUPER COOL ROLE SWITCHER */}
      <div className="px-4 mb-6 relative z-30">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 hover:to-white hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md transition-all duration-500",
                currentRole === "client"
                  ? "bg-zinc-900 group-hover:rotate-3"
                  : "bg-emerald-600 group-hover:-rotate-3"
              )}
            >
              {currentRole === "client" ? (
                <Briefcase size={18} />
              ) : (
                <Box size={18} />
              )}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-900 capitalize leading-tight group-hover:text-blue-600 transition-colors">
                {currentRole}
              </p>
              <p className="text-[10px] text-zinc-500 font-medium">
                {currentRole === "client" ? "Organization" : "Workspace"}
              </p>
            </div>
          </div>
          <ChevronsUpDown
            size={14}
            className="text-zinc-400 group-hover:text-zinc-600"
          />
        </motion.button>

        <AnimatePresence>
          {isSwitcherOpen && (
            <>
              {/* Backdrop Closure */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSwitcherOpen(false)}
              />

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.95,
                  filter: "blur(4px)",
                }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="absolute top-full left-2 right-2 mt-2 bg-white/90 backdrop-blur-xl border border-zinc-200/80 rounded-2xl shadow-2xl shadow-zinc-900/20 z-50 p-2 ring-1 ring-black/5"
              >
                <div className="px-2 py-2 mb-1">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    Switch Context
                  </p>
                </div>

                <div className="space-y-1">
                  {/* CLIENT OPTION */}
                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      currentRole !== "client" && handleRoleSwitch()
                    }
                    disabled={isSwitching}
                    className={cn(
                      "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border relative overflow-hidden",
                      currentRole === "client"
                        ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                        : "bg-white border-transparent hover:bg-zinc-50 text-zinc-600"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        currentRole === "client"
                          ? "bg-white/20 text-white"
                          : "bg-zinc-100 text-zinc-500"
                      )}
                    >
                      <Briefcase size={16} />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-xs font-bold block">
                        Client View
                      </span>
                      <span
                        className={cn(
                          "text-[10px]",
                          currentRole === "client"
                            ? "text-zinc-400"
                            : "text-zinc-400"
                        )}
                      >
                        Manage Projects
                      </span>
                    </div>
                    {currentRole === "client" && (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    )}
                  </motion.button>

                  {/* VENDOR OPTION */}
                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      currentRole !== "vendor" && handleRoleSwitch()
                    }
                    disabled={isSwitching}
                    className={cn(
                      "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border relative overflow-hidden",
                      currentRole === "vendor"
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                        : "bg-white border-transparent hover:bg-zinc-50 text-zinc-600"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        currentRole === "vendor"
                          ? "bg-white/20 text-white"
                          : "bg-emerald-50 text-emerald-600"
                      )}
                    >
                      <Box size={16} />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-xs font-bold block">
                        Vendor View
                      </span>
                      <span
                        className={cn(
                          "text-[10px]",
                          currentRole === "vendor"
                            ? "text-emerald-100"
                            : "text-zinc-400"
                        )}
                      >
                        Execute Work
                      </span>
                    </div>
                    {currentRole === "vendor" && (
                      <CheckCircle2 size={16} className="text-white" />
                    )}

                    {/* Loading Spinner */}
                    {isSwitching && currentRole !== "vendor" && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                        <Loader2
                          size={16}
                          className="animate-spin text-zinc-900"
                        />
                      </div>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </>
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

      {/* 5. FOOTER */}
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
