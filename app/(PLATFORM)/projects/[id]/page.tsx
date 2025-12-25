import { auth, currentUser, clerkClient } from "@clerk/nextjs/server"; // 👈 Import clerkClient
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import mongoose from "mongoose";
import { ProjectHeader } from "@/components/pages/projects/project-id-ui/project-header";
import { ProjectMetadata } from "@/components/pages/projects/project-id-ui/project-metadata";
import { ExecutionTimeline } from "@/components/pages/projects/project-id-ui/execution-timeline";

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

  const project = await getProject(params.id);
  if (!project) return notFound();

  // 1. Fetch the Creator's Real Profile from Clerk
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

  // 2. Determine Permissions
  const isClient = project.userId === userId;

  // 3. Auto-Join Logic (For Vendor)
  if (!isClient && project.vendorEmail) {
    const currentUserData = await currentUser();
    const myEmail = currentUserData?.emailAddresses[0]?.emailAddress;
    if (myEmail === project.vendorEmail && !project.vendorId) {
      await connectDB();
      await Project.updateOne(
        { _id: params.id },
        { $set: { vendorId: userId, vendorJoinedAt: new Date() } }
      );
      project.vendorId = userId;
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
      <ProjectHeader project={project} isClient={isClient} />
      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
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
          {/* 👇 Pass the real creator profile here */}
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
