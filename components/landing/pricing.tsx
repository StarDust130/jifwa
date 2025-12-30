"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Check,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building2,
  Crown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// --- BRAND COLORS ---
// Navy: #0B2447
// Teal: #14B8A6

const PricingSection = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handlePlanSelect = (planName: string) => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    const planKey = planName.toLowerCase();
    router.push(`/billing?plan=${planKey}`);
  };

  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Best for product testing and evaluation",
      features: [
        "1 Active Project",
        "Basic AI parsing",
        "Core execution workflow",
      ],
      cta: "Start Free",
      highlight: false,
    },
    {
      name: "Starter",
      price: "499",
      description: "Best for freelancers & individual professionals",
      features: [
        "Up to 5 Active Projects",
        "Custom branding (your logo)",
        "Priority email support",
      ],
      cta: "Get Started",
      highlight: true,
      tag: "Most Popular",
    },
    {
      name: "Agency",
      price: "1,499",
      description: "Built for agencies managing multiple clients",
      features: [
        "Unlimited projects",
        "Team access (up to 3 members)",
        "Optimized for service delivery teams",
      ],
      cta: "Get Started",
      highlight: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="relative w-full py-24 bg-white text-[#0B2447] overflow-hidden font-sans"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-teal-50/30 blur-[120px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 text-[#14B8A6] text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm"
          >
            <Sparkles size={12} />
            Simple Pricing
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B2447] mb-6 leading-tight">
            Simple, Transparent Pricing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B2447] to-teal-600">
              Upgrade as You Grow.
            </span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Clear execution shouldn't be complicated.
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.highlight
                  ? "bg-[#0B2447] text-white shadow-2xl shadow-blue-900/20 border border-[#1e3a5f] scale-105 z-10"
                  : "bg-white text-[#0B2447] border border-slate-200 shadow-lg hover:shadow-xl hover:border-teal-100 z-0"
              }`}
            >
              {plan.tag && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#14B8A6] to-teal-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase flex items-center gap-1.5">
                  <Zap size={10} className="fill-white" /> {plan.tag}
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p
                      className={`text-sm mt-2 leading-relaxed font-medium ${
                        plan.highlight ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>
                  {plan.highlight ? (
                    <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                      <Crown
                        className="text-[#14B8A6] fill-[#14B8A6]"
                        size={20}
                      />
                    </div>
                  ) : (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <ShieldCheck className="text-slate-400" size={20} />
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ₹{plan.price}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      plan.highlight ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    / month
                  </span>
                </div>

                <div className="w-full h-px bg-current opacity-10 mb-8"></div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feat, k) => (
                    <div
                      key={k}
                      className="flex items-start gap-3 text-sm font-semibold"
                    >
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.highlight
                            ? "bg-[#14B8A6] text-[#0B2447]"
                            : "bg-teal-50 text-[#14B8A6]"
                        }`}
                      >
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span
                        className={
                          plan.highlight ? "text-slate-100" : "text-slate-700"
                        }
                      >
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handlePlanSelect(plan.name)}
                className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg active:scale-95 ${
                  plan.highlight
                    ? "bg-white text-[#0B2447] hover:bg-slate-100 hover:shadow-white/20"
                    : "bg-[#0B2447] text-white hover:bg-[#15345A] hover:shadow-blue-900/20"
                }`}
              >
                {plan.cta}
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* ENTERPRISE SECTION (Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] bg-[#0B2447] text-white p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl shadow-blue-900/10 overflow-hidden"
        >
          {/* Decor */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#14B8A6]/10 rounded-full blur-[80px] -z-0 translate-x-1/3 -translate-y-1/3"></div>

          <div className="relative z-10 flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                <Building2 size={24} className="text-[#14B8A6]" />
              </div>
              <h3 className="text-3xl font-bold">Enterprise</h3>
            </div>
            <p className="text-slate-300 text-lg mb-6 max-w-xl font-medium">
              Custom pricing for large organizations & government contractors.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-sm font-semibold text-white/90">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="text-[#14B8A6]" /> Private AI Mode (Zero
                Data Retention)
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="text-[#14B8A6]" /> Single Sign-On (SSO)
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="text-[#14B8A6]" /> Dedicated Support
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() => router.push("mailto:contact@jifwa.com")}
              className="h-14 px-10 bg-white text-[#0B2447] font-bold rounded-xl hover:bg-slate-50 transition-all shadow-lg hover:shadow-white/10 flex items-center gap-2"
            >
              Contact Sales
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>

        
      </div>
    </section>
  );
};

// Helper for Enterprise checks
const CheckCircle = ({ className }: { className?: string }) => (
  <div
    className={`w-5 h-5 rounded-full flex items-center justify-center bg-white/10 ${className}`}
  >
    <Check size={12} strokeWidth={4} className="text-[#14B8A6]" />
  </div>
);

export default PricingSection;
