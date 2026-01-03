import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const { userId } = auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const dbUser = await User.findOne({ clerkId: userId }).lean();

    return NextResponse.json(
      { isBanned: Boolean(dbUser?.isBanned) },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("User status check failed", error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
