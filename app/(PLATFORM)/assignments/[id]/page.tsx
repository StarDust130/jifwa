import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User"; // 👈 Import User Model
import mongoose from "mongoose";
import { VendorTaskBoard } from "@/components/pages/assignments/vendor-task-board";
import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

const sanitize = (obj: any): any => JSON.parse(JSON.stringify(obj));

export default async function AssignmentWorkspacePage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/sign-in");

  if (!mongoose.Types.ObjectId.isValid(params.id)) return notFound();

  await connectDB();

  // 1. 🔍 GET USER & CHECK ROLE
  const dbUser = await User.findOne({ clerkId: userId });

  // 🔒 SECURITY: CLIENTS ARE NOT ALLOWED HERE
  // If the database says you are a Client, you go to the dashboard.
  if (dbUser?.currentRole === "client") {
    redirect("/dashboard");
  }

  // 2. Fetch Project
  const projectDoc = await Project.findById(params.id).lean();
  if (!projectDoc) return notFound();

  const project = sanitize(projectDoc);
  const userEmail = user.emailAddresses[0]?.emailAddress;

  // 3. 🛡️ SECURITY: VERIFY VENDOR ASSIGNMENT
  // Even if you are a vendor, you must be assigned to THIS specific project.
  const isVendorByEmail =
    project.vendorEmail &&
    userEmail &&
    project.vendorEmail.toLowerCase() === userEmail.toLowerCase();

  const isVendorById =
    project.vendorId && project.vendorId.toString() === userId;

  const isAssignedVendor = isVendorByEmail || isVendorById;

  if (!isAssignedVendor) {
    redirect("/dashboard");
  }

  // 4. ⚡️ Auto-Link Vendor ID (Self-healing data)
  // If we matched by email but the ID isn't saved yet, save it now.
  if (isVendorByEmail && !project.vendorId) {
    await Project.updateOne({ _id: params.id }, { $set: { vendorId: userId } });
  }

  // ⚠️ CRITICAL: Ensure ID is a clean string
  const projectIdString = project._id.toString();

  return (
    <div className="min-h-screen font-sans bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/assignments"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-zinc-400" />
              <h1 className="text-sm font-bold text-zinc-900 truncate max-w-[200px] sm:max-w-md">
                {project.contractName}
              </h1>
            </div>
          </div>
          <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold border border-indigo-100 uppercase tracking-wider">
            Vendor Mode
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Your Assignments
          </h1>
          <p className="text-zinc-500 text-lg mt-1">
            Complete milestones below to unlock payments.
          </p>
        </div>

        {/* ⚠️ Passing String ID explicitly */}
        <VendorTaskBoard
          milestones={project.milestones}
          projectId={projectIdString}
        />
      </main>
    </div>
  );
}
