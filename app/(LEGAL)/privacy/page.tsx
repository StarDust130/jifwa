import React from "react";
import { Lock, Shield, EyeOff } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="space-y-12 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-100 pb-8 mb-8">
        <h2 className="text-3xl font-extrabold text-[#0B2447] mb-3">
          Privacy Policy
        </h2>
        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide rounded-full">
          Last Updated: 25th Dec 2025
        </span>
      </div>

      <div className="prose prose-slate max-w-none prose-headings:text-[#0B2447] prose-a:text-[#14B8A6]">
        <p className="text-lg font-medium text-slate-800">
          Jifwa ("we", "our", "us") is committed to protecting your privacy.
          This policy explains how we handle your data when you use the Jifwa
          platform, operated by <strong>Conseccomms Private Limited</strong>.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4">
          1. Information We Collect
        </h3>
        <ul className="grid gap-3 list-none pl-0">
          {[
            "Account info: Name and email address.",
            "Uploaded contract documents & execution data.",
            "Usage metadata: Timestamps, actions, and device info.",
            "Payment info: Processed securely via Razorpay.",
          ].map((item, i) => (
            <li
              key={i}
              className="flex gap-3 items-start text-sm bg-slate-50 p-3 rounded-lg border border-slate-100"
            >
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#14B8A6] shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-bold mt-10 mb-4">
          2. Data Encryption & Security
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-slate-200 hover:border-[#14B8A6]/50 transition-colors">
            <Lock className="text-[#14B8A6] mb-3" size={24} />
            <h4 className="font-bold text-[#0B2447] mb-1">
              AES-256 Encryption
            </h4>
            <p className="text-sm text-slate-500">
              All stored contracts and files are encrypted at rest.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 hover:border-[#14B8A6]/50 transition-colors">
            <Shield className="text-[#14B8A6] mb-3" size={24} />
            <h4 className="font-bold text-[#0B2447] mb-1">
              TLS 1.3 Transmission
            </h4>
            <p className="text-sm text-slate-500">
              Data is encrypted while moving between devices.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold mt-10 mb-4">3. AI Usage & Privacy</h3>
        <div className="bg-[#0B2447] text-white p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="mb-4 font-medium">
              We do not share your data with external AI providers.
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-3 items-center">
                <EyeOff size={16} className="text-[#14B8A6]" /> No contract data
                sent to OpenAI/Claude.
              </li>
              <li className="flex gap-3 items-center">
                <EyeOff size={16} className="text-[#14B8A6]" /> We do not sell
                or trade user data.
              </li>
            </ul>
          </div>
          {/* Decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#14B8A6]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
