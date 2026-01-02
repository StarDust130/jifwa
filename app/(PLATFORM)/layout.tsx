import React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";

import { Header } from "@/components/pages/platform/Header";
import BackToTop from "@/components/elements/BackToTop";
import Sidebar from "@/components/pages/platform/Sidebar";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Server-Side Auth Check
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Fetch User Role Securely on Server
  await connectDB();
  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    const clerkProfile = await currentUser();
    const email =
      clerkProfile?.primaryEmailAddress?.emailAddress ||
      `${userId}@placeholder.local`;
    const name =
      `${clerkProfile?.firstName || ""} ${
        clerkProfile?.lastName || ""
      }`.trim() ||
      clerkProfile?.username ||
      email;

    user = await User.create({
      clerkId: userId,
      email,
      name,
      currentRole: "client",
      photo: clerkProfile?.imageUrl,
      plan: "free",
    });
  }

  // Default to 'client' if role is missing
  const role = user.currentRole || "client";

  return (
    <div className="min-h-screen bg-white flex font-sans text-gray-900">
      {/* DESKTOP SIDEBAR - Passing the server-fetched role to the client component */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-50 border-r border-gray-200">
        <Sidebar initialRole={role} />
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col bg-white">
        {/* TOPBAR */}
        <Header userRole={role} />
        {/* PAGE RENDER */}
        <div className="flex-1 w-full max-w-[1600px] mx-auto">
          {children}
          <BackToTop />
        </div>
      </main>
    </div>
  );
}
