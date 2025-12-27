import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import { AssignmentsClient } from "@/components/pages/assignments/assignments-client";


export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/sign-in");

  await connectDB();

  const email = user.emailAddresses[0].emailAddress;

  // 1. Fetch ONLY projects where this user is the Vendor
  const assignedProjects = await Project.find({ vendorEmail: email })
    .sort({ updatedAt: -1 }) // Show most active jobs first
    .lean();

  const serializedData = JSON.parse(JSON.stringify(assignedProjects));

  return <AssignmentsClient initialData={serializedData} />;
}
