"use client";

import React, { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, Bell, HelpCircle, Slash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

// Accept userRole to ensure mobile menu has correct initial state
export const Header = ({ userRole }: { userRole?: string }) => {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // FIX: Manual state

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return { href, label };
  });

  return (
    <header className="h-16 sticky top-0 z-40 px-6 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>

            {/* FIX: Full width on mobile & pass close handler */}
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
          <Link
            href="/dashboard"
            className="px-2 py-1 rounded-md hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            Jifwa
          </Link>

          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <React.Fragment key={crumb.href}>
                <Slash size={12} className="mx-2 text-gray-300" />
                {isLast ? (
                  <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-900 border border-gray-200">
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

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* ... (Help & Notification buttons remain unchanged) ... */}

        <Button variant="ghost" size="icon" className="hidden sm:flex relative">
          <HoverCard>
            <HoverCardTrigger>
              <Bell size={18} />
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Notifications</h4>
                <div className="text-sm text-gray-600">
                  No new notifications.
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Button>

        <div className="hidden lg:flex flex-col items-end">
          <span className="text-xs font-bold">{user?.firstName || "User"}</span>
          <span className="text-[10px] text-gray-500 capitalize">
            Free Plan
          </span>
        </div>

        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};
