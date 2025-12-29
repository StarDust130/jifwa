"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { HiMenuAlt3 } from "react-icons/hi";
import { UserButton, useUser, ClerkLoaded } from "@clerk/nextjs";

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
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-3 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* 1. BIG LOGO */}
        <Link
          href="/"
          className="relative h-20 w-40 transition-all hover:opacity-80 active:scale-95"
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
              className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-all active:scale-95"
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
                {/* LOGIN LINK (No Modal) */}
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 font-bold text-sm active:scale-95"
                  >
                    Log In
                  </Button>
                </Link>

                {/* SIGN UP LINK (No Modal) */}
                <Link href="/sign-up">
                  <Button className="bg-gray-900 text-white hover:bg-black font-bold rounded-full h-11 px-8 text-sm shadow-xl shadow-gray-900/20 transition-all hover:scale-105 active:scale-95">
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
                    className="rounded-full h-11 px-6 border-gray-200 font-bold hover:bg-gray-50 active:scale-95"
                  >
                    Dashboard
                  </Button>
                </Link>

                <div className="active:scale-90 transition-transform">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 border border-gray-200 shadow-sm",
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </ClerkLoaded>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="active:scale-90 transition-transform p-1">
                  <HiMenuAlt3 className="h-6 w-6 mr-2" strokeWidth={0.5} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="w-full h-full bg-white p-0 border-none [&>button]:hidden flex flex-col"
              >
                {/* Mobile Header */}
                <div className="flex items-center justify-between px-6 border-b border-gray-100">
                  <div className="relative h-20 w-40">
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
                    className="rounded-full bg-gray-100 active:scale-90 transition-transform"
                  >
                    <X size={24} strokeWidth={2.5} />
                  </Button>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col p-6 gap-6">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => scrollToSection(link.href)}
                      className="text-3xl font-bold text-gray-900 text-left tracking-tight active:opacity-60 active:translate-x-1 transition-all"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>

                {/* Mobile Footer Actions */}
                <div className="mt-auto p-6 pb-10 flex flex-col gap-4">
                  <ClerkLoaded>
                    {!isSignedIn ? (
                      <>
                        <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full rounded-2xl text-xl font-bold border-2 h-16 active:scale-[0.98] transition-all"
                          >
                            Log In
                          </Button>
                        </Link>

                        <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                          <Button
                            size="lg"
                            className="w-full rounded-2xl text-xl font-bold bg-gray-900 text-white h-16 shadow-xl active:scale-[0.98] transition-all"
                          >
                            Get Started Free
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button
                          size="lg"
                          className="w-full text-xl font-bold bg-gray-900 text-white rounded-2xl h-16 shadow-xl active:scale-[0.98] transition-all"
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
