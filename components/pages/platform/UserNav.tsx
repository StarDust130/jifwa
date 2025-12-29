"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Settings,
  Loader2,
  CreditCard,
  Check,
  ChevronRight,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function UserNav() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. Handle Click Outside to Close Menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded) return <Skeleton className="h-9 w-9 rounded-full" />;
  if (!user) return null;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut(() => router.push("/"));
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* 2. CUSTOM TRIGGER (Simple HTML Button) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative h-9 w-9 rounded-full transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 ${
          isOpen ? "ring-2 ring-offset-2 ring-gray-200" : ""
        }`}
      >
        <Avatar className="h-9 w-9 border border-gray-200 shadow-sm">
          <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
          <AvatarFallback className="bg-gray-900 text-white font-bold text-xs">
            {user.firstName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* 3. CUSTOM DROPDOWN CONTENT (Pure Tailwind, No Radix) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-[100] animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          {/* Header Section */}
          <div className="flex items-center gap-3 p-3 mb-1 bg-gray-50/50 rounded-lg border border-gray-100/50">
            <Avatar className="h-10 w-10 border border-gray-200">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="bg-black text-white">
                {user.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500 font-medium truncate mb-1.5">
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <Badge
                variant="secondary"
                className="w-fit text-[10px] h-4 px-1.5 bg-white border-gray-200 text-gray-600 font-bold shadow-sm"
              >
                Free Plan
              </Badge>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            <Link
              href="/settings"
              className="flex items-center justify-between w-full p-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white border border-gray-100 text-gray-500 group-hover:text-gray-900 group-hover:border-gray-200 transition-colors shadow-sm">
                  <Settings className="w-4 h-4" />
                </div>
                Manage Account
              </div>
            </Link>

            <Link
              href="/billing"
              className="flex items-center justify-between w-full p-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white border border-gray-100 text-gray-500 group-hover:text-gray-900 group-hover:border-gray-200 transition-colors shadow-sm">
                  <CreditCard className="w-4 h-4" />
                </div>
                Billing & Plans
              </div>
            </Link>
          </div>

          <div className="h-px bg-gray-100 my-1.5 mx-2" />

          {/* Sign Out Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              setOpenDialog(true);
            }}
            className="flex items-center w-full p-2.5 text-sm font-bold text-red-600 rounded-lg hover:bg-red-50 transition-colors group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors mr-3">
              <LogOut className="w-4 h-4" />
            </div>
            Sign out
          </button>
        </div>
      )}

      {/* 4. LOGOUT MODAL (Using Shadcn Dialog because it's detached from the menu) */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[400px] p-6 gap-6 z-[150]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-full text-red-600">
                <LogOut size={18} />
              </div>
              Sign out
            </DialogTitle>
            <DialogDescription className="text-gray-500 pt-2 text-base">
              Are you sure you want to sign out? You will need to log in again
              to access your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="font-bold border-gray-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="bg-red-600 hover:bg-red-700 font-bold px-6"
            >
              {isSigningOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign out"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
