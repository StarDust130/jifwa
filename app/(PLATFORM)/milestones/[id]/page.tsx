import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User";
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
  const user = await currentUser();

  if (!userId || !user) redirect("/sign-in");

  await connectDB();

  // 1. 🔍 GET USER & CHECK ROLE
  const dbUser = await User.findOne({ clerkId: userId });

  // 🔒 SECURITY: VENDORS ARE NOT ALLOWED HERE
  // If you are a vendor, you should be in the /assignments workspace, not here.
  if (dbUser?.currentRole === "vendor") {
    redirect("/dashboard");
  }

  // 2. Fetch Project
  const project = await getProject(params.id);
  if (!project) return notFound();

  // 3. 🛡️ SECURITY: VERIFY CLIENT OWNERSHIP
  // You must be the CREATOR (Owner) of this project to see this dashboard.
  const isOwner = project.userId === userId;

  if (!isOwner) {
    console.log(
      "🚫 [Security] User attempted to access project they do not own."
    );
    redirect("/dashboard");
  }

  // 4. Fetch Vendor Profile (Optional but good for UI)
  // Since the Client is viewing, we might want to show who the Vendor is.
  let creator = {
    fullName: `${user.firstName} ${user.lastName}`,
    imageUrl: user.imageUrl,
    email: user.emailAddresses[0]?.emailAddress || "",
  };

  // NOTE: You can also fetch the *Vendor's* details here if you want to display them
  // in the sidebar, but for now we keep it simple as requested.

  // ✅ Client Mode Active
  const isClient = true;

  return (
    <div className="min-h-screen font-sans bg-[#F9FAFB]">
      {/* Header with Client Controls Enabled */}
      <ProjectHeader project={project} isClient={isClient} />

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Timeline */}
        <div className="lg:col-span-8">
          <div className="mb-8" id="execution-timeline">
            <h2 className="text-xl font-bold text-zinc-900">Execution Plan</h2>
          </div>

          <ExecutionTimeline
            milestones={project.milestones}
            projectId={params.id}
            isClient={isClient}
          />
        </div>

        {/* Right Column: Project Info */}
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
