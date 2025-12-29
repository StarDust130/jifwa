"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, FileText, AlertTriangle, Shield, Scale, Gavel, Hexagon, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Inter, Libre_Baskerville } from "next/font/google";

// --- FONTS ---
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const libre = Libre_Baskerville({ 
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-libre" 
});

// --- JIFWA TERMS SECTIONS (Based on PDF Pages 16-18) ---
const SECTIONS = [
  { id: "purpose", title: "1. Platform Purpose" },
  { id: "responsibilities", title: "2. User Responsibilities" },
  { id: "aup", title: "3. Acceptable Use Policy" },
  { id: "liability", title: "4. Limitation of Liability" },
  { id: "termination", title: "5. Termination" },
  { id: "law", title: "6. Governing Law" },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("purpose");
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
    <div className={`min-h-screen bg-[#FDFDFD] text-zinc-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 ${inter.className} ${libre.variable}`}>
      
      {/* --- PREMIUM BACKGROUND TEXTURE --- */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-50 to-transparent"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[100px]"></div>
      </div>

      {/* --- READ PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 origin-left z-50"
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
                Terms of Use
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
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              Effective Date: December 25, 2025
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-5xl md:text-6xl text-zinc-900 mb-6 leading-tight ${libre.className}`}
          >
            Terms of Use
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-500 leading-relaxed max-w-2xl"
          >
            By accessing or using the Jifwa platform, you agree to the terms outlined below. These terms ensure clarity and accountability for all users.
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

            {/* Quick Links */}
            <div className="mt-8 pt-8 border-t border-zinc-100">
               <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 pl-4">
                 Related Policies
               </p>
               <Link href="/privacy" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:text-indigo-600 transition-colors">
                 <Shield size={14} /> Privacy Policy
               </Link>
               <Link href="/refund" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:text-indigo-600 transition-colors">
                 <Scale size={14} /> Refund Policy
               </Link>
            </div>
          </div>
        </aside>

        {/* --- MAIN TEXT CONTENT --- */}
        <div className="lg:col-span-9 pb-32 space-y-24">
          
          {/* 1. PLATFORM PURPOSE */}
          <SectionWrapper id="purpose" title="1. Platform Purpose" font={libre.className}>
             <p className="text-lg">
               Jifwa is strictly an <strong>execution clarity platform</strong>.
             </p>
             <div className="mt-6 bg-zinc-50 p-6 rounded-xl border border-zinc-200">
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                   <span className="text-zinc-700 text-sm">
                     [cite_start]<strong>No Legal Advice:</strong> We do not provide legal advice, contract drafting services, or legal validation of contracts[cite: 402].
                   </span>
                 </li>
                 <li className="flex items-start gap-3">
                   <FileText className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                   <span className="text-zinc-700 text-sm">
                     [cite_start]<strong>Execution Focus:</strong> Our sole goal is to ensure what is agreed in a contract actually happens during delivery[cite: 244].
                   </span>
                 </li>
               </ul>
             </div>
          </SectionWrapper>

          {/* 2. USER RESPONSIBILITIES */}
          <SectionWrapper id="responsibilities" title="2. User Responsibilities" font={libre.className}>
             <p>
               [cite_start]As a user of Jifwa, you are responsible for maintaining the integrity of your account and data[cite: 404].
             </p>
             <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Card 
                  title="Content Accuracy" 
                  desc="Ensuring the accuracy and legality of uploaded content."
                />
                <Card 
                  title="Credential Security" 
                  desc="Maintaining the confidentiality and security of account passwords."
                />
                <Card 
                  title="Legal Compliance" 
                  desc="Not uploading illegal, harmful, or unauthorized material."
                />
             </div>
          </SectionWrapper>

          {/* 3. ACCEPTABLE USE POLICY */}
          <SectionWrapper id="aup" title="3. Acceptable Use Policy (AUP)" font={libre.className}>
             <p>
               To maintain a secure environment, strict prohibitions apply. Users must not:
             </p>
             
             <div className="mt-6 bg-red-50 border border-red-100 p-8 rounded-2xl">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-red-900 font-medium">
                    <span className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-red-700 text-xs font-bold">✕</span>
                    [cite_start]Upload illegal or unauthorized content [cite: 410]
                  </li>
                  <li className="flex items-center gap-3 text-red-900 font-medium">
                    <span className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-red-700 text-xs font-bold">✕</span>
                    [cite_start]Attempt to breach platform security [cite: 411]
                  </li>
                  <li className="flex items-center gap-3 text-red-900 font-medium">
                    <span className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-red-700 text-xs font-bold">✕</span>
                    [cite_start]Abuse AI or system resources [cite: 412]
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-red-200 text-center text-xs font-bold text-red-600 uppercase tracking-widest">
                  [cite_start]Violations result in immediate account termination [cite: 414]
                </div>
             </div>
          </SectionWrapper>

          {/* 4. LIABILITY */}
          <SectionWrapper id="liability" title="4. Limitation of Liability" font={libre.className}>
             <p>
               Jifwa acts as an intermediary tool for execution management. We shall not be liable for:
             </p>
             <ul className="mt-6 space-y-4">
                <li className="flex items-center gap-3 p-4 bg-white border border-zinc-100 rounded-lg shadow-sm">
                   <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">1</div>
                   [cite_start]<span className="text-zinc-700">Business or financial losses incurred by users[cite: 417].</span>
                </li>
                <li className="flex items-center gap-3 p-4 bg-white border border-zinc-100 rounded-lg shadow-sm">
                   <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">2</div>
                   [cite_start]<span className="text-zinc-700">Outcomes of contractual or commercial disputes between users[cite: 418].</span>
                </li>
                <li className="flex items-center gap-3 p-4 bg-white border border-zinc-100 rounded-lg shadow-sm">
                   <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">3</div>
                   [cite_start]<span className="text-zinc-700">Indirect, incidental, or consequential damages[cite: 419].</span>
                </li>
             </ul>
             <p className="mt-6 text-sm text-zinc-500 italic">
               [cite_start]While reasonable efforts are made to maintain platform availability, uninterrupted or error-free service is not guaranteed[cite: 421].
             </p>
          </SectionWrapper>

          {/* 5. TERMINATION */}
          <SectionWrapper id="termination" title="5. Termination" font={libre.className}>
             <p>
               Access to the platform may be suspended or terminated in cases of:
             </p>
             <div className="mt-6 flex flex-wrap gap-3">
               {['Misuse of platform', 'Violations of terms', 'Legal obligations'].map((tag, i) => (
                 <span key={i} className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-full text-sm font-medium border border-zinc-200">
                   {tag}
                 </span>
               ))}
             </div>
          </SectionWrapper>

          {/* 6. GOVERNING LAW */}
          <SectionWrapper id="law" title="6. Governing Law" font={libre.className}>
             <div className="bg-zinc-900 text-zinc-200 p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
                <div className="relative z-10 flex items-start gap-6">
                  <div className="bg-zinc-800 p-3 rounded-xl">
                    <Gavel className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl text-white mb-2 ${libre.className}`}>Jurisdiction</h3>
                    <p className="text-zinc-400 leading-relaxed mb-4">
                      These terms are governed by the laws of <strong>India</strong>.
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                      Dispute Jurisdiction: Maharashtra, India
                    </div>
                  </div>
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

// --- HELPER COMPONENTS ---

function SectionWrapper({ id, title, children, font }: { id: string; title: string; children: React.ReactNode; font?: string }) {
  return (
    <section id={id} className="scroll-mt-32 group">
       <div className="flex items-center gap-4 mb-8">
          <h2 className={`text-3xl text-zinc-900 ${font} group-hover:text-indigo-900 transition-colors`}>
            {title}
          </h2>
          <div className="h-px flex-1 bg-zinc-200 group-hover:bg-indigo-100 transition-colors"></div>
       </div>
       <div className="prose prose-lg prose-zinc text-zinc-600 leading-8 max-w-none">
          {children}
       </div>
    </section>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
       <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-600 mb-4">
         <CheckCircle size={16} />
       </div>
       <h5 className="font-bold text-zinc-900 mb-2 text-sm">{title}</h5>
       <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}