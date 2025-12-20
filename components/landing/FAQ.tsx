"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  MessageCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

const faqs = [
  {
    question: "How accurate is the AI extraction?",
    answer:
      "Jifwa uses a specialized LLM fine-tuned on 50,000+ legal contracts. We currently maintain a 99.8% accuracy rate for standard deliverables, dates, and payment terms. For low-confidence extractions, the system flags the item for human review before syncing.",
  },
  {
    question: "Is my contract data secure?",
    answer:
      "Absolutely. We are SOC2 Type II compliant. Your data is encrypted at rest (AES-256) and in transit (TLS 1.3). We do not use your contracts to train our public models without explicit enterprise opt-in.",
  },
  {
    question: "Does it work with scanned PDFs?",
    answer:
      "Yes. Jifwa includes an enterprise-grade OCR layer that digitizes scanned documents and images before processing them, allowing us to extract data even from non-selectable text.",
  },
  {
    question: "What integrations are supported?",
    answer:
      "Out of the box, we support 2-way sync with Jira, Linear, Asana, Monday.com, and Slack. We also have a Zapier integration and a robust REST API for custom internal tools.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer:
      "We don't pause your service. You'll simply be billed a small overage fee per extra document extracted, or prompted to upgrade to the next tier for better volume pricing.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative w-full py-24 bg-white text-gray-900 overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-50/40 rounded-full blur-[120px] -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-blue-100"
          >
            <HelpCircle size={12} />
            Common Queries
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Everything you need <br />
            <span className="text-gray-400">to know.</span>
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
                  ? "bg-white border-gray-200 shadow-xl shadow-blue-900/5 ring-1 ring-blue-500/10"
                  : "bg-gray-50/50 border-transparent hover:bg-gray-100"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span
                  className={`text-lg font-bold ${
                    openIndex === i ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`p-2 rounded-full transition-colors ${
                    openIndex === i
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
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
                    <div className="px-6 pb-6 text-gray-500 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA CARD (Titanium Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gray-900 rounded-[2rem] p-8 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl"
        >
          {/* Glow Effect */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-400 text-sm max-w-sm">
              Can't find the answer you're looking for? Chat with our team.
            </p>
          </div>

          <button className="relative z-10 h-12 px-6 rounded-xl bg-white text-gray-900 font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors shrink-0">
            <MessageCircle size={18} />
            Chat with Support
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
