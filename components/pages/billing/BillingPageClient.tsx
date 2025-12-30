"use client";

import { useState } from "react";
import Script from "next/script";
import {
  Check,
  ShieldCheck,
  Zap,
  Loader2,
  Sparkles,
  Building2,
  Lock,
  TrendingUp,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Types ---
type PlanId = "free" | "starter" | "agency";

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  desc: string;
  features: string[];
  limit: string;
  popular: boolean;
  icon: React.ReactNode;
}

export default function BillingPageClient() {
  const { user } = useUser();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Determine current plan from Clerk metadata (default to free)
  const currentPlan = (user?.publicMetadata?.plan as PlanId) || "free";

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      desc: "For testing only",
      limit: "1 active project",
      features: ["Basic AI parsing"],
      popular: false,
      icon: <Zap size={18} />,
    },
    {
      id: "starter",
      name: "Starter",
      price: "₹499",
      desc: "Best for freelancers",
      limit: "Up to 5 active projects",
      features: [
        "AI milestones",
        "Dispute summaries",
        "Priority email support",
      ],
      popular: true,
      icon: <Sparkles size={18} />,
    },
    {
      id: "agency",
      name: "Agency",
      price: "₹1,499",
      desc: "Best for agencies",
      limit: "Unlimited projects",
      features: ["Team access (3 seats)", "Advanced AI summaries"],
      popular: false,
      icon: <Building2 size={18} />,
    },
  ];

  // --- 2. PAYMENT HANDLER ---
  const handleUpgrade = async (planId: "starter" | "agency") => {
    if (!user) return toast.error("Please log in to upgrade.");
    setLoadingPlan(planId);

    try {
      // 1. Create Subscription
      const res = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to start subscription");

      // 2. Open Razorpay
      const options = {
        key: data.key,
        subscription_id: data.subscriptionId,
        name: "Jifwa",
        description: `Upgrade to ${
          planId.charAt(0).toUpperCase() + planId.slice(1)
        } Plan`,
        handler: async function (response: any) {
          toast.success("Payment Successful! Upgrading account...");

          // Verify Payment
          await fetch("/api/billing/webhook", {
            method: "POST",
            body: JSON.stringify(response),
          });

          window.location.reload();
        },
        theme: { color: "#10B981" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  const benefits = [
    {
      title: "Private AI",
      desc: "Contract data never leaves our secure environment.",
      icon: <Lock className="text-emerald-500" size={16} />,
    },
    {
      title: "Clear Execution",
      desc: "Convert static PDFs into trackable milestones.",
      icon: <TrendingUp className="text-amber-500" size={16} />,
    },
    {
      title: "Dispute Evidence",
      desc: "AI automatically compiles timelines for disputes.",
      icon: <ShieldCheck className="text-blue-500" size={16} />,
    },
    {
      title: "Team Access",
      desc: "Invite vendors and manage permissions easily.",
      icon: <Building2 className="text-purple-500" size={16} />,
    },
  ];

  const faqs = [
    {
      q: "Is my data safe?",
      a: "Yes. Everything is end-to-end encrypted. Contract data never leaves Jifwa's secure environment.",
    },
    {
      q: "Do you use OpenAI, Claude, or third-party AI?",
      a: "No. All AI runs privately inside Jifwa. We do not use external AI APIs.",
    },
    {
      q: "Can I upgrade plans later?",
      a: "Yes. Plans can be upgraded anytime.",
    },
    {
      q: "Is pricing final?",
      a: "Yes. Public pricing is transparent. Enterprise pricing is customized.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-primary font-sans pb-20">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        {/* --- 1. COMPACT HEADER --- */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-[10px] font-bold uppercase tracking-widest ">
            <ShieldCheck size={12} className="text-emerald-600" /> Secure
            Encrypted Checkout
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">
            Upgrade Your Execution Engine
          </h1>
          <p className="text-zinc-500 text-sm font-medium max-w-md mx-auto">
            Simple, transparent pricing. Upgrade as you grow.
          </p>
        </div>

        {/* --- 2. PRICING CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch mb-16">
          {plans.map((plan) => {
            const isActive = currentPlan === plan.id;
            const isDark = plan.popular;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                className={cn(
                  "relative p-6 rounded-3xl flex flex-col justify-between border transition-all duration-300",
                  isDark
                    ? "bg-primary text-white border-zinc-900 shadow-xl shadow-zinc-900/20 z-10 scale-[1.02]"
                    : "bg-white text-primary border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
                )}
              >
                {plan.popular && (
                  <div className="absolute  right-3">
                    <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-black text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-sm flex items-center  gap-1">
                      <Sparkles size={10} /> Recommended
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={cn(
                        "p-2.5 rounded-xl",
                        isDark
                          ? "bg-zinc-800 text-white"
                          : "bg-zinc-50 border border-zinc-100 text-zinc-400"
                      )}
                    >
                      {plan.icon}
                    </div>
                    {isActive && (
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md uppercase">
                        Active
                      </span>
                    )}
                  </div>

                  <h3
                    className={cn(
                      "text-xs font-black uppercase tracking-widest mb-1",
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    )}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-0.5 mb-2">
                    <span className="text-4xl font-black tracking-tighter">
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase",
                          isDark ? "text-zinc-500" : "text-zinc-400"
                        )}
                      >
                        /mo
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-[10px] font-medium leading-relaxed mb-6 pb-6 border-b",
                      isDark
                        ? "text-zinc-400 border-zinc-800"
                        : "text-zinc-500 border-zinc-100"
                    )}
                  >
                    {plan.desc}
                  </p>

                  <div className="space-y-2.5 mb-6">
                    {/* LIMIT ITEM (Green Tick) */}
                    <li className="flex items-center gap-2 text-[11px] font-bold list-none">
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center",
                          isDark ? "bg-zinc-800" : "bg-emerald-50"
                        )}
                      >
                        <Check
                          size={10}
                          className={
                            isDark ? "text-emerald-400" : "text-emerald-600"
                          }
                          strokeWidth={3}
                        />
                      </div>
                      {plan.limit}
                    </li>

                    {/* FEATURES (Green Tick) */}
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-[11px] font-medium list-none"
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full flex items-center justify-center",
                            isDark ? "bg-zinc-800" : "bg-emerald-50"
                          )}
                        >
                          <Check
                            size={10}
                            // Forced GREEN on all features for SaaS look
                            className={
                              isDark ? "text-emerald-400" : "text-emerald-600"
                            }
                            strokeWidth={3}
                          />
                        </div>
                        <span
                          className={isDark ? "text-zinc-300" : "text-zinc-600"}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </div>
                </div>

                <button
                  disabled={isActive || loadingPlan !== null}
                  onClick={() =>
                    plan.id !== "free" &&
                    handleUpgrade(plan.id as "starter" | "agency")
                  }
                  className={cn(
                    "w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2",
                    isDark
                      ? "bg-white text-black hover:bg-zinc-200"
                      : isActive
                      ? "bg-zinc-100 text-zinc-400 cursor-default"
                      : "bg-primary text-white hover:bg-black shadow-lg shadow-zinc-900/10"
                  )}
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isActive ? (
                    "Current Plan"
                  ) : plan.id === "free" ? (
                    "Your Current Plan"
                  ) : (
                    "Upgrade"
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* --- 3. BENEFITS (Compact Grid) --- */}
        <div className="mb-16 border-t border-zinc-100 pt-12">
          <h2 className="text-lg font-black uppercase italic tracking-tighter text-center mb-8">
            Why Professionals Choose Jifwa
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                key={i}
                className="bg-white border border-zinc-100 p-4 rounded-2xl hover:border-zinc-300 transition-colors"
              >
                <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center mb-3">
                  {b.icon}
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-1">
                  {b.title}
                </h3>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- 4. FAQ (Clean Accordion) --- */}
        <div className="max-w-2xl mx-auto mb-20">
          <h2 className="text-lg font-black uppercase italic tracking-tighter text-center mb-6">
            Common Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-zinc-200 rounded-xl overflow-hidden bg-white hover:border-zinc-300 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-xs font-bold text-primary">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <Minus size={14} className="text-zinc-400" />
                  ) : (
                    <Plus size={14} className="text-zinc-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-xs text-zinc-500 font-medium leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* --- 5. ENTERPRISE CTA (FIXED LAYOUT) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary text-white rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
        >
          {/* Content Wrapper */}
          <div className="relative z-10 w-full md:w-2/3 text-center md:text-left space-y-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2 text-white">
                Need Enterprise Scale?
              </h2>
              <p className="text-zinc-300 text-sm font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                Custom pricing for large organizations & government contractors.
                [cite_start]Includes Private AI mode, SSO, and Dedicated
                Support. [cite: 314-317]
              </p>
            </div>

            {/* Feature Pills - Improved Layout */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {[
                "Private AI Mode",
                "Single Sign-On (SSO)",
                "Dedicated Support",
              ].map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-white transition-colors hover:bg-white/10 cursor-default"
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check
                      size={10}
                      className="text-emerald-400"
                      strokeWidth={3}
                    />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Button - Centered Vertical Alignment */}
          <div className="relative z-10 flex-shrink-0">
            <Link
              href="mailto:contact@jifwa.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-xl font-black text-xs uppercase tracking-[0.15em] hover:bg-zinc-100 hover:scale-105 transition-all shadow-xl shadow-black/20"
            >
              Contact Sales
            </Link>
          </div>

          {/* Background Glow Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-700 rounded-full blur-[100px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900 rounded-full blur-[80px] opacity-20 -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}
