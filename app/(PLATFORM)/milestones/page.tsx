import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User";
import MilestoneClient from "@/components/pages/milestone/MilestoneClient";

export const dynamic = "force-dynamic";

export default async function MilestonesPage() {
  // 1. Auth Check
  const { userId } = auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) redirect("/sign-in");

  await connectDB();

  // 2. Get Current User from DB
  const dbUser = await User.findOne({ clerkId: userId });

  // Fallback for new users
  if (!dbUser) redirect("/dashboard");

  // 🔒 3. SECURITY: Block Vendors
  // Vendors have their own page (/assignments), they shouldn't be here.
  if (dbUser.currentRole === "vendor") {
    redirect("/dashboard");
  }

  // 4. Fetch Projects (Client Only)
  // Since we blocked vendors above, we only need to query for Client ownership
  const query = { userId: userId };

  const projects = await Project.find(query).sort({ createdAt: -1 }).lean();

  // 5. Serialize Data
  const serializedProjects = JSON.parse(JSON.stringify(projects));
  const serializedUser = JSON.parse(JSON.stringify(dbUser));

  return (
    <MilestoneClient
      initialProjects={serializedProjects}
      currentUser={serializedUser}
    />
  );
}
