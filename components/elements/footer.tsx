"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaFacebookF,
} from "react-icons/fa6";
import { FiMail, FiMapPin, FiHeart, FiArrowRight } from "react-icons/fi";
// Implmenting Shadcn Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Social Links with Tooltip Text
  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://www.facebook.com/jifwaai/",
      label: "Facebook",
      tooltipText: "Like us on Facebook",
      color: "text-[#1877F2]",
      hoverBg: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/jifwaai",
      label: "Instagram",
      tooltipText: "Follow us on Instagram",
      color: "text-[#E4405F]",
      hoverBg:
        "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent",
    },
    {
      icon: FaLinkedinIn,
      href: "https://www.linkedin.com/company/jifwa",
      label: "LinkedIn",
      tooltipText: "Connect on LinkedIn",
      color: "text-[#0A66C2]",
      hoverBg: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
    },
    {
      icon: FaYoutube,
      href: "https://youtube.com/@jifwa",
      label: "YouTube",
      tooltipText: "Subscribe to our channel",
      color: "text-[#FF0000]",
      hoverBg: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
    },
    {
      icon: FaXTwitter,
      href: "https://x.com/jifwaai",
      label: "X (Twitter)",
      tooltipText: "Follow us on X",
      color: "text-black",
      hoverBg: "hover:bg-black hover:text-white hover:border-black",
    },
  ];

  const productLinks = [
    { name: "Features", href: "#features", isScroll: true },
    { name: "Security", href: "#security", isScroll: true },
    { name: "Pricing", href: "#pricing", isScroll: true },
    { name: "FAQ", href: "#faq", isScroll: true },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
    { name: "Refund & Cancellation", href: "/refund" },
    { name: "AI Usage & Security", href: "/ai-security" },
  ];

  return (
    <footer className="w-full bg-white text-[#0B2447] font-sans border-t border-slate-100 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-50/40 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 pt-16 pb-8">
        {/* 1. TOP CTA SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 border-b border-slate-100 pb-12 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0B2447]">
              Ready to automate execution?
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium">
              Join teams converting contracts into clear workflows today.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="group h-12 px-8 rounded-xl bg-[#0B2447] text-white text-sm font-bold hover:bg-[#15345A] hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              Get Started
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 2. MAIN GRID */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-8 mb-16 text-left ">
          {/* BRAND COLUMN */}
          {/* BRAND COLUMN */}
          {/* CHANGE: Added 'items-center text-center lg:items-start lg:text-left' */}
          <div className="col-span-2 lg:col-span-4 flex flex-col gap-6 pr-0 lg:pr-8 items-center text-center lg:items-start lg:text-left">
            <Link href="/" className="relative h-14 w-28 block">
              <Image
                src="/logo.png"
                alt="Jifwa Logo"
                fill
                className="object-contain object-center lg:object-left"
                priority
              />
              {/* CHANGE: Added 'object-center lg:object-left' above to ensure image aligns within its container */}
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
              AI-native, fully encrypted contract execution platform for
              businesses that demand clarity and accountability.
            </p>

            {/* SOCIAL ICONS WITH TOOLTIPS */}
            {/* CHANGE: Added 'justify-center lg:justify-start' */}
            <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
              <TooltipProvider delayDuration={100}>
                {socialLinks.map((item, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border border-slate-100 bg-white shadow-sm 
                        ${item.color} ${item.hoverBg} 
                        hover:-translate-y-1 hover:shadow-md 
                        transition-all duration-300 ease-out`}
                      >
                        <item.icon size={18} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>

          {/* PRODUCT LINKS */}
          <div className="col-span-1 lg:col-span-2 lg:col-start-6">
            <h4 className="text-xs font-bold text-[#0B2447] uppercase tracking-widest mb-6">
              Product
            </h4>
            <ul className="space-y-4">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) =>
                      item.isScroll && handleScroll(e, item.href.substring(1))
                    }
                    className="block text-slate-500 text-sm font-medium hover:text-[#14B8A6] hover:translate-x-1 transition-all duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL LINKS */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs font-bold text-[#0B2447] uppercase tracking-widest mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block text-slate-500 text-sm font-medium hover:text-[#14B8A6] hover:translate-x-1 transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div className="col-span-2 lg:col-span-3 lg:col-end-13">
            <h4 className="text-xs font-bold text-[#0B2447] uppercase tracking-widest mb-6">
              Contact Us
            </h4>
            <div className="space-y-5">
              <div className="flex items-start gap-3 text-sm text-slate-500 font-medium group">
                <div className="mt-1 p-1.5 rounded-md bg-teal-50 text-[#14B8A6] group-hover:bg-[#14B8A6] group-hover:text-white transition-colors">
                  <FiMapPin size={14} className="shrink-0" />
                </div>
                <span className="leading-relaxed">
                  Sane Guruji Nagar, Chopda,
                  <br />
                  Jalgaon, Maharashtra - 425107,
                  <br />
                  India
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium group">
                <div className="p-1.5 rounded-md bg-teal-50 text-[#14B8A6] group-hover:bg-[#14B8A6] group-hover:text-white transition-colors">
                  <FiMail size={14} className="shrink-0" />
                </div>
                <a
                  href="mailto:contact@jifwa.com"
                  className="hover:text-[#0B2447] transition-colors"
                >
                  contact@jifwa.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100">
          <p className="text-slate-400 text-xs font-medium">
            &copy; {currentYear}{" "}
            <span className="font-bold text-[#0B2447]">Jifwa</span>. All rights
            reserved.
          </p>

          {/* MADE IN INDIA */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#0B2447] bg-slate-50/80 px-4 py-2 rounded-full border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <span>Made with</span>
            <FiHeart
              size={12}
              className="text-red-500 fill-red-500 animate-pulse"
              style={{ animationDuration: "2s" }}
            />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
