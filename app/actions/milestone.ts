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
  try {
    const { userId } = auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return { success: false, error: "Invalid Project ID" };
    }

    await connectDB();
    const project = await Project.findById(projectId);
    if (!project) return { success: false, error: "Project not found" };

    const milestone = project.milestones.find(
      (m: any) => m._id.toString() === milestoneId
    ) as any;
    if (!milestone) return { success: false, error: "Milestone not found" };

    if (action === "submit_proof") {
      // Server-side check for empty data
      if (!data.fileUrl && !data.linkUrl) {
        return { success: false, error: "Proof content is missing" };
      }
      milestone.proof_url = data.fileUrl || data.linkUrl || "";
      milestone.proof_notes = data.notes || "";
      milestone.status = "in_review";
      milestone.submittedAt = new Date();
    } else if (action === "approve") {
      if (project.userId !== userId)
        return { success: false, error: "Only client can approve" };
      milestone.status = "approved";
    } else if (action === "reject") {
      if (project.userId !== userId)
        return { success: false, error: "Only client can reject" };
      milestone.status = "dispute";
      milestone.proof_url = "";
      milestone.proof_notes = `[CLIENT REJECTED]: ${data.feedback} \n\n${
        milestone.proof_notes || ""
      }`;
    }

    await project.save();

    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/assignments/${projectId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, error: "Server error occurred" };
  }
}
