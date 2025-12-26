import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  // 1. Verify Webhook Signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(body);

  // 2. Handle Subscription Success [cite: 144, 145]
  if (
    payload.event === "subscription.activated" ||
    payload.event === "subscription.charged"
  ) {
    const clerkId = payload.payload.subscription.entity.notes.clerkId;
    const razorpayPlanId = payload.payload.subscription.entity.plan_id;

    // Map Razorpay IDs to Jifwa Plans [cite: 125, 131]
    const planMapping: Record<string, string> = {
      plan_Rw9LRqwiuoIW1P: "starter",
      plan_Rw9NHkfmV33x8L: "agency",
    };

    const newPlan = planMapping[razorpayPlanId] || "free";

    await connectDB();
    await User.findOneAndUpdate({ clerkId }, { plan: newPlan }); // Unlock features instantly [cite: 146, 199]
    console.log(`✅ User ${clerkId} upgraded to ${newPlan}`);
  }

  return NextResponse.json({ success: true });
}
