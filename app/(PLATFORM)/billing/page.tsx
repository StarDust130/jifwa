import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import connectDB from "@/lib/db";
import User from "@/models/User";
import BillingPageClient from "@/components/pages/billing/BillingPageClient";

export default async function BillingPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/sign-in");

  await connectDB();
  const dbUser = await User.findOne({ clerkId: userId });

  // Pass data to the Client Component
  return (
    <BillingPageClient
      currentPlan={dbUser?.plan || "free"}
      userEmail={user.emailAddresses[0].emailAddress}
      userName={user.fullName || "User"}
    />
  );
}
