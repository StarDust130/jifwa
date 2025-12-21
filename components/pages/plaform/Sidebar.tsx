"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FolderKanban,
  CreditCard,
  Settings,
  BookOpen,
  LifeBuoy,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- NAVIGATION CONFIG ---
const PRIMARY_LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Milestones", href: "/dashboard/milestones", icon: FileText },
];

const SECONDARY_LINKS = [
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const Sidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  const NavItem = ({ link }: { link: any }) => {
    const isActive =
      pathname === link.href ||
      (link.href !== "/dashboard" && pathname.startsWith(link.href));
    return (
      <Link
        href={link.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group relative",
          isActive
            ? "bg-white text-gray-900 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.1)] border border-gray-200/60"
            : "text-gray-500 hover:bg-gray-100/70 hover:text-gray-900"
        )}
      >
        <link.icon
          size={18}
          strokeWidth={2}
          className={cn(
            "transition-colors",
            isActive
              ? "text-gray-900"
              : "text-gray-400 group-hover:text-gray-600"
          )}
        />
        <span>{link.name}</span>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-[#F9FAFB] border-r border-gray-200",
        className
      )}
    >
      {/* 1. BRAND HEADER */}
      <div className="h-20 flex items-center px-5 mb-4">
        <Link
          href="/dashboard"
          className="relative h-20 w-32 opacity-100 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Image
            src="/logo.png"
            alt="Jifwa"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>
      </div>

      {/* 2. NAVIGATION GROUPS */}
      <div className="flex-1 px-3 space-y-8 overflow-y-auto scrollbar-none">
        <div className="space-y-1">
          {PRIMARY_LINKS.map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </div>

        <div className="space-y-1">
          <div className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Management
          </div>
          {SECONDARY_LINKS.map((link) => (
            <NavItem key={link.href} link={link} />
          ))}
        </div>
      </div>

      {/* 3. BOTTOM ACTIONS */}
      <div className="p-3 mt-auto space-y-1 border-t border-gray-100">
        <Link
          href="/docs"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 transition-all border border-transparent hover:border-gray-200"
        >
          <BookOpen size={16} />
          Documentation
        </Link>
        <Link
          href="/support"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 transition-all border border-transparent hover:border-gray-200"
        >
          <LifeBuoy size={16} />
          Support
        </Link>
      </div>
    </div>
  );
};
export default Sidebar;
