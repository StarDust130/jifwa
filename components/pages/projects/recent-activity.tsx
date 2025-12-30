"use client";

import { FileText, ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Random color generator helper
const getFileColor = (index: number) => {
  const colors = [
    "text-blue-600 bg-blue-50 border-blue-100",
    "text-purple-600 bg-purple-50 border-purple-100",
    "text-orange-600 bg-orange-50 border-orange-100",
    "text-pink-600 bg-pink-50 border-pink-100",
    "text-emerald-600 bg-emerald-50 border-emerald-100",
  ];
  return colors[index % colors.length];
};

// Helper: Check if file is less than 3 hours old
const isRecent = (dateInput: string | Date) => {
  if (!dateInput) return false;
  const date = new Date(dateInput);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const threeHoursInMs = 3 * 60 * 60 * 1000;
  return diffInMs < threeHoursInMs;
};

// Helper: Format Date
const formatDate = (dateInput: string | Date) => {
  if (!dateInput) return "Just now";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export function RecentActivity({ projects }: { projects: any[] }) {
  const topProjects = projects.slice(0, 5);

  return (
    <div className="flex flex-col h-full bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-zinc-500" />
          <span className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
            Recent Activity
          </span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {topProjects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-sm">
            <p>No recent files</p>
          </div>
        ) : (
          topProjects.map((project, i) => {
            const showNewBadge = isRecent(project.createdAt);

            return (
              <Link
                key={project._id || i}
                href={`/milestones/${project._id}`}
                className="group relative p-3 rounded-xl hover:bg-zinc-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-zinc-200/50 block"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border",
                      getFileColor(i)
                    )}
                  >
                    <FileText size={16} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-primary truncate pr-6">
                      {project.contractName}
                    </h4>

                    <div className="flex items-center gap-2 mt-1.5 h-4">
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {formatDate(project.createdAt)}
                      </span>

                      {/* NEW BADGE */}
                      {showNewBadge && (
                        <>
                          <span className="text-zinc-300">•</span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 tracking-wide">
                            NEW
                          </span>
                        </>
                      )}

                      {project.size && !showNewBadge && (
                        <>
                          <span className="text-zinc-300">•</span>
                          <span className="text-[11px] text-zinc-400">
                            {project.size}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight
                    size={14}
                    className="text-zinc-400 hover:text-primary"
                  />
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-100 bg-zinc-50/50">
        <Link
          href="/projects/all"
          className="flex items-center justify-center w-full py-2.5 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-primary transition-all shadow-sm"
        >
          View All Projects
        </Link>
      </div>
    </div>
  );
}
