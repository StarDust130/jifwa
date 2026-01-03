import { currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import connectDB from "@/lib/db";

export type OwnerContext = {
  actingUser: any;
  ownerUser: any;
  ownerClerkId: string;
  isOwner: boolean;
};

export async function resolveOwnerContext(
  actingClerkId: string
): Promise<OwnerContext | null> {
  await connectDB();
  const clerkProfile = await currentUser();
  if (!clerkProfile) return null;
  const email = clerkProfile.emailAddresses?.[0]?.emailAddress?.toLowerCase();

  let actingUser = await User.findOne({ clerkId: actingClerkId });
  if (!actingUser) {
    actingUser = await User.create({
      clerkId: actingClerkId,
      email: email || `${actingClerkId}@placeholder.local`,
      name:
        `${clerkProfile.firstName || ""} ${
          clerkProfile.lastName || ""
        }`.trim() ||
        clerkProfile.username ||
        email ||
        `${actingClerkId}@placeholder.local`,
      currentRole: "client",
      photo: clerkProfile.imageUrl,
      plan: "free",
    });
  }

  // If already linked, fetch owner
  if (actingUser.linkedOwnerId) {
    const ownerUser = await User.findOne({ clerkId: actingUser.linkedOwnerId });
    if (ownerUser) {
      return {
        actingUser,
        ownerUser,
        ownerClerkId: ownerUser.clerkId,
        isOwner: false,
      };
    }
  }

  // If not linked, see if this user is invited under an owner team list
  if (email) {
    const owningUser = await User.findOne({ teamMembers: email });
    if (owningUser) {
      await User.updateOne(
        { clerkId: actingClerkId },
        { linkedOwnerId: owningUser.clerkId, plan: owningUser.plan }
      );
      actingUser = await User.findOne({ clerkId: actingClerkId });
      return {
        actingUser,
        ownerUser: owningUser,
        ownerClerkId: owningUser.clerkId,
        isOwner: false,
      };
    }
  }

  // Default: the user is the owner of their data
  return {
    actingUser,
    ownerUser: actingUser,
    ownerClerkId: actingClerkId,
    isOwner: true,
  };
}
