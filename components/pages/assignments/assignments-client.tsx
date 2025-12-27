"use client";

import { useRouter } from "next/navigation";
import {
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AssignmentsClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();

  if (initialData.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mb-6 border border-zinc-100">
          <Briefcase size={32} className="text-zinc-300" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">No Assignments Yet</h2>
        <p className="text-zinc-500 mt-2 max-w-xs text-sm">
          When a client invites you to a job, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 font-sans min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
          My Assignments
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Manage your active jobs and submit work.
        </p>
      </div>

      <div className="grid gap-4">
        {initialData.map((job) => (
          <div
            key={job._id}
            onClick={() => router.push(`/milestones/${job._id}`)}
            className="group relative bg-white border border-zinc-200 rounded-2xl p-6 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-5">
                {/* Status Indicator */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-colors",
                    job.status === "completed"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                      : job.status === "processing"
                      ? "bg-blue-50 border-blue-100 text-blue-600"
                      : "bg-zinc-50 border-zinc-100 text-zinc-400"
                  )}
                >
                  {job.status === "completed" ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <PlayCircle size={20} />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                    {job.contractName}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      Due: ASAP
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    job.status === "active"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-zinc-100 text-zinc-500"
                  )}
                >
                  {job.status}
                </span>
                <ChevronRight
                  size={18}
                  className="text-zinc-300 group-hover:text-zinc-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
