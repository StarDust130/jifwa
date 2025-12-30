"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, Mail } from "lucide-react";
import Link from "next/link";

// --- BRAND COLORS ---
// Navy: #0B2447
// Teal: #14B8A6

// --- GENUINE FAQS (Prioritized by User Anxiety) ---
const faqs = [
  {
    // PRIORITY 1: Positioning (Clearing confusion immediately) [Source: PDF Page 1 & 10]
    question: "Is Jifwa a contract drafting tool?",
    answer:
      "No. Jifwa is for execution, not drafting. We are not a project management tool or a document repository. We simply ensure that what you signed in your contract actually gets delivered on time.",
  },
  {
    // PRIORITY 2: AI Privacy (The biggest trust hurdle) [Source: PDF Page 14 & 19]
    question: "Do you use OpenAI, Claude, or public AI?",
    answer:
      "No. We do not use external AI APIs. Jifwa runs its own private AI models inside our secure cloud. Your contracts are never shared with third parties or used to train public models.",
  },
  {
    // PRIORITY 3: Data Security (The dealbreaker) [Source: PDF Page 11 & 20]
    question: "Is my contract data safe?",
    answer:
      "Yes. We use a 'Zero-Trust' system. Your data is encrypted with bank-grade keys (AES-256). Even our own team cannot read your uploaded contracts—we can only see basic usage logs.",
  },
  {
    // PRIORITY 4: Vendor Friction (Practical usage) [Source: PDF Page 7]
    question: "Do vendors need to pay?",
    answer:
      "No. Vendors join for free via an email invite link. They get a simple dashboard to upload proofs and view their specific milestones. They do not see your other projects.",
  },
  {
    // PRIORITY 5: Financial Risk (The 'Safety Net') [Source: PDF Page 18]
    question: "What if I'm not happy? (Refund Policy)",
    answer:
      "We offer a 7-day refund policy if you face a verified technical issue that we cannot fix. Since we have a Free Plan for testing, refunds are not issued for simple 'change of mind'.",
  },
  {
    // PRIORITY 6: Growth (Future proofing) [Source: PDF Page 14]
    question: "Can I upgrade or cancel anytime?",
    answer:
      "Yes. You can switch plans instantly from your dashboard. Upgrades unlock features immediately. There are no lock-in contracts for monthly plans.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative w-full py-24 bg-white text-[#0B2447] overflow-hidden font-sans border-t border-slate-100"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-teal-50/40 rounded-full blur-[120px] -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 text-[#14B8A6] text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-slate-200"
          >
            <HelpCircle size={12} />
            Common Queries
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B2447] mb-6">
            Everything You <br />
            <span className="text-slate-400">Need to Know.</span>
          </h2>
        </div>

        {/* ACCORDION LIST */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl transition-all duration-300 border ${
                openIndex === i
                  ? "bg-white border-slate-200 shadow-xl shadow-blue-900/5 ring-1 ring-teal-500/20"
                  : "bg-slate-50/50 border-transparent hover:bg-slate-100"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span
                  className={`text-base md:text-lg font-bold ${
                    openIndex === i ? "text-[#0B2447]" : "text-slate-600"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`p-2 rounded-full transition-colors ${
                    openIndex === i
                      ? "bg-[#0B2447] text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-500 leading-relaxed text-sm font-medium border-t border-slate-100/50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA CARD (Navy Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-[#0B2447] rounded-[2rem] p-8 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl"
        >
          {/* Glow Effect */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#14B8A6]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-slate-300 text-sm max-w-sm">
              Can&apos;t find the answer you&apos;re looking for? Email our
              support team directly.
            </p>
          </div>

          <Link
            href="mailto:contact@jifwa.com"
            className="relative z-10 h-12 px-6 rounded-xl bg-white text-[#0B2447] font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition-colors shrink-0 shadow-lg"
          >
            <Mail size={18} className="text-[#14B8A6]" />
            Contact Support
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
