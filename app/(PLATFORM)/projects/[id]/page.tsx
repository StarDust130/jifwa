import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import mongoose from "mongoose";
import { ProjectHeader } from "@/components/pages/projects/project-id-ui/project-header";
import { ExecutionTimeline } from "@/components/pages/projects/project-id-ui/execution-timeline";
import { ProjectMetadata } from "@/components/pages/projects/project-id-ui/project-metadata";

// Helper: Sanitize MongoDB Data
const sanitize = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map((v) => sanitize(v));
  else if (obj && typeof obj === "object" && "toHexString" in obj) return obj.toHexString();
  else if (obj && typeof obj === "object" && obj instanceof Date) return obj.toISOString();
  else if (obj && typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = sanitize(obj[key]); }
    return newObj;
  }
  return obj;
};
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

  const isClient = project.userId === userId;

  return (
<div className="min-h-screen bg-slate-50/50 text-zinc-900 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header */}
      <ProjectHeader project={project} isClient={isClient} />

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
        
        {/* Left: Colorful Timeline */}
        <div className="lg:col-span-8">
            <div className="mb-8 pl-2">
               <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                  Execution Roadmap
               </h2>
               <p className="text-base text-zinc-500 mt-2 font-medium max-w-lg">
                  Real-time milestones. Green is done, Indigo is active.
               </p>
            </div>
            
            <ExecutionTimeline milestones={project.milestones} isClient={isClient} />
        </div>

        {/* Right: Metadata */}
        <div className="lg:col-span-4">
            <div className="sticky top-24">
                <ProjectMetadata project={project} isClient={isClient} />
            </div>
        </div>

      </main>
    </div>
  );
}