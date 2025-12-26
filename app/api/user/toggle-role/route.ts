import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 1. Fetch User
    const user = await User.findOne({ clerkId: userId });

    // 2. FIX: Handle null case explicitly
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Toggle Role
    const newRole = user.currentRole === "client" ? "vendor" : "client";
    user.currentRole = newRole;
    await user.save();

    return NextResponse.json({ success: true, role: newRole });
  } catch (error) {
    console.error("Toggle Role Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
