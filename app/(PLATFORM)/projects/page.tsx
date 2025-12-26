import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User";
import { ProjectsClient } from "@/components/pages/projects/projects-client";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  // 1. Auth Check
  const { userId } = auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) redirect("/sign-in");

  await connectDB();

  // 2. Get Current User & Role from DB
  const dbUser = await User.findOne({ clerkId: userId });

  // Fallback if user doesn't exist yet
  if (!dbUser) redirect("/dashboard");

  const role = dbUser.currentRole; // "client" or "vendor"
  const email = clerkUser.emailAddresses[0].emailAddress;

  // 3. Fetch Projects Based on Role
  let query = {};

  if (role === "client") {
    // Client: See projects I OWN
    query = { userId: userId };
  } else {
    // Vendor: See projects assigned to MY EMAIL
    query = { vendorEmail: email };
  }

  // 4. Execute Query
  const projects = await Project.find(query).sort({ createdAt: -1 }).lean();

  // 5. Serialize Data
  const serializedProjects = JSON.parse(JSON.stringify(projects));

  return <ProjectsClient initialProjects={serializedProjects} />;
}
