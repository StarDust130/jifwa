import BackToTop from "@/components/elements/BackToTop";
import LegalSidebar from "@/components/elements/legal-sidebar";
import React from "react";


// Metadata for SEO
export const metadata = {
  title: "Legal Center - Jifwa",
  description: "Transparency, security, and trust are at the core of Jifwa.",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0B2447] selection:bg-[#ccfbf1] selection:text-[#0B2447]">
      {/* GLOBAL HEADER BACKGROUND */}
      <div className="w-full bg-[#0B2447] text-white pt-32 pb-32 relative overflow-hidden">
        {/* Abstract Shapes for "Cool" Factor */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#14B8A6]/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-sm">
            Legal Center
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            Everything you need to know about how we protect your data, privacy,
            and rights.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CLIENT SIDEBAR (Navigation & Back Button) */}
          <div className="lg:col-span-3">
            <LegalSidebar />
          </div>

          {/* SERVER PAGE CONTENT (Rendered here) */}
          <div className="col-span-1 lg:col-span-9">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[600px]">
              {children}
              <BackToTop />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
