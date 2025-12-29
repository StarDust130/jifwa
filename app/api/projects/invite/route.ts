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
    project.vendorEmail = email;
    project.status = "active"; // 👈 Set to active so they can start working
    await project.save();

    // 4. Send Email
    // Link directs them straight to the Vendor Workspace
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/milestones/${projectId}`;
    const senderName = user.firstName || "Client";

    const { error } = await resend.emails.send({
      from: "Jifwa App <onboarding@resend.dev>", // Change this when you verify your domain
      to: email,
      subject: `New Assignment: ${project.contractName}`,
      html: `
        <div style="font-family: sans-serif; padding: 40px; background-color: #f4f4f5;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #e4e4e7;">
            <h2 style="margin-top: 0; color: #18181b;">New Job Offer</h2>
            <p style="color: #52525b; font-size: 16px; line-height: 1.5;">
              <strong>${senderName}</strong> has assigned you to the contract <strong>${project.contractName}</strong>.
            </p>
            <p style="color: #52525b; font-size: 14px;">
              Log in with this email to access your workspace and submit proofs of work.
            </p>
            <br/>
            <div style="text-align: center;">
              <a href="${inviteLink}" style="display: inline-block; background: #18181b; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;">
                Accept & Open Workspace
              </a>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json(
        { error: "Email failed to send, but vendor was assigned." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
