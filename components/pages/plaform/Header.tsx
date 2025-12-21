"use client";

import React from "react";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, Bell, HelpCircle, ChevronRight, Slash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export const Header = () => {
  const { user } = useUser();

  return (
    <header className="h-16 sticky top-0 z-40 px-6 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-gray-200/60 transition-all">
      {/* --- LEFT: Mobile Menu & Breadcrumbs --- */}
      <div className="flex items-center gap-4">
        {/* Mobile Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 text-gray-500 hover:bg-gray-100/50 hover:text-gray-900"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-72 border-r border-gray-200 bg-[#FAFAFA] [&>button]:hidden"
            >
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Logo */}
        <div className="relative h-7 w-24 opacity-100 md:hidden">
          <Image
            src="/logo.png"
            alt="Jifwa"
            fill
            className="object-contain object-left"
            priority
          />
        </div>

        {/* Desktop Breadcrumbs (Fills the empty space) */}
        <div className="hidden md:flex items-center text-sm font-medium text-gray-500">
          <span className="hover:text-gray-900 cursor-pointer transition-colors">
            Jifwa
          </span>
          <Slash size={12} className="mx-2 text-gray-300" />
          <span className="text-gray-900 bg-gray-100/50 px-2 py-0.5 rounded-md border border-gray-200/50">
            Dashboard
          </span>
        </div>
      </div>

      {/* --- RIGHT: Actions & User --- */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        {/* Help & Notifications (Subtle) */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-gray-900 hover:bg-gray-50 hidden sm:flex"
        >
          <HelpCircle size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-gray-900 hover:bg-gray-50 relative hidden sm:flex"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
        </Button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>

        {/* User Profile + Name Tag */}
        <div className="flex items-center gap-3 pl-1">
          {/* Optional: Show Name on Desktop for "Pro" feel */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-xs font-bold text-gray-900 leading-none">
              {user?.firstName || "User"}
            </span>
            <span className="text-[10px] text-gray-500 leading-none mt-1">
              Pro Plan
            </span>
          </div>

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox:
                  "w-9 h-9 rounded-full ring-2 ring-gray-100 hover:ring-gray-200 transition-all shadow-sm cursor-pointer",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
};
