import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { projectId, email, senderName } = await req.json();

    console.log(`🔹 INVITE REQUEST: Project ${projectId} -> Email ${email}`);

    await connectDB();

    // 1. Find Project
    const project = await Project.findById(projectId);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // 2. HARD UPDATE (Use updateOne to bypass any document versioning issues)
    await Project.updateOne(
      { _id: projectId },
      { $set: { vendorEmail: email } }
    );

    console.log("✅ DB UPDATE SUCCESS: Email saved.");

    // 3. Send Email
    try {
      if (process.env.RESEND_API_KEY) {
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        await resend.emails.send({
          from: "Jifwa <onboarding@resend.dev>",
          to: email,
          subject: `${senderName || "A Client"} invited you to '${
            project.contractName
          }'`,
          html: `<p>You have been invited to execute <strong>${project.contractName}</strong>.</p>
                 <a href="${appUrl}/projects/${projectId}"><strong>Click here to Join Workspace</strong></a>`,
        });
        console.log("✅ EMAIL SENT");
      }
    } catch (e) {
      console.error("⚠️ EMAIL FAILED:", e);
    }

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
