import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Map your plan names to Razorpay Plan IDs (Created in your Dashboard)
const RAZORPAY_PLANS = {
  starter: "plan_RxulSieibHDHQ0", // Replace with your actual ID
  agency: "plan_RxumAcFJPBXZ7e", // Replace with your actual ID
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { planId } = await req.json();
    const razorpayPlanId =
      RAZORPAY_PLANS[planId as keyof typeof RAZORPAY_PLANS];

    if (!razorpayPlanId) {
      return NextResponse.json({ error: "Invalid Plan ID" }, { status: 400 });
    }

    console.log(
      `🔹 Creating Razorpay Subscription for User: ${userId}, Plan: ${planId}`
    );

    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      customer_notify: 1,
      total_count: 12,
      notes: { clerkId: userId }, // Crucial for Webhook identification
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error: any) {
    console.error("🔥 Subscription API Error:", error.message);
    return NextResponse.json(
      { error: "Razorpay Error", details: error.message },
      { status: 500 }
    );
  }
}
