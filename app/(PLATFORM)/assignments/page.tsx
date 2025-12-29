import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User"; // 👈 IMPORT USER MODEL
import { AssignmentsClient } from "@/components/pages/assignments/assignments-client";

export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/sign-in");

  await connectDB();

  // 🔒 1. SECURITY: Role Check
  // We check the DB. If they are explicitly a "client", get them out.
  const dbUser = await User.findOne({ clerkId: userId });

  if (dbUser?.currentRole === "client") {
    redirect("/dashboard");
  }

  // 2. Fetch Assignments (Only reachable if NOT a client)
  const email = user.emailAddresses[0].emailAddress;

  const query = {
    $or: [{ vendorEmail: email }, { vendorId: userId }],
  };

  const assignedProjects = await Project.find(query)
    .sort({ createdAt: -1 })
    .lean();

  const serializedData = JSON.parse(JSON.stringify(assignedProjects));

  return <AssignmentsClient initialData={serializedData} />;
}
