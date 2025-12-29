"use client";
import React from "react";
import Image from "next/image";
import { FaXTwitter, FaLinkedin, FaGithub, FaDiscord } from "react-icons/fa6";
import {
  FiArrowUpRight,
  FiMail,
  FiMapPin,
  FiShield,
  FiHeart,
} from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const socialLinks = [
    { icon: FaXTwitter, href: "#" },
    { icon: FaLinkedin, href: "#" },
    { icon: FaGithub, href: "#" },
    { icon: FaDiscord, href: "#" },
  ];

  // Refactored to support both Scroll IDs and Direct Paths
  const productLinks = [
    { name: "Features", href: "#features", isScroll: true },
    { name: "Security", href: "#security", isScroll: true },
    { name: "Pricing", href: "#pricing", isScroll: true },
    { name: "FAQ", href: "#faq", isScroll: true },
    { name: "Help Center", href: "/help", isScroll: false },
  ];

  const companyLinks = [
    { name: "About", href: "/" },
    { name: "Customers", href: "/" },
    { name: "Careers", href: "/" },
    { name: "Privacy", href: "/privacy" },
    { name: "Legal", href: "/terms" },
  ];

  return (
    <footer className="w-full bg-[#050505] text-white pt-12 pb-8 font-sans border-t border-white/5 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* 1. TOP CTA SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/5 pb-10 text-center md:text-left">
          <div className="space-y-2 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Ready to automate execution?
            </h2>
            <p className="text-gray-500 text-sm">
              Join forward-thinking legal teams automating compliance today.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="h-10 px-6 rounded-lg bg-white text-black text-sm font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* 2. MAIN GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10 mb-12">
          {/* BRAND COLUMN */}
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-5 pr-0 lg:pr-8">
            <div className="group relative flex items-center w-fit cursor-default">
              <div className="absolute -inset-2 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              <span className="relative text-4xl font-extrabold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Jifwa<span className="text-blue-500">.</span>
              </span>
            </div>

            <p className="text-gray-400 text-base font-medium leading-relaxed max-w-sm">
              The execution layer for legal contracts. <br />
              <span className="text-gray-200">
                Zero ambiguity, 100% compliance.
              </span>
            </p>

            <div className="flex gap-3 mt-2">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="group/icon w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
                >
                  <item.icon
                    size={18}
                    className="group-hover/icon:scale-110 transition-transform"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* PRODUCT LINKS (Now includes Docs & Help) */}
          <div className="col-span-1">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">
              Product
            </h4>
            <ul className="space-y-3">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (item.isScroll) {
                        handleScroll(e, item.href.substring(1));
                      }
                    }}
                    className="text-gray-500 text-sm hover:text-white transition-colors flex items-center gap-1 group w-fit"
                  >
                    {item.name}
                    <FiArrowUpRight
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-400"
                      size={12}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY LINKS */}
          <div className="col-span-1">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-500 text-sm hover:text-white transition-colors flex items-center gap-1 group w-fit"
                  >
                    {item.name}
                    <FiArrowUpRight
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-400"
                      size={12}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* HEADQUARTERS */}
          <div className="col-span-2 lg:col-span-2 mt-4 lg:mt-0">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">
              Headquarters
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-gray-500 group">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5 group-hover:border-white/20 transition-colors">
                  <FiMapPin
                    size={16}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                </div>
                <span className="text-xs leading-relaxed mt-1">
                  Sane Guruji Nagar, Chopda,
                  <br />
                  Jalgaon, Maharashtra 425107,
                  <br />
                  India
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 group">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5 group-hover:border-white/20 transition-colors">
                  <FiMail
                    size={16}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                </div>
                <a
                  href="mailto:contact@jifwa.com"
                  className="text-xs hover:text-white transition-colors"
                >
                  contact@jifwa.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-gray-600">
            <span>© {currentYear} Conseccomms Pvt Ltd.</span>
            <div className="hidden md:block w-1 h-1 bg-gray-800 rounded-full"></div>

            {/* Added Privacy & Terms here for standard legal placement */}
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>

            <div className="hidden md:block w-1 h-1 bg-gray-800 rounded-full"></div>

            {/* MADE IN INDIA BADGE */}
            <div className="flex items-center gap-1.5 cursor-default">
              <span className="text-gray-500 font-medium">Made with</span>
              <FiHeart
                size={10}
                className="text-red-500 fill-red-500 animate-pulse"
              />
              <span className="text-gray-200 font-bold">in India</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Systems Normal
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors cursor-pointer">
              <FiShield size={12} />
              <span>SOC2</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;