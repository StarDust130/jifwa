import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User";
import MilestoneClient from "@/components/pages/milestone/MilestoneClient";

export const dynamic = "force-dynamic";

// Define a basic interface for your Project structure to satisfy TypeScript
interface IProject {
  _id: string;
  userId: string;
  vendorEmail: string;
  title?: string;
  contractName?: string;
  createdAt: string;
  // Add other fields as per your Project model
}

export default async function MilestonesPage() {
  // 1. Auth Check
  const { userId } = auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) redirect("/sign-in");

  await connectDB();

  // 2. Get Current User from DB
  const dbUser = await User.findOne({ clerkId: userId });
  const email = clerkUser.emailAddresses[0].emailAddress;

  // 3. Role Detection
  let role = "client";

  if (dbUser) {
    role = dbUser.currentRole;
  } else {
    // Check if new user is a vendor
    const hasAssignments = await Project.exists({ vendorEmail: email });
    if (hasAssignments) {
      role = "vendor";
    }
  }

  // 🔒 4. SECURITY: Only redirect if they are confirmed VENDORS
  if (role === "vendor") {
    redirect("/dashboard");
  }

  // 5. Fetch Projects (Client Only) - Explicitly Type the Array
  let projects: IProject[] = [];

  try {
    // We cast the result to IProject[] to fix the implicit 'any' error
    const fetchedProjects = await Project.find({ userId: userId })
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
