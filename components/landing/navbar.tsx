"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { HiMenuAlt3 } from "react-icons/hi";
import { useUser, ClerkLoaded } from "@clerk/nextjs";
import UserAvatar from "../elements/UserAvatar";

// --- BRAND COLORS ---
// Navy: #0B2447
// Teal: #14B8A6

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const { isSignedIn } = useUser();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Security", href: "#security" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out font-sans",
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="w-full mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* 1. BIG LOGO */}
        <Link
          href="/"
          className="relative h-14 w-20 transition-all hover:opacity-90 active:scale-95"
        >
          <Image
            src="/logo.png"
            alt="Jifwa"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* 2. DESKTOP LINKS */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="text-sm font-bold text-slate-500 hover:text-[#0B2447] transition-all hover:scale-105 active:scale-95"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* 3. ACTIONS & MOBILE MENU */}
        <div className="flex items-center gap-4">
          <ClerkLoaded>
            {!isSignedIn && (
              <div className="hidden md:flex items-center gap-3">
                {/* LOGIN LINK */}
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-[#0B2447] hover:text-[#14B8A6]  font-bold text-sm active:scale-95"
                  >
                    Log In
                  </Button>
                </Link>

                {/* SIGN UP LINK (Navy Button) */}
                <Link href="/sign-up">
                  <Button className="bg-[#0B2447] text-white hover:bg-[#15345A] font-bold rounded-full h-11 px-8 text-sm shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 hover:shadow-blue-900/30">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {isSignedIn && (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="hidden md:flex">
                  <Button
                    variant="outline"
                    className="rounded-full h-11 px-6 border-[#0B2447] text-[#0B2447] font-bold hover:bg-[#0B2447] hover:text-white transition-all active:scale-95"
                  >
                    Dashboard
                  </Button>
                </Link>

                <UserAvatar />
              </div>
            )}
          </ClerkLoaded>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="active:scale-90 transition-transform p-1 text-[#0B2447]">
                  <HiMenuAlt3 className="h-7 w-7" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="w-full h-full bg-white p-0 border-none [&>button]:hidden flex flex-col"
              >
                {/* Mobile Header */}
                <div className="flex items-center justify-between px-6 border-b border-slate-100 h-20">
                  <div className="relative h-12 w-20">
                    <Image
                      src="/logo.png"
                      alt="Jifwa"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full bg-slate-50 text-[#0B2447] active:scale-90 transition-transform"
                  >
                    <X size={24} strokeWidth={2.5} />
                  </Button>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col p-8 gap-6">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => scrollToSection(link.href)}
                      className="text-3xl font-extrabold text-[#0B2447] text-left tracking-tight active:opacity-60 active:translate-x-2 transition-all hover:text-[#14B8A6]"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>

                {/* Mobile Footer Actions */}
                <div className="mt-auto p-8 pb-12 flex flex-col gap-4">
                  <ClerkLoaded>
                    {!isSignedIn ? (
                      <>
                        <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full rounded-2xl text-lg font-bold border-2 border-slate-200 text-[#0B2447] h-14 active:scale-[0.98] transition-all hover:border-[#0B2447] hover:bg-transparent"
                          >
                            Log In
                          </Button>
                        </Link>

                        <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                          <Button
                            size="lg"
                            className="w-full rounded-2xl text-lg font-bold bg-[#0B2447] text-white h-14 shadow-xl active:scale-[0.98] transition-all hover:bg-[#15345A]"
                          >
                            Get Started Free
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button
                          size="lg"
                          className="w-full text-lg font-bold bg-[#0B2447] text-white rounded-2xl h-14 shadow-xl active:scale-[0.98] transition-all hover:bg-[#15345A]"
                        >
                          Go to Dashboard
                        </Button>
                      </Link>
                    )}
                  </ClerkLoaded>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
