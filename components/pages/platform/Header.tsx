"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, Slash } from "lucide-react";
import { useUser } from "@clerk/nextjs"; // <--- ADDED THIS

// UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Custom Components
import Sidebar from "./Sidebar";
import { UserNav } from "./UserNav";

export const Header = ({ userRole }: { userRole?: string }) => {
  const { user, isLoaded } = useUser(); // <--- Get User Data
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Breadcrumb Logic
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { href, label };
  });

  return (
    <header className="h-16 sticky top-0 z-40 px-6 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-gray-200/60 font-sans">
      {/* LEFT: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-full sm:w-72">
              <Sidebar
                initialRole={userRole}
                onNavClick={() => setIsMobileMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Breadcrumbs */}
        <div className="hidden md:flex items-center text-sm font-medium text-gray-500">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className="px-2 py-1 rounded-md hover:text-gray-900 hover:bg-gray-100 transition-all font-bold text-gray-700"
                >
                  Jifwa
                </Link>
              </TooltipTrigger>
              <TooltipContent>Go to Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.href}>
                <Slash size={12} className="mx-2 text-gray-300" />
                {isLast ? (
                  <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-900 border border-gray-200 shadow-sm">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="px-2 py-1 rounded-md hover:text-gray-900 hover:bg-gray-100 transition-all"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Actions & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications (Simplified structure to fix conflicts) */}
        <div className="hidden sm:block">
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-100 relative"
              >
                <Bell size={18} className="text-gray-600" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4" align="end">
              <div className="space-y-2">
                <h4 className="text-sm font-bold">Notifications</h4>
                <div className="text-sm text-gray-500 py-6 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-lg">
                  No new notifications.
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        {/* USER INFO & AVATAR */}
        <div className="flex items-center gap-3">
          {/* User Name & Plan (Hidden on mobile) */}
          {isLoaded && user && (
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-sm font-bold text-gray-900 leading-none">
                {user.fullName || user.firstName}
              </span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide mt-1">
                Free Plan
              </span>
            </div>
          )}

          {/* Avatar Dropdown */}
          <UserNav />
        </div>
      </div>
    </header>
  );
};
