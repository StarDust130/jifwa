"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

// --- UPDATED FAQs ---
const faqs = [
  {
    question: "Is Jifwa a contract drafting or CLM tool?",
    answer:
      "No. Jifwa is an execution alignment layer that sits on top of your contracts. We are not a project management tool or a legal document repository. Our focus is solely on ensuring that what is agreed upon in a signed PDF actually gets delivered.",
  },
  {
    question: "Do you use OpenAI, Claude, or third-party AI?",
    answer:
      "No. We do not use external AI APIs. All AI runs privately inside Jifwa's own secure infrastructure. We do not train models on your data, and your contracts are never shared with third-party providers.",
  },
  {
    question: "Is my contract data safe?",
    answer:
      "Yes. We use a zero-trust architecture. Data is encrypted at rest using AES-256 and in transit via TLS 1.3. Even Jifwa's internal staff cannot view your contract content or uploaded documents.",
  },
  {
    question: "How do vendors submit their work?",
    answer:
      "Clients invite vendors via email. Vendors get access to a restricted dashboard where they can upload files, notes, and proofs directly tied to specific milestones. They only see the milestones assigned to them.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "Refunds are applicable only if you are unable to use the platform due to a verified technical issue originating from our systems. Requests must be submitted within 7 days of payment.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes. Plans can be upgraded anytime from your profile settings. Features are unlocked instantly upon successful payment via Razorpay.",
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
                    <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm">
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
              Can&apos;t find the answer you&apos;re looking for? Chat with our team.
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