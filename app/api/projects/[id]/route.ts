import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import { resolveOwnerContext } from "@/lib/owner";

// DELETE PROJECT
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const ctx = await resolveOwnerContext(userId);
    const ownerId = ctx?.ownerClerkId || userId;

    const project = await Project.findOneAndDelete({
      _id: params.id,
      userId: ownerId,
    });

    if (!project)
      return NextResponse.json(
        { error: "Not found or forbidden" },
        { status: 404 }
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
