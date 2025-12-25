"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Scale, ShieldCheck, Download, AlertCircle } from "lucide-react";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("intro");
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
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* --- BACKGROUND DESIGN ELEMENTS --- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        
        {/* 1. Technical Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* 2. Top Right Glow (Blue/Purple) */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        
        {/* 3. Bottom Left Glow (Teal) */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px]"></div>

        {/* 4. Floating Abstract Shapes */}
        <div className="absolute top-40 left-10 w-24 h-24 border border-slate-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-40 right-10 w-40 h-40 border border-slate-200 rounded-full opacity-20 border-dashed"></div>
      </div>


      {/* --- PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 z-40 h-16 flex items-center transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Jifwa
          </Link>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 rounded-md text-xs font-bold transition-all shadow-sm">
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
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
              <Scale size={24} />
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-50/50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Effective: Dec 25, 2025
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6 tracking-tight"
          >
            Terms of Service
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 leading-relaxed max-w-2xl"
          >
            Transparent rules for a seamless partnership. Read how Jifwa protects your data and your rights.
          </motion.p>
        </div>
      </div>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- STICKY SIDEBAR --- */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 max-h-[80vh] overflow-y-auto pr-4 scrollbar-hide">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">
              On this page
            </h3>
            <nav className="space-y-1 relative border-l border-gray-200 ml-4">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`relative block w-full text-left px-4 py-2.5 text-sm transition-all duration-300 ${
                    activeSection === section.id
                      ? "text-indigo-600 font-bold translate-x-1"
                      : "text-slate-500 hover:text-slate-900 hover:translate-x-1"
                  }`}
                >
                  {activeSection === section.id && (
                    <motion.div 
                      layoutId="active-dot"
                      className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white shadow-sm"
                    />
                  )}
                  {section.title}
                </button>
              ))}
            </nav>
            
            {/* Help Card */}
            <div className="mt-8 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
               <div className="flex items-start gap-3">
                  <ShieldCheck size={20} className="text-indigo-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Have questions?</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                       Our legal compliance team is here to help clarify any clauses.
                    </p>
                    <a href="mailto:legal@jifwa.com" className="text-xs font-bold text-indigo-600 mt-3 block hover:underline">
                      Contact Legal →
                    </a>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* --- MAIN TEXT CONTENT --- */}
        <div className="lg:col-span-8 lg:col-start-5 pb-32">
          
          <SectionWrapper id="intro" title="1. Introduction & Acceptance">
             <p>
               Welcome to Jifwa ("Company", "we", "our", "us"). These Terms of Service ("Terms", "Agreement") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Jifwa, concerning your access to and use of the Jifwa website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Service").
             </p>
             <p>
               By accessing the Service, you acknowledge that you have read, understood, and agree to be bound by all of these Terms. <span className="font-bold text-slate-900 bg-yellow-100 px-1">If you do not agree with all of these Terms, then you are expressly prohibited from using the Service and you must discontinue use immediately.</span>
             </p>
          </SectionWrapper>

          <SectionWrapper id="definitions" title="2. Definitions">
             <ul className="space-y-4">
               {/* Definition Cards */}
               <li className="bg-white/80 p-5 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                 <span className="font-bold text-indigo-900 block mb-1 text-base">"User Content"</span>
                 <span className="text-slate-600 text-sm leading-relaxed">Refers to any text, files, documents, contracts, images, or other materials that you upload, import, or otherwise provide to the Service for extraction or processing.</span>
               </li>
               <li className="bg-white/80 p-5 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                 <span className="font-bold text-indigo-900 block mb-1 text-base">"AI Outputs"</span>
                 <span className="text-slate-600 text-sm leading-relaxed">Refers to the structured data, summaries, JSON objects, and insights generated by the Jifwa AI engine based on your User Content.</span>
               </li>
             </ul>
          </SectionWrapper>

          <SectionWrapper id="license" title="3. SaaS License Grant">
             <p>
               Subject to your compliance with these Terms, Jifwa grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Service for your internal business operations.
             </p>
             <div className="my-8 p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <ShieldCheck size={120} />
                </div>
                <h4 className="font-bold text-indigo-900 text-sm uppercase tracking-wide mb-3 relative z-10">Usage Restrictions</h4>
                <ul className="space-y-3 text-sm text-slate-700 relative z-10">
                   <li className="flex gap-3 items-center"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>You may not reverse engineer or attempt to extract source code.</li>
                   <li className="flex gap-3 items-center"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>You may not use the Service to build a competitive product.</li>
                   <li className="flex gap-3 items-center"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>You may not share your account credentials with third parties.</li>
                </ul>
             </div>
          </SectionWrapper>

          <SectionWrapper id="ai-disclaimer" title="4. AI Technology Disclaimer">
             <p>
               The Service utilizes advanced artificial intelligence and machine learning algorithms. You acknowledge that AI technology is probabilistic and may produce errors, inaccuracies, or "hallucinations."
             </p>
             <p className="mt-4">
               <strong>Human Review Required:</strong> You agree that you are solely responsible for reviewing and verifying the accuracy of any AI Output before taking any action based on such output (e.g., making payments, signing contracts, or sending legal notices). Jifwa is an assistive tool, not a replacement for professional legal advice or human judgment.
             </p>
          </SectionWrapper>

          <SectionWrapper id="payment" title="5. Payment & Billing">
             <p>
                Services are billed in advance on a subscription basis. You agree to pay all fees associated with your selected plan.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                   <h5 className="font-bold text-slate-900 mb-1">Automatic Renewal</h5>
                   <p className="text-sm text-slate-500">Subscriptions renew automatically unless canceled 24 hours before the end of the current term.</p>
                </div>
                <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                   <h5 className="font-bold text-slate-900 mb-1">Refund Policy</h5>
                   <p className="text-sm text-slate-500">We offer a 14-day money-back guarantee for new annual subscriptions. Monthly plans are non-refundable.</p>
                </div>
             </div>
          </SectionWrapper>

          <SectionWrapper id="liability" title="6. Limitation of Liability">
             <div className="p-8 bg-red-50/50 border border-red-100 rounded-2xl relative overflow-hidden backdrop-blur-sm">
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                     <AlertCircle size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900 text-lg mb-2">Cap on Damages</h4>
                    <p className="text-red-900/80 text-sm leading-relaxed">
                       TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL JIFWA BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. JIFWA'S TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO JIFWA DURING THE TWELVE (12) MONTHS PRIOR TO THE EVENT GIVING RISE TO THE LIABILITY.
                    </p>
                  </div>
                </div>
             </div>
          </SectionWrapper>

          <SectionWrapper id="termination" title="7. Term & Termination">
             <p>
                This Agreement shall remain in full force and effect while you use the Service. You may terminate your use or participation at any time, for any reason, by following the instructions for terminating user accounts in your account settings.
             </p>
             <p className="mt-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
             </p>
          </SectionWrapper>

           {/* FOOTER SIGNOFF */}
           <div className="mt-24 pt-10 border-t border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">J</div>
                 <div>
                    <div className="font-bold text-slate-900 text-lg">Jifwa Legal Team</div>
                    <div className="text-sm text-slate-500">San Francisco, CA</div>
                 </div>
              </div>
              <p className="text-base text-slate-500 italic max-w-2xl">
                 "Our goal is to make contract intelligence accessible and safe. These terms ensure we can provide that service reliably to everyone."
              </p>
           </div>

        </div>
      </div>
    </div>
  );
}

function SectionWrapper({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-24 scroll-mt-32 group">
       <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
            {title}
          </h2>
          <div className="h-px flex-1 bg-gray-200 group-hover:bg-indigo-100 transition-colors"></div>
       </div>
       <div className="prose prose-lg prose-slate text-slate-600 leading-8">
          {children}
       </div>
    </section>
  );
}

const SECTIONS = [
  { id: "intro", title: "1. Introduction" },
  { id: "definitions", title: "2. Definitions" },
  { id: "license", title: "3. License Grant" },
  { id: "ai-disclaimer", title: "4. AI Disclaimer" },
  { id: "payment", title: "5. Payment & Billing" },
  { id: "liability", title: "6. Liability Cap" },
  { id: "termination", title: "7. Termination" },
];