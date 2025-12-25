"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import Sidebar from "@/components/pages/plaform/Sidebar";
import { Header } from "@/components/pages/plaform/Header";
import BackToTop from "@/components/elements/BackToTop";


export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-white flex font-sans text-gray-900">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-50">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col bg-white">
        {/* TOPBAR */}
        <Header />

        {/* PAGE RENDER */}
        <div className="flex-1 overflow-y-auto w-full max-w-[1400px] mx-auto">
          {children}
          <BackToTop />
        </div>
      </main>
    </div>
  );
}
