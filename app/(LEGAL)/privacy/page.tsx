"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, Globe, Server, Database, Hexagon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Inter, Libre_Baskerville } from "next/font/google";

// --- FONTS ---
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const libre = Libre_Baskerville({ 
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-libre" 
});

// --- JIFWA SECTIONS (Based on PDF) ---
const SECTIONS = [
  { id: "collection", title: "1. Information Collection" },
  { id: "security", title: "2. Encryption & Security" },
  { id: "ai", title: "3. AI Privacy (No Training)" },
  { id: "sharing", title: "4. Data Sharing" },
  { id: "rights", title: "5. Your Rights" },
  { id: "contact", title: "6. Contact Us" },
];

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
      const scrollPosition = window.scrollY + 250; // Offset for header
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
        top: element.offsetTop - 120, // Offset for sticky header
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
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50/50 rounded-full blur-[100px]"></div>
      </div>

      {/* --- READ PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 origin-left z-50"
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
                Privacy Policy
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
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Effective Date: December 25, 2025
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-5xl md:text-6xl text-zinc-900 mb-6 leading-tight ${libre.className}`}
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-500 leading-relaxed max-w-2xl"
          >
            We built Jifwa because we didn't trust existing tools with sensitive contracts. 
            Here is exactly how we secure your data, protect your privacy, and respect your rights.
          </motion.p>
        </div>
      </div>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* --- SIDEBAR NAVIGATION (Sticky) --- */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 pl-4">
              Contents
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

            {/* DPO Contact Card */}
            <div className="mt-8 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100">
               <p className="text-xs font-bold text-indigo-900 uppercase mb-2">Have concerns?</p>
               <p className="text-xs text-indigo-700 mb-3">Reach our Data Protection Officer directly.</p>
               <a href="mailto:contact@jifwa.com" className="text-xs font-bold text-indigo-600 flex items-center hover:underline">
                 contact@jifwa.com <ChevronRight size={12} />
               </a>
            </div>
          </div>
        </aside>

        {/* --- MAIN TEXT CONTENT --- */}
        <div className="lg:col-span-9 pb-32 space-y-24">
          
          {/* 1. DATA COLLECTION */}
          <SectionWrapper id="collection" title="1. Information Collection" font={libre.className}>
             <p>
               Jifwa ("we", "our", "us") collects only the minimum amount of data necessary to operate the platform. We believe in data minimization.
             </p>
             <div className="grid md:grid-cols-2 gap-6 mt-8">
                <InfoCard 
                  title="Account Information" 
                  desc="Name and email address for authentication and account management." 
                  icon={UserIcon}
                />
                <InfoCard 
                  title="Contract Documents" 
                  desc="PDFs and execution data you upload. These are encrypted immediately." 
                  icon={FileIcon}
                />
                <InfoCard 
                  title="Usage Metadata" 
                  desc="Timestamps and action logs to help us improve platform performance." 
                  icon={Database}
                />
                <InfoCard 
                  title="Payment Information" 
                  desc="Processed securely via Razorpay. We DO NOT store card, UPI, or banking details." 
                  icon={CreditCardIcon}
                />
             </div>
          </SectionWrapper>

          {/* 2. SECURITY */}
          <SectionWrapper id="security" title="2. Security & Encryption" font={libre.className}>
             <p>
               All contract content, uploaded files, and execution data are encrypted using industry-standard methods. Our architecture is <strong>privacy-first</strong>.
             </p>
             <div className="mt-8 bg-zinc-900 text-zinc-300 rounded-2xl p-8 shadow-xl">
               <ul className="space-y-6">
                 <li className="flex items-start gap-4">
                   <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400 mt-1">
                     <Globe size={20} />
                   </div>
                   <div>
                     <h5 className="text-white font-bold text-lg">Encryption In Transit</h5>
                     <p className="text-sm mt-1 opacity-80">All data moving between your device and our servers is secured via <strong>TLS 1.3</strong>.</p>
                   </div>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400 mt-1">
                     <Lock size={20} />
                   </div>
                   <div>
                     <h5 className="text-white font-bold text-lg">Encryption At Rest</h5>
                     <p className="text-sm mt-1 opacity-80">Stored files are protected with <strong>AES-256</strong> encryption standards.</p>
                   </div>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400 mt-1">
                     <Eye size={20} />
                   </div>
                   <div>
                     <h5 className="text-white font-bold text-lg">Zero Internal Access</h5>
                     <p className="text-sm mt-1 opacity-80">Even Jifwa staff and administrators <strong>cannot view</strong> your contract content.</p>
                   </div>
                 </li>
               </ul>
             </div>
          </SectionWrapper>

          {/* 3. AI PRIVACY */}
          <SectionWrapper id="ai" title="3. AI Privacy (No Training)" font={libre.className}>
             <p>
               Jifwa uses Artificial Intelligence to extract deliverables and suggest milestones. However, our AI usage is strictly controlled to ensure confidentiality.
             </p>
             
             <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
                  <h4 className="text-red-900 font-bold mb-4 flex items-center gap-2">
                    <span className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded">WE DO NOT</span>
                  </h4>
                  <ul className="space-y-3 text-red-800 text-sm">
                    <li className="flex gap-2"><span>×</span> Use external APIs (OpenAI, Claude, etc.)</li>
                    <li className="flex gap-2"><span>×</span> Train our models on your customer data</li>
                    <li className="flex gap-2"><span>×</span> Allow AI to make autonomous decisions</li>
                  </ul>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
                  <h4 className="text-emerald-900 font-bold mb-4 flex items-center gap-2">
                    <span className="bg-emerald-200 text-emerald-800 text-xs px-2 py-0.5 rounded">WE DO</span>
                  </h4>
                  <ul className="space-y-3 text-emerald-800 text-sm">
                    <li className="flex gap-2"><span>✓</span> Run AI privately in our own infrastructure</li>
                    <li className="flex gap-2"><span>✓</span> Use AI solely for execution clarity</li>
                    <li className="flex gap-2"><span>✓</span> Keep human review mandatory for all AI outputs</li>
                  </ul>
                </div>
             </div>
          </SectionWrapper>

          {/* 4. DATA SHARING */}
          <SectionWrapper id="sharing" title="4. Data Sharing" font={libre.className}>
             <p>
               Jifwa does not sell, rent, or trade user data. Data may be shared only in the following strictly limited circumstances:
             </p>
             <ul className="mt-6 space-y-4">
                <li className="flex items-center gap-3 p-4 bg-white border border-zinc-100 rounded-lg shadow-sm">
                   <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">P</div>
                   <span className="text-zinc-700"><strong>Razorpay:</strong> For secure payment processing.</span>
                </li>
                <li className="flex items-center gap-3 p-4 bg-white border border-zinc-100 rounded-lg shadow-sm">
                   <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-xs">L</div>
                   <span className="text-zinc-700"><strong>Legal:</strong> Compliance with regulatory or governmental requirements.</span>
                </li>
             </ul>
          </SectionWrapper>

          {/* 5. RIGHTS */}
          <SectionWrapper id="rights" title="5. Your Rights" font={libre.className}>
             <p>
               You retain full ownership of your data. Under applicable laws, you have the right to:
             </p>
             <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {['Access your personal data', 'Correct inaccurate data', 'Delete your data', 'Terminate your account'].map((right, i) => (
                  <div key={i} className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-600 font-medium">
                    {right}
                  </div>
                ))}
             </div>
             <p className="mt-6 text-sm text-zinc-500">
               To exercise any of these rights, simply email us at <strong className="text-zinc-900">contact@jifwa.com</strong>.
             </p>
          </SectionWrapper>

          {/* 6. CONTACT */}
          <SectionWrapper id="contact" title="6. Contact Information" font={libre.className}>
             <div className="bg-zinc-900 text-zinc-200 p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <h3 className={`text-2xl text-white mb-6 ${libre.className}`}>Jifwa</h3>
                  <div className="space-y-4 text-sm">
                    <p className="flex gap-4">
                      <span className="text-zinc-500 w-16 uppercase text-xs font-bold tracking-widest mt-1">Address</span>
                      <span className="leading-relaxed">
                        Sane Guruji Nagar,<br />
                        Chopda, Jalgaon District,<br />
                        Maharashtra - 425107, India
                      </span>
                    </p>
                    <p className="flex gap-4">
                      <span className="text-zinc-500 w-16 uppercase text-xs font-bold tracking-widest mt-1">Email</span>
                      <a href="mailto:contact@jifwa.com" className="text-white hover:text-indigo-400 transition-colors">contact@jifwa.com</a>
                    </p>
                  </div>
                </div>
             </div>
          </SectionWrapper>

          {/* FOOTER */}
          <div className="pt-12 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
             <p>&copy; 2025 Jifwa. All rights reserved.</p>
             <p>Privacy-First Contract Execution.</p>
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

function InfoCard({ title, desc, icon: Icon }: { title: string; desc: string; icon: any }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
       <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-600 mb-4">
         <Icon size={20} strokeWidth={1.5} />
       </div>
       <h5 className="font-bold text-zinc-900 mb-2">{title}</h5>
       <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}

// Icons
function UserIcon({ size, ...props }: any) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function FileIcon({ size, ...props }: any) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function CreditCardIcon({ size, ...props }: any) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>; }