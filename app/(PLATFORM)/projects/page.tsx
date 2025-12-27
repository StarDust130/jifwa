import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User";
import { ProjectsClient } from "@/components/pages/projects/projects-client";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { userId } = auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) redirect("/sign-in");

  await connectDB();

  const dbUser = await User.findOne({ clerkId: userId });
  const email = clerkUser.emailAddresses[0].emailAddress;

  // 1. Role Detection
  let role = "client";
  if (dbUser) {
    role = dbUser.currentRole;
  } else {
    // New user check
    const hasAssignments = await Project.exists({ vendorEmail: email });
    if (hasAssignments) role = "vendor";
  }

  // 🔒 2. SECURITY: Vendors cannot access this page. Redirect them.
  if (role === "vendor") {
    redirect("/dashboard");
  }

  // 3. Fetch Client Projects
  let projects: any[] = [];
  try {
    projects = await Project.find({ userId: userId })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    projects = [];
  }

  const serializedProjects = JSON.parse(JSON.stringify(projects));

  return <ProjectsClient initialProjects={serializedProjects} />;
}
