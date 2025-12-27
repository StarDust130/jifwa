"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { BookOpen, LifeBuoy, LogOut } from "lucide-react";

export function SidebarFooter() {
  return (
    <div className="p-4 mt-auto border-t border-zinc-100 bg-white">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link
          href="/docs"
          className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all"
        >
          <BookOpen
            size={16}
            className="mb-1.5 text-zinc-400 group-hover:text-zinc-900 transition-colors"
          />
          <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-900">
            Docs
          </span>
        </Link>
        <Link
          href="/support"
          className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all"
        >
          <LifeBuoy
            size={16}
            className="mb-1.5 text-zinc-400 group-hover:text-zinc-900 transition-colors"
          />
          <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-900">
            Support
          </span>
        </Link>
      </div>

      <SignOutButton>
        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold text-zinc-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all group">
          <LogOut
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Sign Out
        </button>
      </SignOutButton>
    </div>
  );
}
