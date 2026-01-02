import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { getPlanId, PlanId } from "@/lib/plans";

// 1. Validate Environment Variables
if (
  !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  !process.env.RAZORPAY_KEY_SECRET ||
  !process.env.PLAN_STARTER_ID || // Check these too
  !process.env.PLAN_AGENCY_ID
) {
  throw new Error("CRITICAL: Razorpay keys or Plan IDs are missing.");
}

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 2. Type-Safe Plan Mapping using Env Vars
const RAZORPAY_PLANS: Record<PlanId, string> = {
  free: "", // free never hits Razorpay, keep placeholder for type safety
  starter: process.env.PLAN_STARTER_ID,
  agency: process.env.PLAN_AGENCY_ID,
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const planId = getPlanId(body.planId);

    const razorpayPlanId = RAZORPAY_PLANS[planId];

    if (!planId || !razorpayPlanId) {
      console.warn(`⚠️ Invalid Plan Attempt: ${planId} by User: ${userId}`);
      return NextResponse.json({ error: "Invalid Plan ID" }, { status: 400 });
    }

    console.log(
      `🔹 Creating Subscription | User: ${userId} | Plan: ${planId} | RZP ID: ${razorpayPlanId}`
    );

    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      customer_notify: 1,
      total_count: 12,
      notes: { clerkId: userId },
    });

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    return NextResponse.json({
      subscriptionId: subscription.id,
      key,
      keyId: key,
    });
  } catch (error: any) {
    console.error("🔥 Razorpay Error:", JSON.stringify(error, null, 2));
    const errorMessage =
      error?.error?.description ||
      error?.message ||
      "Subscription creation failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
