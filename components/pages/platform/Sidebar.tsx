"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toggleUserRole } from "@/app/actions/user";
import { getVendorSidebarData } from "@/app/actions/sidebar";

// Icons
import {
  LayoutGrid,
  FolderKanban,
  FileText,
  Layers,
  Settings,
  CreditCard,
  Briefcase,
  Box,
  ArrowRight, // 🟢 Added Arrow Icon
} from "lucide-react";

// Sub-components
import { RoleSwitcher } from "./sidebar/role-switcher";
import { NavItem } from "./sidebar/nav-item";
import { SidebarFooter } from "./sidebar/sidebar-footer";

export default function Sidebar({
  initialRole = "client",
}: {
  initialRole?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentRole, setCurrentRole] = useState(initialRole);
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  const [targetRole, setTargetRole] = useState<string | null>(null);

  // 1. Initialize & Protect
  useEffect(() => {
    setCurrentRole(initialRole);
    if (initialRole === "vendor") {
      fetchVendorData();
      if (pathname.startsWith("/projects") || pathname.startsWith("/billing")) {
        router.replace("/dashboard");
      }
    }
  }, [initialRole, pathname, router]);

  const fetchVendorData = async () => {
    try {
      const rawData = await getVendorSidebarData();

      const uniqueProjectsMap = new Map();
      rawData.forEach((item: any) => {
        const pId = item.projectId || item._id;
        if (!uniqueProjectsMap.has(pId)) {
          uniqueProjectsMap.set(pId, {
            projectId: pId,
            displayName: item.contractName || item.title || "Untitled Project",
          });
        }
      });

      const uniqueProjects = Array.from(uniqueProjectsMap.values());
      setRecentAssignments(uniqueProjects.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch sidebar data", err);
    }
  };

  // 2. Cinematic Role Switch
  const handleRoleSwitch = async (newRole: string) => {
    if (newRole === currentRole || targetRole) return;

    // Start Animation
    setTargetRole(newRole);

    try {
      const result = await toggleUserRole();
      if (result.success && result.role) {
        // 🟢 WAIT FOR ANIMATION (1.5s total)
        setTimeout(() => {
          setCurrentRole(result.role);
          if (result.role === "vendor") {
            if (
              pathname.startsWith("/projects") ||
              pathname.startsWith("/billing")
            ) {
              router.push("/dashboard");
            }
            fetchVendorData();
          } else {
            setRecentAssignments([]);
          }
          router.refresh();

          // Close Loading Screen
          setTimeout(() => setTargetRole(null), 300);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
      setTargetRole(null);
    }
  };

  // 3. Menu Config
  const getNavLinks = () => {
    const base = [{ name: "Dashboard", href: "/dashboard", icon: LayoutGrid }];

    if (currentRole === "client") {
      return [
        ...base,
        { name: "Projects", href: "/projects", icon: FolderKanban },
        { name: "Milestones", href: "/milestones", icon: FileText },
      ];
    }

    return [
      ...base,
      {
        name: "Assignments",
        href: "/assignments",
        icon: Layers,
        isDropdown: true,
      },
    ];
  };

  const getAccountLinks = () => {
    const base = [{ name: "Settings", href: "/settings", icon: Settings }];
    if (currentRole === "client") {
      return [{ name: "Billing", href: "/billing", icon: CreditCard }, ...base];
    }
    return base;
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] border-r border-zinc-200/80 w-64 relative z-40 font-sans">
      {/* 🟢 FULL SCREEN DARK MIGRATION ANIMATION */}
      {/* 🟢 CLEAN & EASE MODE SWITCH */}
      <AnimatePresence mode="wait">
        {targetRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-[#000000] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* 1. Soft Ambient Glow (Subtle) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] blur-[80px] pointer-events-none"
            />

            <div className="relative z-10 flex flex-col items-center gap-8">
              {/* 2. The Icon - Bounces In */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 120,
                  damping: 12,
                }}
                className="relative"
              >
                {/* White Glow behind icon */}
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-110" />

                <div className="relative w-24 h-24 bg-[#0A0A0A] border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl">
                  {targetRole === "client" ? (
                    <Briefcase
                      size={40}
                      className="text-white"
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Box size={40} className="text-white" strokeWidth={1.5} />
                  )}
                </div>
              </motion.div>

              {/* 3. The Text - Simple & Direct */}
              <div className="text-center space-y-2">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                  className="text-white text-2xl font-semibold tracking-wide capitalize"
                >
                  Switching to {targetRole} Mode
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-zinc-500 text-sm font-medium"
                >
                  Setting up your dashboard...
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <Link href="/dashboard" className="h-16 flex items-center px-5 mb-2">
        <div className="relative w-20 h-8">
          <Image
            src="/logo.png"
            alt="Jifwa"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </Link>

      <div className="px-3 mb-6">
        <RoleSwitcher currentRole={currentRole!} onSwitch={handleRoleSwitch} />
      </div>

      <div className="flex-1 px-3 space-y-8 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest opacity-80">
            Platform
          </p>
          {getNavLinks().map((link) => (
            <NavItem
              key={link.href}
              link={link}
              isActive={
                (pathname.startsWith(link.href) &&
                  link.href !== "/dashboard") ||
                pathname === link.href
              }
              dropdownItems={recentAssignments}
              currentRole={currentRole}
            />
          ))}
        </div>
        <div className="space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest opacity-80">
            Account
          </p>
          {getAccountLinks().map((link) => (
            <NavItem
              key={link.href}
              link={link}
              isActive={pathname.startsWith(link.href)}
            />
          ))}
        </div>
      </div>

      <SidebarFooter />
    </div>
  );
}
