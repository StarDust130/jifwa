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
  ChevronDown,
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  // 1. Force Redirect if Vendor tries to view Client Pages
  useEffect(() => {
    setCurrentRole(initialRole);
    if (initialRole === "vendor") {
      fetchVendorTasks();
      if (pathname.startsWith("/projects") || pathname.startsWith("/billing")) {
        router.replace("/dashboard");
      }
    }
  }, [initialRole, pathname, router]);

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
          // Redirect logic when manually switching
          if (
            pathname.startsWith("/projects") ||
            pathname.startsWith("/billing")
          ) {
            router.push("/dashboard");
          }
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
  // 1. Define Base Links
  let navLinks = [{ name: "Dashboard", href: "/dashboard", icon: LayoutGrid }];

  // 2. Add Role-Specific Links
  if (currentRole === "client") {
    // Client sees Projects & Milestones
    navLinks.push(
      { name: "Projects", href: "/projects", icon: FolderKanban },
      { name: "Milestones", href: "/milestones", icon: FileText }
    );
  } else {
    // Vendor sees Assignments
    navLinks.push({
      name: "Assignments",
      href: "/assignments",
      icon: FileText,
    });
  }

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

    // 3. Dropdown Logic (Attached to "Assignments" for Vendors)
    const hasDropdown =
      currentRole === "vendor" &&
      link.name === "Assignments" &&
      vendorTasks.length > 0;

    return (
      <div className="mb-1">
        <Link
          href={link.href}
          className={cn(
            "group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
            isActive
              ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10 ring-1 ring-black/5"
              : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          )}
        >
          <div className="flex items-center gap-3 relative z-10">
            <div
              className={cn(
                "transition-transform duration-300 ease-out",
                "group-hover:scale-110",
                isActive
                  ? "text-white"
                  : "text-zinc-400 group-hover:text-zinc-900"
              )}
            >
              <link.icon size={16} strokeWidth={2} />
            </div>
            <span>{link.name}</span>
          </div>

          {hasDropdown && (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="p-0.5 -mr-1 rounded hover:bg-white/20 text-current transition-colors cursor-pointer z-20"
            >
              <ChevronDown
                size={12}
                className={cn(
                  "transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </div>
          )}
        </Link>

        {/* --- VENDOR TASK TREE --- */}
        <AnimatePresence>
          {hasDropdown && isDropdownOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="ml-[21px] pl-3 border-l border-zinc-100 mt-1 space-y-0.5">
                <p className="px-2 py-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={8} className="text-amber-500 fill-current" />{" "}
                  Priority
                </p>
                {vendorTasks.map((task, i) => (
                  <Link
                    key={i}
                    href={`/milestones/${task.projectId}`}
                    className="group/item flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-50 transition-colors"
                  >
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full ring-1 ring-white shadow-sm",
                        task.status === "in_review"
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      )}
                    />
                    <span className="text-[11px] font-medium text-zinc-500 group-hover/item:text-zinc-900 truncate max-w-[130px]">
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
    <div className="flex flex-col h-full bg-white border-r border-zinc-200 w-64 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
      {/* LOGO */}
      <Link href="/dashboard">
        <div className="h-16 flex items-center px-5 mb-2">
          <div className="relative w-28 h-16">
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

      {/* ROLE SWITCHER */}
      <div className="px-3 mb-6 relative z-30">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all duration-300",
                currentRole === "client"
                  ? "bg-zinc-900 group-hover:bg-black"
                  : "bg-emerald-600 group-hover:bg-emerald-700"
              )}
            >
              {currentRole === "client" ? (
                <Briefcase size={14} />
              ) : (
                <Box size={14} />
              )}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-900 capitalize leading-none mb-0.5">
                {currentRole}
              </p>
              <p className="text-[10px] text-zinc-500 font-medium">
                {currentRole === "client" ? "Manage" : "Execute"}
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
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSwitcherOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-full left-0 right-0 mt-2 mx-1 bg-white/95 backdrop-blur-md border border-zinc-200/80 rounded-xl shadow-2xl shadow-zinc-900/10 z-50 p-1.5 ring-1 ring-black/5"
              >
                <div className="space-y-0.5">
                  {/* Client Option */}
                  <button
                    disabled={isSwitching}
                    onClick={() => {
                      if (currentRole !== "client") handleRoleSwitch();
                      setIsSwitcherOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left relative",
                      currentRole === "client"
                        ? "bg-zinc-50"
                        : "hover:bg-zinc-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-md flex items-center justify-center text-zinc-700 border border-zinc-200 bg-white",
                        currentRole === "client" &&
                          "border-zinc-300 text-zinc-900"
                      )}
                    >
                      <Briefcase size={14} />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-zinc-900 block">
                        Client
                      </span>
                      <span className="text-[10px] text-zinc-500">Manage</span>
                    </div>
                    {currentRole === "client" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mr-1" />
                    )}
                  </button>

                  {/* Vendor Option */}
                  <button
                    disabled={isSwitching}
                    onClick={() => {
                      if (currentRole !== "vendor") handleRoleSwitch();
                      setIsSwitcherOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left relative",
                      currentRole === "vendor"
                        ? "bg-emerald-50/50"
                        : "hover:bg-zinc-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-md flex items-center justify-center text-zinc-700 border border-zinc-200 bg-white",
                        currentRole === "vendor" &&
                          "border-emerald-200 text-emerald-600 bg-emerald-50"
                      )}
                    >
                      <Box size={14} />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-zinc-900 block">
                        Vendor
                      </span>
                      <span className="text-[10px] text-zinc-500">Execute</span>
                    </div>
                    {currentRole === "vendor" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                    )}
                    {isSwitching && currentRole !== "vendor" && (
                      <Loader2
                        size={12}
                        className="animate-spin text-zinc-400"
                      />
                    )}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* LINKS */}
      <div className="flex-1 px-3 space-y-6 overflow-y-auto">
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

      {/* UPGRADE CARD (CLIENT ONLY) */}
      {currentRole === "client" && (
        <div className="px-3 pb-4">
          <Link
            href="/billing"
            className="group block rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-3.5 transition-all duration-300 hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 bg-zinc-900 rounded-md flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Zap size={12} className="fill-current" />
              </div>
              <span className="text-[9px] font-black bg-white border border-zinc-200 px-2 py-0.5 rounded-full text-zinc-900 uppercase tracking-wide">
                Pro
              </span>
            </div>
            <div>
              <p className="text-xs font-black text-zinc-900 uppercase tracking-wide">
                Upgrade Plan
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5 font-medium leading-snug">
                Unlock higher limits
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* FOOTER */}
      <div className="p-3 mt-auto border-t border-zinc-100 bg-zinc-50/40">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Link
            href="/docs"
            className="group flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 hover:shadow-sm transition-all duration-200"
          >
            <BookOpen
              size={14}
              className="mb-1 text-zinc-400 group-hover:text-zinc-900 transition-colors"
            />
            <span className="text-[9px] font-bold">Docs</span>
          </Link>
          <Link
            href="/support"
            className="group flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 hover:shadow-sm transition-all duration-200"
          >
            <LifeBuoy
              size={14}
              className="mb-1 text-zinc-400 group-hover:text-zinc-900 transition-colors"
            />
            <span className="text-[9px] font-bold">Help</span>
          </Link>
        </div>

        <SignOutButton>
          <button className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-bold text-zinc-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all group">
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
