import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db"; // Your existing db connection
import { Project } from "@/models/Project";
import User from "@/models/User";
import { getPlanId, getPlanLimit } from "@/lib/plans";
import { resolveOwnerContext } from "@/lib/owner";

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

    const ctx = await resolveOwnerContext(userId);
    const ownerId = ctx?.ownerClerkId || userId;
    const ownerUser = ctx?.ownerUser || ctx?.actingUser;

    // 4️⃣ Enforce Plan Limits server-side (defence in depth)
    const owner = ownerUser || (await User.findOne({ clerkId: ownerId }));
    const plan = getPlanId(owner?.plan);
    const limit = getPlanLimit(plan);
    const currentUsage = await Project.countDocuments({ userId: ownerId });

    if (currentUsage >= limit) {
      return NextResponse.json(
        {
          success: false,
          error:
            plan === "agency"
              ? "Unlimited plan misconfiguration. Please contact support."
              : "Project limit reached for your plan.",
          allowed: false,
          limit,
          currentUsage,
          plan,
        },
        { status: 403 }
      );
    }

    // 5️⃣ Create the Project
    // We auto-generate a name like "Contract with [Vendor Name]"
    const derivedName =
      parties.length > 1
        ? `Contract with ${parties[1]}`
        : "New Contract Project";

    const newProject = await Project.create({
      userId: ownerId,
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
