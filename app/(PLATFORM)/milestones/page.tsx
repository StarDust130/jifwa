import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import MilestoneClient from "@/components/pages/milestone/MilestoneClient";


export const dynamic = "force-dynamic";

export default async function MilestonesPage() {
  const { userId } = auth();
  const user = await currentUser();
  if (!userId || !user) redirect("/sign-in");

  await connectDB();

  // 🚀 Fetching directly on the server for instant "Zero-Load" feel
  const projects = await Project.find({
    $or: [
      { userId },
      { vendorId: userId },
      { vendorEmail: user.emailAddresses[0].emailAddress },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  const serializedProjects = JSON.parse(JSON.stringify(projects));

  return <MilestoneClient initialProjects={serializedProjects} />;
}
