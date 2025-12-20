"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

const PricingSection = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Starter",
      price: billing === "monthly" ? "0" : "0",
      description: "Perfect for testing the extraction engine.",
      features: [
        "3 PDF uploads per month",
        "Basic AI Extraction",
        "Manual Sync",
        "Community Support",
      ],
      missing: ["API Access", "Team Seats", "SOC2 Report"],
      cta: "Start Free",
      style: "basic",
    },
    {
      name: "Growth",
      price: billing === "monthly" ? "49" : "39",
      description: "For startups automating legal ops.",
      features: [
        "50 PDF uploads per month",
        "Advanced AI (Tables & Penalties)",
        "Real-time Linear/Jira Sync",
        "Priority Email Support",
        "3 Team Seats",
      ],
      missing: ["SSO", "Custom MSA"],
      cta: "Get Started",
      style: "titanium", // Special Dark Mode Style
      tag: "Most Popular",
    },
    {
      name: "Scale",
      price: billing === "monthly" ? "199" : "159",
      description: "Compliance & security for teams.",
      features: [
        "Unlimited Uploads",
        "API Access (Webhooks)",
        "SSO / SAML",
        "Dedicated Account Manager",
        "SOC2 Type II Report",
        "Custom Contracts",
      ],
      missing: [],
      cta: "Contact Sales",
      style: "basic",
    },
  ];

  return (
    <section id="pricing" className="relative w-full py-24 bg-white text-gray-900 overflow-hidden font-sans">
      {/* Background Decor (Matching Hero) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-50/40 to-yellow-50/40 blur-[100px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-yellow-100"
          >
            <Sparkles size={12} />
            Simple Pricing
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Pay for valid <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900">
              extractions only.
            </span>
          </h2>

          {/* TOGGLE */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <span
              className={`text-sm font-bold ${
                billing === "monthly" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBilling(billing === "monthly" ? "yearly" : "monthly")
              }
              className="w-14 h-8 bg-gray-200 rounded-full p-1 relative transition-colors duration-300 focus:outline-none"
            >
              <motion.div
                layout
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: billing === "yearly" ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={`text-sm font-bold flex items-center gap-2 ${
                billing === "yearly" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Yearly
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* PRICING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-[2rem] p-8 flex flex-col justify-between ${
                plan.style === "titanium"
                  ? "bg-gray-900 text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-gray-700 ring-1 ring-white/10"
                  : "bg-white text-gray-900 border border-gray-200 shadow-sm hover:shadow-xl"
              }`}
            >
              {/* Popular Tag */}
              {plan.tag && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                  {plan.tag}
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p
                      className={`text-sm mt-1 ${
                        plan.style === "titanium"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>
                  {plan.style === "titanium" && (
                    <Zap
                      className="text-yellow-400 fill-yellow-400"
                      size={20}
                    />
                  )}
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold tracking-tight">
                    ${plan.price}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      plan.style === "titanium"
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    /mo
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feat, k) => (
                    <div
                      key={k}
                      className="flex items-start gap-3 text-sm font-medium"
                    >
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          plan.style === "titanium"
                            ? "bg-gray-800 text-green-400"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span
                        className={
                          plan.style === "titanium"
                            ? "text-gray-200"
                            : "text-gray-700"
                        }
                      >
                        {feat}
                      </span>
                    </div>
                  ))}
                  {plan.missing.map((feat, k) => (
                    <div
                      key={k}
                      className="flex items-start gap-3 text-sm font-medium opacity-50"
                    >
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          plan.style === "titanium"
                            ? "bg-gray-800 text-gray-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <X size={10} strokeWidth={3} />
                      </div>
                      <span
                        className={
                          plan.style === "titanium"
                            ? "text-gray-500"
                            : "text-gray-500"
                        }
                      >
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  plan.style === "titanium"
                    ? "bg-white text-gray-900 hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    : "bg-gray-900 text-white hover:bg-black hover:shadow-lg"
                }`}
              >
                {plan.cta}
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-green-600" />
            All plans include 14-day money back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
