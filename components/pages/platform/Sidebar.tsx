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
} from "lucide-react";

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
      setRecentAssignments(Array.from(uniqueProjectsMap.values()).slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch sidebar data", err);
    }
  };

  // 🚀 OPTIMIZED ROLE SWITCH
  const handleRoleSwitch = async (newRole: string) => {
    if (newRole === currentRole || targetRole) return;

    setTargetRole(newRole);

    try {
      const result = await toggleUserRole();
      if (result.success && result.role) {
        // ⚡️ INSTANT REDIRECT (Don't wait for server state to update locally)
        router.push("/dashboard");

        // Cinematic delay to allow the redirect to load behind the scenes
        setTimeout(() => {
          setCurrentRole(result.role!);
          if (result.role === "vendor") {
            fetchVendorData();
          } else {
            setRecentAssignments([]);
          }
          router.refresh();
          // Close loader slightly faster
          setTargetRole(null);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
      setTargetRole(null);
    }
  };

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
      <AnimatePresence mode="wait">
        {targetRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#000000] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Pulsing Glow Background */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] blur-[100px] pointer-events-none"
            />

            <div className="relative z-10 flex flex-col items-center gap-8">
              {/* 🔄 3D FLIP ANIMATION ICON */}
              <motion.div
                initial={{ rotateY: 0, scale: 0.5, opacity: 0 }}
                animate={{
                  rotateY: 360,
                  scale: 1,
                  opacity: 1,
                  y: [0, -10, 0],
                }}
                transition={{
                  rotateY: { duration: 1, ease: "easeInOut", repeat: Infinity },
                  opacity: { duration: 0.3 },
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-125 animate-pulse" />
                <div className="relative w-28 h-28 bg-[#0F0F0F] border border-zinc-800 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                  {targetRole === "client" ? (
                    <Briefcase
                      size={44}
                      className="text-white"
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Box size={44} className="text-white" strokeWidth={1.5} />
                  )}
                </div>
              </motion.div>

              <div className="text-center space-y-2">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white text-2xl font-bold tracking-tight capitalize"
                >
                  Initializing {targetRole}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-zinc-500 text-sm font-medium"
                >
                  Preparing workspace...
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/dashboard" className="h-16 flex items-center px-5 mb-2">
        <div className="relative w-20 h-20">
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
      <SidebarFooter currentRole={currentRole} />
    </div>
  );
}
