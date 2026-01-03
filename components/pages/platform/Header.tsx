"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, Slash, Inbox, ArrowRight, CircleHelp } from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Custom Components
import Sidebar from "./Sidebar";
import UserAvatar from "@/components/elements/UserAvatar";

export const Header = ({ userRole }: { userRole?: string }) => {
  const pathname = usePathname();

  // STATE MANAGEMENT
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // Manually control notification state

  const isDashboard = pathname === "/dashboard";

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
    <header className="h-16 sticky top-0 z-40 px-6 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-gray-200/60 font-sans transition-all duration-300">
      {/* GLOBAL STYLES FOR BELL ANIMATION */}
      <style jsx global>{`
        @keyframes bell-ring {
          0% {
            transform: rotate(0);
          }
          15% {
            transform: rotate(25deg);
          }
          30% {
            transform: rotate(-22deg);
          }
          45% {
            transform: rotate(18deg);
          }
          60% {
            transform: rotate(-12deg);
          }
          75% {
            transform: rotate(8deg);
          }
          100% {
            transform: rotate(0);
          }
        }
        .animate-bell:hover svg {
          animation: bell-ring 0.8s ease-in-out both;
          transform-origin: top center;
        }
      `}</style>

      {/* LEFT: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100/50"
              >
                <Menu size={20} className="text-gray-600" />
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

        <div className="hidden md:flex items-center text-sm font-medium text-gray-500">
          {isDashboard ? (
            <Link
              href="/dashboard"
              className="px-2 py-1 rounded-md text-black  transition-all font-bold flex items-center gap-2 cursor-default"
            >
              <span className="tracking-tight">Jifwa</span>
            </Link>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard"
                    className="px-2 py-1 rounded-md hover:text-black hover:bg-gray-100 transition-all font-bold text-gray-700 flex items-center gap-2"
                  >
                    <span className="tracking-tight">Jifwa</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Back to Dashboard</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.href}>
                <Slash size={10} className="mx-1.5 text-gray-300" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {isLast ? (
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-900 border border-gray-200 text-xs font-bold uppercase tracking-wide shadow-sm">
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="px-2 py-1 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-all"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {isLast ? "Current Page" : `Go to ${crumb.label}`}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Actions & User Profile */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Admin quick jump */}
        {userRole === "admin" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/admin/overview">
                  <Button
                    size="sm"
                    variant="outline"
                    className="hidden sm:inline-flex rounded-full border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
                  >
                    Admin
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Go to admin panel</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* 1. HELP BUTTON */}
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/help">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <CircleHelp size={20} className="text-gray-600" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Help Center</TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

        {/* 2. NOTIFICATIONS DROPDOWN - FIXED */}
        <Tooltip>
          <TooltipTrigger>
            {" "}
            <DropdownMenu
              open={isNotificationsOpen}
              onOpenChange={setIsNotificationsOpen}
              modal={false}
            >
              {/* FIX: Removed 'asChild' and 'Button'. We style the trigger directly. */}
              <DropdownMenuTrigger className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-300 outline-none animate-bell focus:bg-gray-100">
                <Bell size={15} className="text-gray-600" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-80 sm:w-96 p-0 shadow-xl bg-white border-gray-200 rounded-xl overflow-hidden mt-2 mr-2 z-[100]"
                align="end"
                sideOffset={5}
                // Force disable pointer-events issues
                style={{ pointerEvents: "auto" }}
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Notifications</h4>
                  <Badge
                    variant="secondary"
                    className="bg-white border-gray-200 text-gray-500 text-[10px] font-bold"
                  >
                    0 New
                  </Badge>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Inbox className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium text-sm">
                    No new notifications
                  </p>
                  <p className="text-gray-500 text-xs mt-1 max-w-[200px]">
                    You're all caught up! Check back later for updates.
                  </p>
                </div>

                {/* Footer Action */}
                <div className="p-2 border-t border-gray-100 bg-gray-50/30">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/settings?tab=notifications"
                      className="w-full flex items-center justify-center gap-2 cursor-pointer font-medium text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 py-2.5 rounded-lg transition-colors"
                      // Close menu when clicked
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      View all notifications
                      <ArrowRight size={12} />
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notification</p>
          </TooltipContent>
        </Tooltip>

        {/* 3. USER INFO & AVATAR */}
        <UserAvatar />
      </div>
    </header>
  );
};
