"use client";

import React from "react";
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
import  Sidebar  from "./Sidebar";

export const Header = () => {
  const { user } = useUser();
  const pathname = usePathname();

  // Split path and ignore empty
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb paths progressively
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Breadcrumbs */}
        <div className="hidden md:flex items-center text-sm font-medium text-gray-500">
          {/* Root */}
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
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <HoverCard>
            <HoverCardTrigger>
              <HelpCircle size={18} />
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4">
              <div className="space-y-4">
          <h4 className="text-sm font-semibold">Help & Support</h4>
          <div className="space-y-2">
            <div>
              <h5 className="text-xs font-medium text-gray-700">Quick Start Guide</h5>
              <p className="text-xs text-gray-600">Get started with Jifwa in minutes.</p>
              <Link href="/help/quick-start" className="text-xs text-blue-600 hover:underline">Learn more</Link>
            </div>
            <div>
              <h5 className="text-xs font-medium text-gray-700">FAQ</h5>
              <p className="text-xs text-gray-600">Find answers to common questions.</p>
              <Link href="/help/faq" className="text-xs text-blue-600 hover:underline">View FAQ</Link>
            </div>
            <div>
              <h5 className="text-xs font-medium text-gray-700">Contact Support</h5>
              <p className="text-xs text-gray-600">Need help? We're here for you.</p>
              <Link href="/help/contact" className="text-xs text-blue-600 hover:underline">Get in touch</Link>
            </div>
          </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Button>

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
          <span className="text-[10px] text-gray-500">Free Plan</span>
        </div>

        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};
