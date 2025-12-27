import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User"; // 👈 IMPORT USER MODEL
import mongoose from "mongoose";
import { VendorTaskBoard } from "@/components/pages/assignments/vendor-task-board";

export const dynamic = "force-dynamic";

const sanitize = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj));
};

export default async function AssignmentWorkspacePage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  if (!mongoose.Types.ObjectId.isValid(params.id)) return notFound();

  await connectDB();

  // 🔒 1. GLOBAL ROLE SECURITY (Added this)
  // Check who the user IS before checking what they OWN
  const dbUser = await User.findOne({ clerkId: userId });

  // Default to 'vendor' if new/unknown, but strict check for client
  const role = dbUser?.currentRole || "vendor";

  // If you are a CLIENT, get out.
  if (role === "client") {
    redirect("/dashboard");
  }

  // 2. Fetch Project
  const projectDoc = await Project.findById(params.id).lean();
  if (!projectDoc) return notFound();

  const project = sanitize(projectDoc);
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  // 3. 🛡️ VERIFY VENDOR ASSIGNMENT
  // Even if role is 'vendor', they must be assigned to THIS project
  const isAssignedVendor =
    (project.vendorEmail && project.vendorEmail === userEmail) ||
    (project.vendorId && project.vendorId === userId);

  // If not the assigned vendor, 404 (Security by obscurity)
  if (!isAssignedVendor) {
    return notFound();
  }

  // 4. ⚡️ Auto-Link Vendor ID (Self-healing data)
  if (!project.vendorId && isAssignedVendor) {
    await Project.updateOne({ _id: params.id }, { $set: { vendorId: userId } });
  }

  // --- RENDER VENDOR WORKSPACE ---
  return (
    <div className="min-h-screen font-sans  ">
      <main className="max-w-4xl mx-auto px-6 py-5">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-bold uppercase tracking-wider border border-indigo-100">
              Vendor Workspace
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Your Assignments
          </h1>
          <p className="text-zinc-500 text-lg mt-1">
            Complete milestones to unlock payments.
          </p>
        </div>

        <VendorTaskBoard
          milestones={project.milestones}
          projectId={project._id}
        />
      </main>
    </div>
  );
}
