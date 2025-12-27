import React from "react";
import Link from "next/link";

import { Plus, Briefcase, FileCheck, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDashboardProjects } from "@/app/actions/projects";

export default async function Dashboard() {
  const data = await getDashboardProjects();

  // 1. FIX: Instead of showing an error, default to empty values.
  // This ensures new users see the "Empty State" placeholder instead of a crash.
  const role = data?.role || "client";
  const projects = data?.projects || [];

  const isClient = role === "client";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">
            {isClient ? "Client Dashboard" : "Vendor Workspace"}
          </h1>
          <p className="text-zinc-500 mt-1">
            {isClient
              ? "Manage your contracts and track execution."
              : "Track assigned tasks and submit proofs."}
          </p>
        </div>

        {isClient && (
          <Link
            href="/projects"
            className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all"
          >
            <Plus size={16} /> New Contract
          </Link>
        )}
      </div>

      {/* EMPTY STATE (Placeholder for 1st Time Users) */}
      {projects.length === 0 && (
        <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-300">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-zinc-100">
            <Briefcase className="text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">
            No active projects
          </h3>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto mt-2">
            {isClient
              ? "Upload a contract PDF to start tracking execution."
              : "You haven't been invited to any contracts yet."}
          </p>

          {/* Optional: Add a button here too for better UX */}
          {isClient && (
            <Link
              href="/projects/new"
              className="inline-block mt-6 text-sm font-bold text-blue-600 hover:underline"
            >
              Create your first project &rarr;
            </Link>
          )}
        </div>
      )}

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <Link
            key={project._id}
            href={`/projects/${project._id}`}
            className="group block bg-white border border-zinc-200 p-6 rounded-3xl hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-zinc-50 rounded-2xl group-hover:bg-zinc-900 transition-colors">
                <FileCheck
                  size={20}
                  className="text-zinc-400 group-hover:text-white transition-colors"
                />
              </div>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                  project.status === "active"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-zinc-100 text-zinc-500"
                )}
              >
                {project.status}
              </span>
            </div>

            <h3 className="font-bold text-lg text-zinc-900 mb-2 truncate group-hover:text-emerald-600 transition-colors">
              {project.contractName}
            </h3>
            <p className="text-xs text-zinc-500 line-clamp-2 mb-6 h-8">
              {project.summary || "No summary available."}
            </p>

            <div className="flex items-center gap-4 pt-6 border-t border-zinc-100 text-xs font-medium text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              {isClient && !project.vendorEmail && (
                <div className="flex items-center gap-1.5 text-amber-600">
                  <AlertCircle size={14} />
                  <span>No Vendor</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
