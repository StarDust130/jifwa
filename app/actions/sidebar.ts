"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User";

export async function getVendorSidebarData() {
  try {
    const { userId } = auth();
    const user = await currentUser();
    if (!userId || !user) return [];

    await connectDB();

    // 1. Verify Role
    const dbUser = await User.findOne({ clerkId: userId });
    if (dbUser?.currentRole !== "vendor") return [];

    // 2. Find Assigned Projects
    const email = user.emailAddresses[0].emailAddress;
    const projects = await Project.find({ vendorEmail: email }).lean();

    // 3. Extract pending milestones & Flatten
    const allMilestones = projects.flatMap((p: any) =>
      p.milestones
        .filter((m: any) => m.status === "pending" || m.status === "in_review")
        .map((m: any) => ({
          title: m.title,
          status: m.status,
          projectId: p._id.toString(), // ID for linking
          _id: m._id.toString(),
        }))
    );

    // 4. Sort by priority (mock logic: just take first 5)
    return JSON.parse(JSON.stringify(allMilestones.slice(0, 5)));
  } catch (error) {
    console.error("Sidebar Fetch Error:", error);
    return [];
  }
}
