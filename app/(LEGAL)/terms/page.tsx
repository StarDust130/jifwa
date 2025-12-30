import React from "react";
import { CheckCircle2, AlertTriangle, Scale } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use - Jifwa Legal",
  description: "Read the terms of use for Jifwa's platform.",
};

export default function TermsPage() {
  return (
    <div className="space-y-12 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-100 pb-8 mb-8">
        <h2 className="text-3xl font-extrabold text-[#0B2447] mb-3">
          Terms of Use
        </h2>
        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide rounded-full">
          Last Updated: 25th Dec 2025
        </span>
      </div>

      <p className="text-lg font-medium text-slate-800">
        Jifwa is an execution clarity platform. We do not provide legal advice,
        contract drafting services, or legal validation.
      </p>

      <div className="space-y-8 mt-8">
        {/* Responsibility */}
        <div className="bg-white">
          <h3 className="text-xl font-bold text-[#0B2447] mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-[#14B8A6]" size={20} /> User
            Responsibilities
          </h3>
          <ul className="pl-9 space-y-3 text-sm marker:text-[#14B8A6] list-disc">
            <li>
              You are responsible for the accuracy and legality of uploaded
              content.
            </li>
            <li>
              You must maintain the confidentiality of your account credentials.
            </li>
            <li>You must have the rights to the documents you upload.</li>
          </ul>
        </div>

        {/* AUP */}
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 text-rose-900">
          <h3 className="font-bold mb-3 flex items-center gap-2 text-lg">
            <AlertTriangle size={20} className="text-rose-500" /> Acceptable Use
            Policy
          </h3>
          <p className="text-sm mb-3 font-medium">Users must NOT:</p>
          <ul className="space-y-2 text-sm pl-5 list-disc marker:text-rose-400">
            <li>Upload illegal, harmful, or unauthorized content.</li>
            <li>Attempt to breach platform security or abuse AI resources.</li>
            <li>Use the platform for unlawful activities.</li>
          </ul>
        </div>

        {/* Law */}
        <div>
          <h3 className="text-xl font-bold text-[#0B2447] mb-4 flex items-center gap-2">
            <Scale className="text-[#14B8A6]" size={20} /> Governing Law
          </h3>
          <p className="text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
            These terms are governed by the laws of <strong>India</strong>.
            Jurisdiction shall lie in <strong>Maharashtra, India</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
