"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export async function updateMilestone(
  projectId: string,
  milestoneId: string,
  action: "submit_proof" | "approve" | "reject",
  data: any
) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  // 1. SAFETY: Check if projectId exists before validating
  if (!projectId || projectId === "undefined") {
    throw new Error("Missing Project ID");
  }

  // 2. Validate format
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error(`Invalid Project ID format: ${projectId}`);
  }

  await connectDB();

  // 3. Find Project
  const project = await Project.findById(projectId);

  if (!project) throw new Error("Project not found");

  // 4. Find Milestone
  const milestone = project.milestones.find(
    (m: any) => m._id.toString() === milestoneId
  ) as any;

  if (!milestone) throw new Error("Milestone not found");

  // --- LOGIC ---
  if (action === "submit_proof") {
    milestone.proof_url = data.fileUrl || data.linkUrl || "";
    milestone.proof_notes = data.notes || "";
    milestone.status = "in_review";
    milestone.submittedAt = new Date();
  } else if (action === "approve") {
    if (project.userId !== userId) throw new Error("Only client can approve");
    milestone.status = "approved";
  } else if (action === "reject") {
    if (project.userId !== userId) throw new Error("Only client can reject");
    milestone.status = "dispute";
    // Clear the proof URL so vendor has to upload again
    milestone.proof_url = "";
    milestone.proof_notes = `[CLIENT REJECTED]: ${data.feedback} \n\n${
      milestone.proof_notes || ""
    }`;
  }

  await project.save();

  // ⚡️ Refresh paths
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/assignments/${projectId}`);

  return { success: true };
}
