import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { PlanId } from "@/lib/plans";

const { RAZORPAY_WEBHOOK_SECRET, PLAN_STARTER_ID, PLAN_AGENCY_ID } =
  process.env;

if (!RAZORPAY_WEBHOOK_SECRET) {
  throw new Error("CRITICAL: Missing Razorpay webhook secret");
}

const webhookSecret: string = RAZORPAY_WEBHOOK_SECRET;

const planMapping: Record<string, PlanId> = {};
if (PLAN_STARTER_ID) planMapping[PLAN_STARTER_ID] = "starter";
if (PLAN_AGENCY_ID) planMapping[PLAN_AGENCY_ID] = "agency";

const upsertUserPlan = (clerkId: string, plan: PlanId) => {
  const placeholderEmail = `${clerkId}@placeholder.local`;
  return User.findOneAndUpdate(
    { clerkId },
    {
      $set: { plan },
      $setOnInsert: {
        email: placeholderEmail,
        name: placeholderEmail,
        currentRole: "client",
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  // 1. Verify Webhook Signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(body);

  // 2. Handle Subscription Success [cite: 144, 145]
  const eventType: string = payload.event;
  const subscriptionEntity = payload.payload?.subscription?.entity;

  const clerkId = subscriptionEntity?.notes?.clerkId;
  const razorpayPlanId: string | undefined = subscriptionEntity?.plan_id;

  const resolvePlan = (planId?: string): PlanId =>
    planMapping[planId || ""] || "free";

  if (!clerkId) {
    return NextResponse.json(
      { error: "Missing clerkId in webhook" },
      { status: 400 }
    );
  }

  const shouldUpgrade = [
    "subscription.activated",
    "subscription.charged",
    "subscription.pending",
  ].includes(eventType);

  const shouldDowngrade = [
    "subscription.cancelled",
    "subscription.paused",
    "subscription.expired",
  ].includes(eventType);

  await connectDB();

  if (shouldUpgrade) {
    const newPlan = resolvePlan(razorpayPlanId);
    await upsertUserPlan(clerkId, newPlan);
    console.log(`✅ [Webhook] User ${clerkId} set to plan ${newPlan}`);
  }

  if (shouldDowngrade) {
    await upsertUserPlan(clerkId, "free");
    console.log(
      `⚠️ [Webhook] User ${clerkId} downgraded to free (${eventType})`
    );
  }

  return NextResponse.json({ success: true });
}
