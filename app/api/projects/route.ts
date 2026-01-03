import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import { resolveOwnerContext } from "@/lib/owner";

export const dynamic = "force-dynamic"; // ⚠️ CRITICAL for Vercel/Next.js to not cache old data

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const ctx = await resolveOwnerContext(userId);
    const ownerId = ctx?.ownerClerkId || userId;

    // Fetch projects sorted by newest first
    const projects = await Project.find({ userId: ownerId })
      .select("contractName total_value status milestones createdAt") // Optimize: Don't fetch huge summary text
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
