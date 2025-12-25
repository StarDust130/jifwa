import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db"; // Your existing db connection
import { Project } from "@/models/Project";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Secure the Route (Only logged-in users)
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Get Data from Frontend
    const body = await req.json();
    const { summary, parties, total_value, milestones } = body;

    // 3️⃣ Connect DB
    await connectDB();

    // 4️⃣ Create the Project
    // We auto-generate a name like "Contract with [Vendor Name]"
    const derivedName =
      parties.length > 1
        ? `Contract with ${parties[1]}`
        : "New Contract Project";

    const newProject = await Project.create({
      userId,
      contractName: derivedName,
      summary,
      parties,
      total_value,
      milestones, // Mongoose handles the sub-document array automatically
      status: "active",
    });

    return NextResponse.json({ success: true, projectId: newProject._id });
  } catch (error: any) {
    console.error("🔥 Save Error:", error);
    return NextResponse.json(
      { error: "Failed to save project" },
      { status: 500 }
    );
  }
}
