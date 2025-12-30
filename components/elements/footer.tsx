"use client";
import React from "react";
import Image from "next/image";
import { FaXTwitter, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa6";
import { FiMail, FiMapPin, FiHeart, FiArrowRight } from "react-icons/fi";

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
    { icon: FaInstagram, href: "#" },
    { icon: FaGithub, href: "#" },
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
    { name: "Refund Policy", href: "/refund" },
    { name: "AI Security", href: "/ai-security" },
  ];

  return (
    <footer className="w-full bg-white text-[#0B2447] font-sans border-t border-slate-100 relative overflow-hidden">
      {/* Background Ambience - Subtle & Professional */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-50/30 rounded-full blur-[120px] pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/30 rounded-full blur-[120px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 pt-16 pb-8">
        {/* 1. TOP CTA SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 border-b border-slate-100 pb-12 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0B2447]">
              Ready to automate execution?
            </h2>
            <p className="text-slate-500 text-base">
              Join teams converting contracts into clear workflows today.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="h-11 px-6 rounded-lg bg-[#0B2447] text-white text-sm font-semibold hover:bg-[#1e3a5f] transition-colors duration-200 flex items-center gap-2"
            >
              Get Started
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. MAIN GRID */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-8 mb-16 text-left">
          {/* BRAND COLUMN */}
          <div className="col-span-2 lg:col-span-4 flex flex-col gap-6">
            <div className="relative h-20 w-40">
              <Image
                src="/logo.png"
                alt="Jifwa Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              AI-native, fully encrypted contract execution platform for
              businesses that demand clarity.
            </p>

            {/* Social Icons - Clean, Tactile, No Blur */}
            <div className="flex gap-2">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="w-9 h-9 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 
                  hover:border-[#0B2447] hover:text-[#0B2447] hover:bg-slate-50 transition-all duration-200"
                >
                  <item.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* PRODUCT LINKS */}
          <div className="col-span-1 lg:col-span-2 lg:col-start-6">
            <h4 className="text-xs font-bold text-[#0B2447] uppercase tracking-widest mb-6">
              Product
            </h4>
            <ul className="space-y-3">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) =>
                      item.isScroll && handleScroll(e, item.href.substring(1))
                    }
                    className="block text-slate-500 text-sm hover:text-[#0B2447] hover:translate-x-1 transition-all duration-200"
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
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="block text-slate-500 text-sm hover:text-[#0B2447] hover:translate-x-1 transition-all duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="col-span-2 lg:col-span-3 lg:col-end-13">
            <h4 className="text-xs font-bold text-[#0B2447] uppercase tracking-widest mb-6">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-slate-500">
                <FiMapPin size={16} className="mt-1 text-teal-600 shrink-0" />
                <span className="leading-relaxed">
                  Sane Guruji Nagar, Chopda,
                  <br />
                  Jalgaon, Maharashtra - 425107
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <FiMail size={16} className="text-teal-600 shrink-0" />
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-100">
          <p className="text-slate-400 text-xs font-medium">
            &copy; {currentYear} Jifwa. All rights reserved.
          </p>

          {/* MADE IN INDIA - Classy, Not Noisy */}
          <div className="flex items-center gap-2 text-[11px] text-[#0B2447] font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <span className="text-slate-500">Made with</span>
            <FiHeart
              size={12}
              className="text-red-500 fill-red-500 animate-pulse"
              style={{ animationDuration: "2s" }}
            />
            <span className="text-slate-500">in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
