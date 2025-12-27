import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User"; // 👈 Import User Model
import mongoose from "mongoose";
import { ProjectHeader } from "@/components/pages/milestone/milestone-id-ui/project-header";
import { ExecutionTimeline } from "@/components/pages/milestone/milestone-id-ui/execution-timeline";
import { ProjectMetadata } from "@/components/pages/milestone/milestone-id-ui/project-metadata";

export const dynamic = "force-dynamic";

const sanitize = (obj: any): any => JSON.parse(JSON.stringify(obj));

async function getProject(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const projectDoc = await Project.findById(id).lean();
  if (!projectDoc) return null;
  return sanitize(projectDoc);
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  await connectDB();

  // 1. GET USER & CHECK ROLE
  const dbUser = await User.findOne({ clerkId: userId });

  // 🔒 SECURITY: If Vendor, kick them out immediately
  if (dbUser?.currentRole === "vendor") {
    redirect("/dashboard");
  }

  // 2. Fetch Project
  const project = await getProject(params.id);
  if (!project) return notFound();

  // 🔒 SECURITY: Verify Ownership (Only Client/Owner can see this)
  const isClient = project.userId === userId;

  if (!isClient) {
    // If they aren't the vendor (blocked above) AND not the client, they shouldn't be here.
    redirect("/dashboard");
  }

  // 3. Fetch the Creator's Real Profile from Clerk
  let creator = { fullName: "Client", imageUrl: "", email: "" };
  try {
    const user = await clerkClient.users.getUser(project.userId);
    creator = {
      fullName: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress || "",
    };
  } catch (e) {
    console.error("Failed to fetch creator:", e);
  }

  return (
    <div className="min-h-screen font-sans">
      <ProjectHeader project={project} isClient={isClient} />
      <main className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="mb-8" id="execution-timeline">
            <h2 className="text-xl font-bold text-zinc-900">Execution Plan</h2>
          </div>
          <ExecutionTimeline
            milestones={project.milestones}
            isClient={isClient}
          />
        </div>

        <div className="lg:col-span-4">
          <ProjectMetadata
            project={project}
            isClient={isClient}
            creator={creator}
          />
        </div>
      </main>
    </div>
  );
}
