"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, Globe, Download, Server, Cookie } from "lucide-react";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("collection");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        if (section && section.offsetTop <= scrollPosition) {
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
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-teal-500 selection:text-white relative overflow-hidden">
      
      {/* --- BACKGROUND DESIGN ELEMENTS --- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        {/* 1. Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* 2. Glows (Teal/Blue for Privacy Theme) */}
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        {/* 3. Shapes */}
        <div className="absolute top-32 right-20 w-32 h-32 border border-slate-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-20 h-20 border border-slate-200 rounded-xl opacity-20 rotate-12"></div>
      </div>

      {/* --- PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 z-40 h-16 flex items-center transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Jifwa
          </Link>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:border-teal-300 hover:text-teal-600 text-slate-600 rounded-md text-xs font-bold transition-all shadow-sm">
                <Download size={14} /> PDF
             </button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 pt-32 pb-16 px-6 border-b border-gray-100/50">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
              <Shield size={24} />
            </div>
            <span className="px-3 py-1 rounded-full bg-teal-50/50 text-teal-700 text-xs font-bold border border-teal-100 flex items-center gap-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Last Updated: Dec 25, 2025
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6 tracking-tight"
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 leading-relaxed max-w-2xl"
          >
            Your trust is our currency. We are transparent about how we protect your data, secure your contracts, and respect your rights.
          </motion.p>
        </div>
      </div>

      {/* --- CONTENT LAYOUT --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- STICKY SIDEBAR --- */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 max-h-[80vh] overflow-y-auto pr-4 scrollbar-hide">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">
              Contents
            </h3>
            <nav className="space-y-1 relative border-l border-gray-200 ml-4">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`relative block w-full text-left px-4 py-2.5 text-sm transition-all duration-300 ${
                    activeSection === section.id
                      ? "text-teal-600 font-bold translate-x-1"
                      : "text-slate-500 hover:text-slate-900 hover:translate-x-1"
                  }`}
                >
                  {activeSection === section.id && (
                    <motion.div 
                      layoutId="active-dot"
                      className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-teal-600 rounded-full border-2 border-white shadow-sm"
                    />
                  )}
                  {section.title}
                </button>
              ))}
            </nav>
            
            {/* Help Card */}
            <div className="mt-8 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
               <div className="flex items-start gap-3">
                  <Lock size={20} className="text-teal-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Data Officer</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                       Concerns about your data? Reach our DPO directly.
                    </p>
                    <a href="mailto:privacy@jifwa.com" className="text-xs font-bold text-teal-600 mt-3 block hover:underline">
                      Contact DPO →
                    </a>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* --- MAIN TEXT CONTENT --- */}
        <div className="lg:col-span-8 lg:col-start-5 pb-32">
          
          {/* 1. DATA COLLECTION */}
          <SectionWrapper id="collection" title="1. Data Collection">
             <p>
               When you use Jifwa ("Service"), we collect specific data points to enable our contract extraction engine. We believe in data minimization—collecting only what is necessary.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-white/80 p-5 rounded-xl border border-gray-200/60 shadow-sm">
                   <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-teal-500"></div> User Uploads
                   </h5>
                   <p className="text-sm text-slate-600 leading-relaxed">
                     PDF, DOCX, and text files you explicitly upload for processing. These are the core assets we protect.
                   </p>
                </div>
                <div className="bg-white/80 p-5 rounded-xl border border-gray-200/60 shadow-sm">
                   <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-blue-500"></div> Account Info
                   </h5>
                   <p className="text-sm text-slate-600 leading-relaxed">
                     Name, email, and billing details (processed via Stripe). We do not store full credit card numbers.
                   </p>
                </div>
             </div>
          </SectionWrapper>

          {/* 2. AI & PRIVACY */}
          <SectionWrapper id="ai-processing" title="2. AI Processing & Privacy">
             <p>
               Jifwa utilizes proprietary Large Language Models (LLMs) to analyze contracts. We understand the sensitivity of legal documents.
             </p>
             <div className="my-8 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Eye size={120} />
                </div>
                <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-3 relative z-10">Zero-Training Policy</h4>
                <p className="text-slate-700 text-base leading-relaxed relative z-10">
                  We do <strong>not</strong> use your proprietary contracts to train our public models. Your data remains isolated within your tenant context (RAG Architecture). Data processed by our AI is ephemeral in the inference layer. Once the extraction JSON is delivered, the raw inference context is purged from the GPU cache.
                </p>
             </div>
          </SectionWrapper>

          {/* 3. SECURITY */}
          <SectionWrapper id="security" title="3. Security Infrastructure">
             <p>
               Security is not an afterthought; it is our foundation. We employ defense-in-depth strategies to protect your information.
             </p>
             <ul className="mt-6 space-y-4">
               <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                 <div className="mt-1 bg-green-100 p-2 rounded-lg text-green-600"><Lock size={18} /></div>
                 <div>
                   <h5 className="font-bold text-slate-900">Encryption at Rest</h5>
                   <p className="text-sm text-slate-500 mt-1">AES-256 encryption for all stored files in AWS S3 buckets.</p>
                 </div>
               </li>
               <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                 <div className="mt-1 bg-green-100 p-2 rounded-lg text-green-600"><Globe size={18} /></div>
                 <div>
                   <h5 className="font-bold text-slate-900">Encryption in Transit</h5>
                   <p className="text-sm text-slate-500 mt-1">TLS 1.3 for all data moving between your client and our servers.</p>
                 </div>
               </li>
               <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                 <div className="mt-1 bg-green-100 p-2 rounded-lg text-green-600"><Server size={18} /></div>
                 <div>
                   <h5 className="font-bold text-slate-900">Access Controls</h5>
                   <p className="text-sm text-slate-500 mt-1">Strict role-based access control (RBAC) ensures only authorized systems touch your data.</p>
                 </div>
               </li>
             </ul>
          </SectionWrapper>

          {/* 4. COOKIES */}
          <SectionWrapper id="cookies" title="4. Cookies & Tracking">
             <p>
               We use cookies to improve your experience and for analytics. We do not use cookies for cross-site tracking or selling data to ad networks.
             </p>
             <div className="mt-4 flex gap-3 text-sm text-slate-600">
                <Cookie size={18} className="text-slate-400" />
                <span>Essential Cookies: For login sessions and security.</span>
             </div>
             <div className="mt-2 flex gap-3 text-sm text-slate-600">
                <Cookie size={18} className="text-slate-400" />
                <span>Analytics Cookies: To understand how users navigate our dashboard (e.g., PostHog).</span>
             </div>
          </SectionWrapper>

          {/* 5. USER RIGHTS */}
          <SectionWrapper id="rights" title="5. Your Rights (GDPR/CCPA)">
             <p>
               If you are a resident of the EEA, UK, or California, you have enhanced rights regarding your data.
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <button className="text-left p-4 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors border border-teal-100">
                   <h5 className="font-bold text-teal-900 text-sm">Right to Access</h5>
                   <p className="text-xs text-teal-700 mt-1">Request a copy of all data we hold.</p>
                </button>
                <button className="text-left p-4 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors border border-teal-100">
                   <h5 className="font-bold text-teal-900 text-sm">Right to Erasure</h5>
                   <p className="text-xs text-teal-700 mt-1">Request total deletion of your account.</p>
                </button>
             </div>
          </SectionWrapper>

          {/* 6. CONTACT */}
          <SectionWrapper id="contact" title="6. Contact Us">
             <p>
               If you have any questions about this Privacy Policy, please contact us. We are committed to resolving complaints about your privacy and our collection or use of your personal information.
             </p>
             <div className="mt-6 p-6 bg-slate-900 text-white rounded-2xl">
                <div className="font-bold text-lg mb-2">Jifwa Privacy Office</div>
                <div className="space-y-1 text-slate-300 text-sm">
                   <p>548 Market St, San Francisco, CA 94104</p>
                   <p>Email: <a href="mailto:privacy@jifwa.com" className="text-teal-400 hover:underline">privacy@jifwa.com</a></p>
                </div>
             </div>
          </SectionWrapper>

           {/* FOOTER SIGNOFF */}
           <div className="mt-24 pt-10 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                 &copy; 2025 Jifwa Inc. All rights reserved.
              </div>
              <div className="flex gap-4">
                 <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                 <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Section Wrapper
function SectionWrapper({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-24 scroll-mt-32 group">
       <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
            {title}
          </h2>
          <div className="h-px flex-1 bg-gray-200 group-hover:bg-teal-100 transition-colors"></div>
       </div>
       <div className="prose prose-lg prose-slate text-slate-600 leading-8">
          {children}
       </div>
    </section>
  );
}

const SECTIONS = [
  { id: "collection", title: "1. Data Collection" },
  { id: "ai-processing", title: "2. AI Processing" },
  { id: "security", title: "3. Security" },
  { id: "cookies", title: "4. Cookies" },
  { id: "rights", title: "5. Your Rights" },
  { id: "contact", title: "6. Contact" },
];