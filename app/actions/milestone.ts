"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import User from "@/models/User";
import { getPlanId } from "@/lib/plans";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

      try {
        const owner = await User.findOne({ clerkId: project.userId }).lean();
        const plan = getPlanId(owner?.plan);
        if (plan !== "free") {
          milestone.dispute_summary = await summarizeDispute(
            {
              title: milestone.title,
              criteria: milestone.criteria,
              feedback: data.feedback,
              proof_notes: milestone.proof_notes,
            },
            plan
          );
        }
      } catch (err) {
        console.error("Dispute summary failed", err);
      }
    }

    // Mark project completed when all milestones approved
    const allApproved = project.milestones.every(
      (m: any) => m.status === "approved"
    );
    project.status = allApproved ? "completed" : "active";

    await project.save();

    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/assignments/${projectId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, error: "Server error occurred" };
  }
}

async function summarizeDispute(
  payload: {
    title: string;
    criteria: string;
    feedback: string;
    proof_notes?: string;
  },
  plan: "free" | "starter" | "agency"
) {
  const detail =
    plan === "agency"
      ? "Provide a thorough, structured summary with key risks and next actions."
      : "Keep it concise (3 bullets).";

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an impartial project dispute analyst. Summarize disputes for clients and vendors. ${detail}`,
      },
      {
        role: "user",
        content: `Milestone: ${payload.title}\nCriteria: ${
          payload.criteria
        }\nClient feedback: ${payload.feedback}\nVendor notes: ${
          payload.proof_notes || ""
        }`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: plan === "agency" ? 0.2 : 0.1,
    max_tokens: plan === "agency" ? 400 : 250,
  });

  return completion.choices[0]?.message?.content || "";
}
