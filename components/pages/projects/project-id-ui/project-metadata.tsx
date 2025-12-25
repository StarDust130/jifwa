"use client";

import { Sparkles, Users } from "lucide-react";
import { InviteVendorModal } from "@/components/pages/projects/project-id-ui/invite-vendor-modal";

export function ProjectMetadata({
  project,
  isClient,
}: {
  project: any;
  isClient: boolean;
}) {
  const vendorEmail = project.vendorEmail;

  return (
    <div className="space-y-8 sticky top-24">
      {/* Value Card */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
          Total Value
        </span>
        <div className="text-2xl font-bold text-zinc-900 font-mono tracking-tight">
          {project.total_value || "TBD"}
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-100 space-y-3">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Client
            </span>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-zinc-100 rounded flex items-center justify-center text-[10px] font-bold text-zinc-500">
                {project.parties?.[0]?.charAt(0) || "C"}
              </div>
              <span className="text-xs font-semibold text-zinc-900 truncate">
                {project.parties?.[0] || "Client"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={12} className="text-zinc-400" />
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Scope Summary
          </h3>
        </div>
        <div className="text-xs text-zinc-500 leading-relaxed bg-white border border-zinc-200 p-4 rounded-lg shadow-sm">
          {project.summary}
        </div>
      </div>

      {/* Vendor Status */}
      <div>
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
          Active Vendor
        </h3>
        {vendorEmail ? (
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-zinc-200 shadow-sm">
            <div className="w-8 h-8 bg-zinc-900 text-white rounded flex items-center justify-center font-bold text-xs">
              {vendorEmail.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-zinc-900 truncate">
                {vendorEmail}
              </p>
              <p className="text-[10px] text-zinc-400">Has access to portal</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-zinc-50 rounded-lg border border-dashed border-zinc-300">
            <p className="text-xs text-zinc-500 mb-3 font-medium">
              No vendor assigned
            </p>
            {isClient && (
              <div className="flex justify-center [&_button]:h-7 [&_button]:text-[10px] [&_button]:bg-white [&_button]:text-zinc-900 [&_button]:border [&_button]:border-zinc-300 [&_button]:hover:bg-zinc-50 [&_button]:shadow-sm">
                <InviteVendorModal projectId={project._id.toString()} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
