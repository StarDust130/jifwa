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

  return (
    <footer className="w-full bg-[#050505] text-white pt-12 pb-8 font-sans border-t border-white/5 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* 1. TOP CTA SECTION (Responsive) */}
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

        {/* 2. MAIN GRID (2 Cols on Mobile, 6 Cols on Desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10 mb-12">
          {/* BRAND COLUMN (Full width on mobile) */}
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-6 pr-0 lg:pr-8">
            {/* Logo */}
            <div className="relative h-7 w-28 opacity-90 hover:opacity-100 transition-opacity">
              <Image
                src="/logo-2.png"
                alt="Jifwa"
                fill
                className="object-contain object-left"
              />
            </div>
            
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The execution layer for legal contracts. Zero ambiguity, 100%
              compliance.
            </p>

            {/* Social Icons (Magnetic Hover) */}
            <div className="flex gap-3">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <item.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* PRODUCT LINKS (1 Col) */}
          <div className="col-span-1">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Features", id: "features" },
                { name: "Security", id: "security" },
                { name: "Pricing", id: "pricing" },
                { name: "FAQ", id: "faq" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleScroll(e, item.id)}
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

          {/* COMPANY LINKS (1 Col) */}
          <div className="col-span-1">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {["About", "Customers", "Careers", "Legal"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-500 text-sm hover:text-white transition-colors flex items-center gap-1 group w-fit"
                  >
                    {item}
                    <FiArrowUpRight
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-400"
                      size={12}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* HEADQUARTERS (Full width on mobile) */}
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

            {/* MADE IN INDIA BADGE (Bold & Clean) */}
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
