"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowRight, X } from "lucide-react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { isSignedIn, isLoaded } = useUser();

  // Handle Hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Scroll
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

  if (!mounted) return null;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out font-sans",
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b  border-gray-300 py-1.5  md:py-3 shadow-sm"
          : "bg-transparent border-b border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 h-12 flex items-center justify-between relative">
        {/* 1. LOGO */}
        <div className="flex-shrink-0 z-50">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-20 w-32 md:h-24 md:w-40 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Jifwa"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
        </div>

        {/* 2. DESKTOP CENTER LINKS (Clean, No Background) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
              >
                {link.name}
              </button>
            ))}
          </nav>
        </div>

        {/* 3. ACTIONS & MOBILE MENU */}
        <div className="flex items-center gap-4 z-50">
          {/* DESKTOP AUTH BUTTONS */}
          <div className="hidden md:flex items-center gap-3">
            {isLoaded && !isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-black font-semibold text-sm hover:bg-transparent"
                  >
                    Log In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-black text-white hover:bg-gray-900 shadow-xl shadow-black/20 font-bold rounded-full h-10 px-6 text-sm transition-all hover:scale-105 hover:-translate-y-0.5">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )}

            {isLoaded && isSignedIn && (
              <>
                <Button
                  variant="outline"
                  asChild
                  className="mr-2 border-gray-300 rounded-full hover:bg-gray-50 font-bold px-6"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 border-2 border-gray-200",
                    },
                  }}
                />
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
             
                  <HiOutlineMenuAlt3
                    className="text-black bg-transparent h-6 w-6 font-bold"
                    strokeWidth={3}
                  />
              
              </SheetTrigger>
              <SheetContent
                side="top"
                // Added [&>button]:hidden to remove duplicate close icon
                className="w-full h-[100dvh] bg-white border-none p-0 flex flex-col z-[100] [&>button]:hidden"
              >
                {/* Mobile Header */}
                <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100">
                  <div className="relative h-20 w-40">
                    <Image
                      src="/logo.png"
                      alt="Jifwa"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <X size={24} className="text-black font-bold" />
                  </button>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col px-6 pt-8 gap-6 flex-1 overflow-y-auto bg-white">
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <button
                        key={link.name}
                        onClick={() => scrollToSection(link.href)}
                        className="text-2xl font-bold text-gray-900 hover:text-gray-500 text-left py-4 border-b border-gray-50 last:border-none transition-colors"
                      >
                        {link.name}
                      </button>
                    ))}
                  </nav>

                  {/* Mobile Actions */}
                  <div className="mt-auto pb-12 flex flex-col gap-4">
                    {isLoaded && !isSignedIn && (
                      <>
                        <SignInButton mode="modal">
                          <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="w-full justify-center rounded-2xl h-14 text-lg font-bold border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                          >
                            Log In
                          </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                          <Button
                            onClick={() => setIsOpen(false)}
                            className="w-full justify-center rounded-2xl h-14 text-lg font-bold bg-black hover:bg-gray-900 text-white shadow-2xl"
                          >
                            Get Started Free{" "}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </SignUpButton>
                      </>
                    )}

                    {isLoaded && isSignedIn && (
                      <>
                        <Button
                          asChild
                          onClick={() => setIsOpen(false)}
                          className="w-full justify-center rounded-2xl h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                        >
                          <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-2">
                          <div className="flex items-center gap-3">
                            <UserButton />
                            <div className="text-left">
                              <p className="font-bold text-gray-900 text-sm">
                                My Account
                              </p>
                              <p className="text-xs text-gray-500">
                                Manage settings
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
