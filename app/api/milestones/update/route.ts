import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { projectId, milestoneId, action, data } = await req.json();

    await connectDB();
    const project = await Project.findById(projectId);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const milestone = project.milestones.id(milestoneId);
    if (!milestone)
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );

    // --- LOGIC ENGINE ---

    // 1. VENDOR SUBMIT
    if (action === "submit_proof") {
      milestone.status = "in_review";
      milestone.proof_url = data.proof_url;
      milestone.proof_notes = data.proof_notes;
      milestone.completed_at = new Date();
    }
    // 2. CLIENT APPROVE
    else if (action === "approve") {
      if (project.userId !== userId)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      milestone.status = "approved";
    }
    // 3. CLIENT REJECT
    else if (action === "reject") {
      if (project.userId !== userId)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      milestone.status = "pending";
    }

    await project.save();
    return NextResponse.json({ success: true, milestone });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
