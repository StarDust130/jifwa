import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import { Resend } from "resend";

// Initialize Resend safely
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // 1. Auth Check
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Body
    const { projectId, email } = await req.json();

    if (!projectId || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 3. DB Connection
    await connectDB();
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 4. Update Database
    project.vendorEmail = email;
    await project.save();

    // 5. Send Email
    // Note: On Resend Free Tier, you can only send to your own registered email.
    try {
      if (process.env.RESEND_API_KEY) {
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        await resend.emails.send({
          from: "Jifwa <onboarding@resend.dev>",
          to: email,
          subject: `Project Invite: ${project.contractName}`,
          html: `<p>You have been invited to collaborate on <strong>${project.contractName}</strong>.</p>
                 <p><a href="${appUrl}/projects/${projectId}">Click here to view the workspace</a></p>`,
        });
      }
    } catch (emailError) {
      console.error("Email failed (Vendor still saved):", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Invite Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
