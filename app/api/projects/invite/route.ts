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
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    // 2. Verify Project Ownership
    const project = await Project.findOne({ _id: projectId, userId });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 3. Assign Vendor (Save to DB)
    project.vendorEmail = email; // 👈 This is the key for access later
    project.status = "processing";
    await project.save();

    // 4. Send Email
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/milestones/${projectId}`;
    const senderName = user.firstName || "Client";

    // ⚠️ IMPORTANT: Use 'onboarding@resend.dev' if you haven't verified 'jifwa.com'
    const { data, error } = await resend.emails.send({
      from: "Jifwa App <onboarding@resend.dev>",
      to: email, // ⚠️ On Free Tier, this MUST be your own email
      subject: `New Job: ${project.contractName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Assignment</h2>
          <p><strong>${senderName}</strong> has assigned you to <strong>${project.contractName}</strong>.</p>
          <p>Login with this email to access the workspace.</p>
          <br/>
          <a href="${inviteLink}" style="background: #000; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
            Open Workspace
          </a>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json(
        { error: "Email failed to send" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
