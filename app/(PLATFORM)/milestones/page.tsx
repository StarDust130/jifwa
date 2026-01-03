import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User";
import MilestoneClient from "@/components/pages/milestone/MilestoneClient";
import { resolveOwnerContext } from "@/lib/owner";

export const dynamic = "force-dynamic";

// Define a basic interface for your Project structure to satisfy TypeScript
interface IProject {
  _id: string;
  userId: string;
  vendorEmail: string;
  title?: string;
  contractName?: string;
  createdAt: string;
}

export default async function MilestonesPage() {
  // 1. Auth Check
  const { userId } = auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) redirect("/sign-in");

  await connectDB();

  // 2. Get Current User from DB
  const ctx = await resolveOwnerContext(userId);
  const dbUser = ctx?.actingUser || (await User.findOne({ clerkId: userId }));
  const ownerId = ctx?.ownerClerkId || userId;
  const email = clerkUser.emailAddresses[0].emailAddress;

  // 3. Role Detection
  // Default to "client". We DO NOT guess based on vendor assignments anymore.
  let role = "client";

  if (dbUser && dbUser.currentRole) {
    role = dbUser.currentRole;
  }

  // 🔒 4. SECURITY:
  // If role is explicitly 'vendor', check if they own projects (Dual Role).
  // If they own projects, we ignore the 'vendor' label and let them stay.
  if (role === "vendor") {
    const isProjectOwner = await Project.exists({ userId: userId });
    if (!isProjectOwner) {
      redirect("/dashboard");
    }
  }

  // 5. Fetch Projects (Client Only)
  let projects: IProject[] = [];

  try {
    const fetchedProjects = await Project.find({ userId: ownerId })
      .sort({ createdAt: -1 })
      .lean();

    projects = fetchedProjects as unknown as IProject[];
  } catch (error) {
    console.error("Fetch error:", error);
    projects = [];
  }

  // 6. Serialize Data
  const serializedProjects = JSON.parse(JSON.stringify(projects));

  const serializedUser = dbUser
    ? JSON.parse(JSON.stringify(dbUser))
    : { clerkId: userId, currentRole: "client", email };

  return (
    <MilestoneClient
      initialProjects={serializedProjects}
      currentUser={serializedUser}
    />
  );
}
