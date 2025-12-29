"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function deleteAccountAction() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Delete user directly from the backend API
  const client = await clerkClient();
  await client.users.deleteUser(userId);

  return { success: true };
}
