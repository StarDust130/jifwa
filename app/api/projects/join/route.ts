import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { projectId } = await req.json();
    const userEmail = user.emailAddresses[0]?.emailAddress;

    await connectDB();
    const project = await Project.findById(projectId);

    if (!project)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 🛑 Check: Is this the invited vendor?
    if (project.vendorEmail === userEmail && !project.vendorId) {
      // ✅ Mark as Joined
      project.vendorId = userId;
      project.vendorJoinedAt = new Date();
      await project.save();
      return NextResponse.json({ success: true, status: "joined" });
    }

    return NextResponse.json({
      success: true,
      status: "already_joined_or_mismatch",
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
