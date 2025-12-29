"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, RefreshCcw, AlertCircle, Clock, XCircle, CheckCircle, Hexagon, Mail } from "lucide-react";
import Link from "next/link";
import { Inter, Libre_Baskerville } from "next/font/google";

// --- FONTS ---
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const libre = Libre_Baskerville({ 
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-libre" 
});

// --- JIFWA REFUND SECTIONS (Based on PDF Pages 18-19) ---
const SECTIONS = [
  { id: "eligibility", title: "1. Eligibility Condition" },
  { id: "window", title: "2. Refund Window" },
  { id: "exceptions", title: "3. Non-Refundable Cases" },
  { id: "process", title: "4. How to Request" },
  { id: "timeline", title: "5. Processing Timeline" },
];

export default function RefundPage() {
  const [activeSection, setActiveSection] = useState("eligibility");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      SECTIONS.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`min-h-screen bg-[#FDFDFD] text-zinc-800 font-sans selection:bg-amber-100 selection:text-amber-900 ${inter.className} ${libre.variable}`}>
      
      {/* --- PREMIUM BACKGROUND TEXTURE --- */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-50 to-transparent"></div>
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-amber-50/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-50/50 rounded-full blur-[100px]"></div>
      </div>

      {/* --- READ PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-100 z-40 h-20 flex items-center transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 text-white p-2 rounded-lg">
               <Hexagon className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight text-zinc-900 ${libre.className}`}>
                Jifwa Legal
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                Refund Policy
              </span>
            </div>
          </div>
          <Link 
            href="/" 
            className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 pt-36 pb-12 px-6 border-b border-zinc-100/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              Effective Date: December 25, 2025
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-5xl md:text-6xl text-zinc-900 mb-6 leading-tight ${libre.className}`}
          >
            Refund Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-500 leading-relaxed max-w-2xl"
          >
            We strive for transparency. Our cancellation terms are fair, straightforward, and designed to protect both our users and our platform integrity.
          </motion.p>
        </div>
      </div>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* --- SIDEBAR NAVIGATION (Sticky) --- */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 pl-4">
              Table of Contents
            </p>
            <nav className="flex flex-col gap-1">
              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={`group flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    }`}
                  >
                    <span>{section.title}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  </button>
                );
              })}
            </nav>

            {/* Quick Contact */}
            <div className="mt-8 pt-8 border-t border-zinc-100">
               <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 pl-4">
                 Need Help?
               </p>
               <a href="mailto:contact@jifwa.com" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:text-amber-600 transition-colors">
                 <Mail size={14} /> Contact Billing
               </a>
            </div>
          </div>
        </aside>

        {/* --- MAIN TEXT CONTENT --- */}
        <div className="lg:col-span-9 pb-32 space-y-24">
          
          {/* 1. ELIGIBILITY CONDITION */}
          <SectionWrapper id="eligibility" title="1. Eligibility Condition" font={libre.className}>
             <p className="text-lg mb-6">
               Refunds are applicable <span className="underline decoration-amber-400 underline-offset-4 decoration-2 font-semibold">only</span> under the following specific condition:
             </p>
             <div className="bg-amber-50 border-l-4 border-amber-400 p-8 rounded-r-xl">
               <div className="flex items-start gap-4">
                 <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                 <div>
                   <h4 className="text-amber-900 font-bold text-lg mb-2">Verified Technical Failure</h4>
                   <p className="text-amber-800 leading-relaxed">
                     [cite_start]You are unable to use the Jifwa platform due to a verified technical issue originating from <strong>Jifwa's systems</strong> [cite: 430-431].
                   </p>
                 </div>
               </div>
             </div>
          </SectionWrapper>

          {/* 2. REFUND WINDOW */}
          <SectionWrapper id="window" title="2. Refund Window" font={libre.className}>
             <div className="flex items-start gap-6 p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
                <div className="bg-zinc-100 p-4 rounded-full">
                  <Clock className="w-8 h-8 text-zinc-600" />
                </div>
                <div>
                  <h4 className="text-zinc-900 font-bold text-xl mb-2">7 Days</h4>
                  <p className="text-zinc-600 leading-relaxed">
                    Refund requests must be submitted within <strong>7 days</strong> from the date of payment. [cite_start]Requests made after this window are not eligible[cite: 433].
                  </p>
                </div>
             </div>
          </SectionWrapper>

          {/* 3. NON-REFUNDABLE CASES */}
          <SectionWrapper id="exceptions" title="3. Non-Refundable Cases" font={libre.className}>
             <p className="mb-6">
               We do not issue refunds for reasons unrelated to platform failure. [cite_start]The following cases are <strong>not eligible</strong> for refunds[cite: 435]:
             </p>
             <div className="grid sm:grid-cols-2 gap-4">
               {[
                 'Change of mind',
                 'Lack of usage',
                 'Business dissatisfaction',
                 'Misunderstanding of features',
                 'User-side internet/device issues'
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-100 text-zinc-600">
                   <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                   <span className="font-medium text-sm">{item}</span>
                 </div>
               ))}
             </div>
          </SectionWrapper>

          {/* 4. HOW TO REQUEST */}
          <SectionWrapper id="process" title="4. How to Request" font={libre.className}>
             <p className="mb-8">
               [cite_start]To initiate a refund request, please email our support team at <strong className="text-zinc-900">contact@jifwa.com</strong> with the following details[cite: 442]:
             </p>
             
             <div className="space-y-4">
               <div className="flex items-center gap-4 p-4 bg-white border border-zinc-200 rounded-lg">
                 <span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-xs">1</span>
                 <span className="text-zinc-700 font-medium">Registered Email Address</span>
               </div>
               <div className="flex items-center gap-4 p-4 bg-white border border-zinc-200 rounded-lg">
                 <span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-xs">2</span>
                 <span className="text-zinc-700 font-medium">Payment Reference ID</span>
               </div>
               <div className="flex items-center gap-4 p-4 bg-white border border-zinc-200 rounded-lg">
                 <span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-xs">3</span>
                 <span className="text-zinc-700 font-medium">Description of the technical issue</span>
               </div>
             </div>
          </SectionWrapper>

          {/* 5. PROCESSING TIMELINE */}
          <SectionWrapper id="timeline" title="5. Processing Timeline" font={libre.className}>
             <div className="bg-zinc-900 text-zinc-200 p-8 rounded-2xl relative overflow-hidden flex items-center gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
                <div className="relative z-10 bg-zinc-800 p-3 rounded-xl">
                  <RefreshCcw className="w-8 h-8 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className={`text-xl text-white mb-2 ${libre.className}`}>7-10 Business Days</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    [cite_start]Approved refunds will be processed back to your original payment method within 7-10 business days[cite: 447].
                  </p>
                </div>
             </div>
          </SectionWrapper>

          {/* FOOTER */}
          <div className="pt-12 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
             <p>&copy; 2025 Jifwa. All rights reserved.</p>
             <a href="mailto:contact@jifwa.com" className="hover:text-zinc-900 transition-colors">contact@jifwa.com</a>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENT ---

function SectionWrapper({ id, title, children, font }: { id: string; title: string; children: React.ReactNode; font?: string }) {
  return (
    <section id={id} className="scroll-mt-32 group">
       <div className="flex items-center gap-4 mb-8">
          <h2 className={`text-3xl text-zinc-900 ${font} group-hover:text-amber-700 transition-colors`}>
            {title}
          </h2>
          <div className="h-px flex-1 bg-zinc-200 group-hover:bg-amber-100 transition-colors"></div>
       </div>
       <div className="prose prose-lg prose-zinc text-zinc-600 leading-8 max-w-none">
          {children}
       </div>
    </section>
  );
}