import React from "react";
import { Cpu, Server, ShieldCheck, Lock, EyeOff } from "lucide-react";

export default function AISecurityPage() {
  return (
    <div className="space-y-12 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-100 pb-8 mb-8">
        <h2 className="text-3xl font-extrabold text-[#0B2447] mb-3">
          AI Usage & Security
        </h2>
        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide rounded-full">
          Last Updated: 25th Dec 2025
        </span>
      </div>

      {/* AI Section */}
      <section>
        <h3 className="text-2xl font-bold text-[#0B2447] mb-6 flex items-center gap-3">
          <Cpu className="text-[#14B8A6]" /> AI Transparency
        </h3>
        <div className="bg-[#0B2447] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid gap-6">
            <div>
              <h4 className="font-bold text-lg mb-2">No Third-Party APIs</h4>
              <p className="text-sm text-slate-300">
                We do not send your data to OpenAI, Claude, or external
                services. We run private models.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Zero Training</h4>
              <p className="text-sm text-slate-300">
                We do not train our AI models on your specific contract data.
              </p>
            </div>
          </div>
          {/* BG Decor */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#14B8A6]/20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Security Grid */}
      <section>
        <h3 className="text-2xl font-bold text-[#0B2447] mb-6 flex items-center gap-3">
          <ShieldCheck className="text-[#14B8A6]" /> Security Stack
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SecurityCard
            icon={Server}
            title="TLS 1.3"
            desc="All data in transit is encrypted using the latest transport layer security."
          />
          <SecurityCard
            icon={Lock}
            title="AES-256"
            desc="Data at rest is locked with bank-grade encryption keys."
          />
          <SecurityCard
            icon={ShieldCheck}
            title="RBAC"
            desc="Strict Role-Based Access Control ensures data isolation."
          />
          <SecurityCard
            icon={EyeOff}
            title="Metadata Only"
            desc="Our admins can only see usage logs, never your contract content."
          />
        </div>
      </section>
    </div>
  );
}

function SecurityCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-6 border border-slate-200 rounded-2xl hover:border-[#14B8A6] hover:shadow-lg transition-all duration-300 group">
      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#14B8A6]/10 transition-colors">
        <Icon
          size={20}
          className="text-slate-400 group-hover:text-[#14B8A6] transition-colors"
        />
      </div>
      <h4 className="font-bold text-[#0B2447] mb-2">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
