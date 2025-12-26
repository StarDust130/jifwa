"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function toggleUserRole() {
  console.log("🚀 [ACTION START] toggleUserRole called");

  try {
    // 1. Check Auth
    const { userId } = auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      console.error("❌ [ERROR] Unauthorized");
      return { error: "Unauthorized" };
    }

    await connectDB();

    // 2. Find OR Create User (Self-Healing)
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      console.warn(
        "⚠️ [DB] User not found. Creating new user from Clerk data..."
      );

      // Create the missing user in MongoDB
      user = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        currentRole: "client", // Default role
        photo: clerkUser.imageUrl,
      });

      console.log("✅ [DB] User created successfully.");
    }

    // 3. Toggle Role Logic
    const oldRole = user.currentRole || "client";
    const newRole = oldRole === "client" ? "vendor" : "client";

    console.log(`🔄 [LOGIC] Switching from '${oldRole}' to '${newRole}'`);

    // 4. Save to DB
    user.currentRole = newRole;
    await user.save();

    // 5. Revalidate Cache
    revalidatePath("/", "layout");

    return { success: true, role: newRole };
  } catch (error: any) {
    console.error("🔥 [CRITICAL ERROR] Exception inside toggleUserRole:");
    console.error(error);
    return { error: error.message || "Server error" };
  }
}
