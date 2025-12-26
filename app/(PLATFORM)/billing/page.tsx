import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import BillingPageClient from "@/components/pages/billing/BillingPageClient";

export default async function BillingPage() {
  // 1. Check Auth
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  // 2. Check Database Role
  await connectDB();
  const dbUser = await User.findOne({ clerkId: userId });

  // 🛡️ SECURITY CHECK: If user is a Vendor, KICK THEM OUT
  // This prevents them from seeing the page contents completely
  if (dbUser?.currentRole === "vendor") {
    redirect("/dashboard");
  }

  // 3. If Client, show the Billing Page
  return (
    <BillingPageClient
      currentPlan={dbUser?.plan || "free"}
      userEmail={dbUser?.email || ""}
      userName={dbUser?.name || ""}
    />
  );
}
