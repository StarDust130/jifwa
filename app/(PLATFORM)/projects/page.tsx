import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User";
import { ProjectsClient } from "@/components/pages/projects/projects-client";
import { getPlanId, getPlanLimit } from "@/lib/plans";
import { resolveOwnerContext } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { userId } = auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) redirect("/sign-in");

  await connectDB();

  const ctx = await resolveOwnerContext(userId);
  const dbUser = ctx?.actingUser || (await User.findOne({ clerkId: userId }));
  const ownerId = ctx?.ownerClerkId || userId;

  // 1. Role Detection
  // Default to "client" if user is missing or new.
  // We DO NOT check 'vendorEmail' here anymore to prevent false positives during testing.
  let role = "client";

  if (dbUser && dbUser.currentRole) {
    role = dbUser.currentRole;
  }

  // 🛡️ SECURITY FIX:
  // If the DB explicitly says they are a 'vendor', we check if they own projects.
  // If they own projects, we ignore the 'vendor' label and let them access the page (Dual Role).
  // If they are a 'vendor' and own nothing, we redirect them.
  if (role === "vendor") {
    const isProjectOwner = await Project.exists({ userId: userId });
    if (!isProjectOwner) {
      redirect("/dashboard");
    }
  }

  // 3. Fetch Client Projects
  let projects: any[] = [];
  try {
    projects = await Project.find({ userId: ownerId })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    projects = [];
  }

  const serializedProjects = JSON.parse(JSON.stringify(projects));

  const plan = getPlanId((ctx?.ownerUser || dbUser)?.plan);
  const limit = getPlanLimit(plan);
  const currentUsage = serializedProjects.length;

  return (
    <ProjectsClient
      initialProjects={serializedProjects}
      plan={plan}
      limit={limit}
      currentUsage={currentUsage}
    />
  );
}
