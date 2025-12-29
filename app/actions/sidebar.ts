"use server";

import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getVendorSidebarData() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) return [];

    await connectDB();

    const email = user.emailAddresses[0].emailAddress;

    // 🔍 EXACT QUERY MATCHING YOUR ASSIGNMENTS PAGE
    const projects = await Project.find({
      $or: [{ vendorEmail: email }, { vendorId: userId }],
    })
      .select("_id contractName status createdAt") // Only fetch needed fields
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 🟢 Serialize: Convert _id to string to avoid serialization errors
    const serialized = projects.map((p: any) => ({
      projectId: p._id.toString(),
      contractName: p.contractName || "Untitled Project", // Fallback on server side
      status: p.status,
    }));

    return serialized;
  } catch (error) {
    console.error("❌ Sidebar Error:", error);
    return [];
  }
}
