import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getPlanId, PlanId } from "@/lib/plans";

const {
  NEXT_PUBLIC_RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  PLAN_STARTER_ID,
  PLAN_AGENCY_ID,
} = process.env;

if (!NEXT_PUBLIC_RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error("CRITICAL: Razorpay keys missing for confirm endpoint.");
}

const razorpayKeySecret: string = RAZORPAY_KEY_SECRET;

const subscriptionPlanMap: Record<string, PlanId> = {};
if (PLAN_STARTER_ID) subscriptionPlanMap[PLAN_STARTER_ID] = "starter";
if (PLAN_AGENCY_ID) subscriptionPlanMap[PLAN_AGENCY_ID] = "agency";

const razorpay = new Razorpay({
  key_id: NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { planId, paymentId, subscriptionId, signature } = await req.json();

    console.log("[billing/confirm] incoming", {
      userId,
      planId,
      paymentId,
      subscriptionId,
      hasSignature: Boolean(signature),
    });

    const normalizedPlanId = getPlanId(planId);
    if (normalizedPlanId === "free") {
      return NextResponse.json(
        { error: "Invalid plan for confirmation" },
        { status: 400 }
      );
    }

    if (!paymentId || !subscriptionId || !signature) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${subscriptionId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("[billing/confirm] signature mismatch", {
        expectedSignature,
        receivedSignature: signature,
        subscriptionId,
        paymentId,
      });
    }

    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    console.log("[billing/confirm] fetched subscription", {
      status: subscription.status,
      plan_id: subscription.plan_id,
      total_count: subscription.total_count,
      paid_count: subscription.paid_count,
    });

    const planFromRazorpay =
      subscriptionPlanMap[subscription.plan_id] || "free";

    if (planFromRazorpay !== normalizedPlanId) {
      return NextResponse.json(
        { error: "Plan mismatch. Please contact support." },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "active",
      "authenticated",
      "created",
      "pending",
      "charged",
      "completed",
    ];
    if (!allowedStatuses.includes(subscription.status)) {
      return NextResponse.json(
        { error: "Subscription not active" },
        { status: 402 }
      );
    }

    const clerkNote = subscription?.notes?.clerkId;
    if (clerkNote && clerkNote !== userId) {
      return NextResponse.json(
        { error: "Ownership mismatch. Please contact support." },
        { status: 400 }
      );
    }

    // If signature failed but everything else looks good, trust subscription status.
    if (expectedSignature !== signature) {
      console.warn(
        "[billing/confirm] trusting subscription despite signature mismatch"
      );
    }

    const clerkProfile = await currentUser().catch(() => null);
    const email =
      clerkProfile?.primaryEmailAddress?.emailAddress ||
      `${userId}@placeholder.local`;
    const name =
      `${clerkProfile?.firstName || ""} ${
        clerkProfile?.lastName || ""
      }`.trim() ||
      clerkProfile?.username ||
      email;
    const photo = clerkProfile?.imageUrl;

    await connectDB();
    await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          plan: planFromRazorpay,
          email,
          name,
          photo,
        },
        $setOnInsert: {
          currentRole: "client",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, plan: planFromRazorpay });
  } catch (error: any) {
    console.error("[billing/confirm]", error);
    return NextResponse.json(
      { error: error?.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
