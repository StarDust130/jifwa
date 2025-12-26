"use client";

import Script from "next/script"; // Required to load Razorpay
import { useState } from "react";

export default function PricingCard({
  plan,
  userId,
}: {
  plan: any;
  userId: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    console.log("🎬 Initiating payment for:", plan.id);

    try {
      // 1. Get Subscription ID from our API
      const res = await fetch("/api/billing/subscribe", {
        method: "POST",
        body: JSON.stringify({ planId: plan.id }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.details || data.error);

      console.log("📥 Received Subscription ID:", data.subscriptionId);

      // 2. Trigger Razorpay Popup [cite: 144, 198]
      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Jifwa",
        description: `${plan.name} Plan Subscription`,
        image: "/logo.png", // Your logo URL
        handler: async function (response: any) {
          console.log("✅ PAYMENT CAPTURED:", response.razorpay_payment_id);
          // Redirect to success page or refresh to unlock features [cite: 146, 199]
          window.location.href = "/milestones?payment=success";
        },
        prefill: {
          email: "user@example.com", // You can get this from Clerk useUser()
        },
        theme: { color: "#000000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("❌ POPUP FAILED:", err.message);
      alert(`Payment Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button onClick={handlePayment} disabled={isProcessing} className="...">
        {isProcessing ? "Opening Secure Portal..." : `Upgrade to ${plan.name}`}
      </button>
    </>
  );
}
