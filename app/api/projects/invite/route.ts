import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // 1. Secure Authentication
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, email } = await req.json();

    if (!projectId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. Verify Project Ownership (Security Check)
    const project = await Project.findOne({ _id: projectId, userId });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // 3. Assign Vendor to Project
    // We update the vendorEmail field so the system knows who has access
    project.vendorEmail = email;
    project.status = "processing"; // Optional: Update status to indicate work has started
    await project.save();

    // 4. Send Professional Invite Email via Resend
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/projects/${projectId}`;
    const senderName = user.firstName || "A Client";

    await resend.emails.send({
      from: "Jifwa Execution <alerts@jifwa.com>", // Use your verified domain
      to: email,
      subject: `Action Required: You've been assigned to ${project.contractName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #18181b;">New Execution Assignment</h2>
          <p>Hello,</p>
          <p><strong>${senderName}</strong> has invited you to collaborate on the contract <strong>"${project.contractName}"</strong> as a Vendor.</p>
          <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #52525b;">Role: <strong>Vendor (Execution)</strong></p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #52525b;">Deliverable: <strong>Milestone Tracking</strong></p>
          </div>
          <p>Click below to accept the invite and view the required milestones.</p>
          <a href="${inviteLink}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Open Workspace
          </a>
          <p style="font-size: 12px; color: #a1a1aa; margin-top: 24px;">Powered by Jifwa - Secure Contract Execution</p>
        </div>
      `,
    });

    console.log(`✅ Invite sent to ${email} for Project ${projectId}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("🔥 INVITE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send invite" },
      { status: 500 }
    );
  }
}
