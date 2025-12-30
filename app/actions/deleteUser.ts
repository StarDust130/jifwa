"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function deleteAccountAction() {
  const { userId } =  auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // 1. Connect to your Database
    await connectDB();

    // 2. Delete from your MongoDB FIRST
    // We match 'clerkId' in your DB with the 'userId' from the session
    await User.findOneAndDelete({ clerkId: userId });

    // 3. Delete from Clerk
    const client = await clerkClient();
    await client.users.deleteUser(userId);

    return { success: true };
  } catch (error) {
    console.error("Delete Account Error:", error);
    return { success: false, error: "Failed to delete account data" };
  }
}
