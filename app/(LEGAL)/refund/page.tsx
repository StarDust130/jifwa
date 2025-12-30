import React from "react";
import { CheckCircle2, XCircle, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - Jifwa Legal",
  description: "Read our 7-day refund policy for verified technical issues.",
};

export default function RefundPage() {
  return (
    <div className="space-y-10 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-100 pb-8 mb-8">
        <h2 className="text-3xl font-extrabold text-[#0B2447] mb-3">
          Refund Policy
        </h2>
        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide rounded-full">
          Last Updated: 25th Dec 2025
        </span>
      </div>

      {/* Main Condition */}
      <div className="bg-[#0B2447] text-white p-8 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Refund Eligibility</h3>
        <p className="opacity-90 leading-relaxed">
          Refunds are issued <strong>only</strong> if you are unable to use the
          platform due to a{" "}
          <span className="text-[#14B8A6] font-bold">
            verified technical issue
          </span>{" "}
          originating from Jifwa's systems that we cannot resolve.
        </p>
      </div>

      {/* Window */}
      <section>
        <h3 className="text-lg font-bold text-[#0B2447] mb-4 uppercase tracking-wider ">
          Refund Window
        </h3>
        <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
          <CheckCircle2 className="text-[#14B8A6] shrink-0 mt-1" size={20} />
          <div>
            <p className="font-bold text-[#0B2447] text-sm">7-Day Guarantee</p>
            <p className="text-xs mt-1">
              Requests must be submitted within 7 days of payment. Processing
              takes 7-10 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Non-Refundable */}
      <section>
        <h3 className="text-lg font-bold text-[#0B2447] mb-4 uppercase tracking-wider ">
          Non-Refundable Cases
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Change of mind",
            "Lack of usage",
            "Business dissatisfaction",
            "User-side internet issues",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg text-sm"
            >
              <XCircle size={16} className="text-slate-400" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* How to */}
      <section className="pt-6 border-t border-slate-100">
        <h3 className="text-xl font-bold text-[#0B2447] mb-3">
          How to Request
        </h3>
        <a
          href="mailto:contact@jifwa.com"
          className="flex items-center gap-3 text-[#14B8A6] font-bold hover:underline"
        >
          <Mail size={18} /> contact@jifwa.com
        </a>
      </section>
    </div>
  );
}
