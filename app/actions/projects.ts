"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { resolveOwnerContext } from "@/lib/owner";

// --- 1. FETCH PROJECTS BASED ON ACTIVE ROLE ---
export async function getDashboardProjects() {
  try {
    const { userId } = auth();
    const user = await currentUser();
    if (!userId || !user) return { error: "Unauthorized" };

    await connectDB();

    // Get the user's *current active role* from DB
    const ctx = await resolveOwnerContext(userId);
    const dbUser = ctx?.actingUser || (await User.findOne({ clerkId: userId }));
    const ownerId = ctx?.ownerClerkId || userId;
    if (!dbUser) return { error: "User profile not found" };

    const role = dbUser.currentRole; // 'client' or 'vendor'
    const email = user.emailAddresses[0].emailAddress;

    let projects = [];

    if (role === "client") {
      // CLIENT VIEW: Show projects I created
      projects = await Project.find({ userId: ownerId }).sort({
        createdAt: -1,
      });
    } else {
      // VENDOR VIEW: Show projects where I am the vendor
      // (Matches by email, since invite is sent to email)
      projects = await Project.find({ vendorEmail: email }).sort({
        createdAt: -1,
      });
    }

    // Serialize for Client Components
    return {
      success: true,
      role,
      projects: JSON.parse(JSON.stringify(projects)),
    };
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return { error: "Failed to load projects" };
  }
}

// --- 2. VENDOR SUBMITS PROOF ---
export async function submitMilestoneProof(
  projectId: string,
  milestoneId: string,
  proofUrl: string,
  notes: string
) {
  try {
    const { userId } = auth();
    if (!userId) return { error: "Unauthorized" };

    await connectDB();

    // Find project and update the specific milestone
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        "milestones._id": milestoneId,
      },
      {
        $set: {
          "milestones.$.status": "in_review", // 👈 Updates status to Review
          "milestones.$.proof_url": proofUrl,
          "milestones.$.proof_notes": notes,
          "milestones.$.completed_at": new Date(),
        },
      },
      { new: true }
    );

    if (!project) return { error: "Update failed" };

    // ⚡ Trigger AI Verification here (Placeholder for Phase 2)
    // await runAiVerification(proofUrl);

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Proof Submission Error:", error);
    return { error: "Server Error" };
  }
}
