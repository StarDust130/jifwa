"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Briefcase,
  Calendar,
  ChevronRight,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Assignment {
  _id: string;
  contractName: string;
  status: string;
  createdAt: string;
  total_value?: string;
  milestones?: any[];
}

export function AssignmentsClient({
  initialData,
}: {
  initialData: Assignment[];
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  // 🔍 Filter Logic
  const filteredProjects = initialData.filter((project) => {
    const matchesSearch = project.contractName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 🎨 Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "active":
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-zinc-100 text-zinc-600 border-zinc-200";
    }
  };

  // --- EMPTY STATE ---
  if (initialData.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mb-6 border border-zinc-100 shadow-sm">
          <Briefcase size={32} className="text-zinc-300" />
        </div>
        <h2 className="text-2xl font-black text-primary tracking-tight">
          No Assignments Yet
        </h2>
        <p className="text-zinc-500 mt-2 max-w-xs text-sm font-medium leading-relaxed">
          You currently have no assigned jobs. When a client sends an invite, it
          will appear here instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 font-sans min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight flex items-center gap-3">
            Assignments
            <span className="bg-zinc-100 text-zinc-500 text-sm font-bold px-3 py-1 rounded-full border border-zinc-200">
              {initialData.length}
            </span>
          </h1>
          <p className="text-zinc-500 font-medium mt-2 text-sm">
            Track your active contracts and deliverables.
          </p>
        </div>

        {/* SEARCH & FILTER TOOLBAR */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              placeholder="Search assignments..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() =>
              setStatusFilter(statusFilter === "all" ? "active" : "all")
            }
            className={cn(
              "p-2.5 rounded-xl border transition-all flex items-center gap-2 text-sm font-bold",
              statusFilter === "active"
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            )}
          >
            <Filter size={16} />
            <span className="hidden md:inline">Active Only</span>
          </button>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white border border-zinc-200 rounded-[1.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="px-6 py-4 pl-8">Project Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4 text-right pr-8">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredProjects.map((project) => {
                const totalMilestones = project.milestones?.length || 0;
                const completed =
                  project.milestones?.filter(
                    (m: any) => m.status === "approved"
                  ).length || 0;
                const progress =
                  totalMilestones > 0
                    ? Math.round((completed / totalMilestones) * 100)
                    : 0;

                return (
                  <motion.tr
                    key={project._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "rgba(250, 250, 250, 0.5)" }}
                    onClick={() => router.push(`/assignments/${project._id}`)}
                    className="group cursor-pointer transition-colors"
                  >
                    {/* 1. Name Column */}
                    <td className="px-6 py-5 pl-8">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
                            project.status === "completed"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : "bg-zinc-900 border-zinc-800 text-white"
                          )}
                        >
                          {project.status === "completed" ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <PlayCircle
                              size={18}
                              fill="currentColor"
                              className="text-zinc-800 stroke-white"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm group-hover:text-blue-600 transition-colors">
                            {project.contractName}
                          </p>
                          <p className="text-[11px] text-zinc-400 font-medium">
                            ID: #{project._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Status Column */}
                    <td className="px-6 py-5">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                          getStatusBadge(project.status)
                        )}
                      >
                        {project.status}
                      </span>
                    </td>

                    {/* 3. Timeline Column */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                        <Calendar size={14} className="text-zinc-300" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* 4. Progress Column */}
                    <td className="px-6 py-5">
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1.5">
                          <span>{progress}% Complete</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* 5. Action Column */}
                    <td className="px-6 py-5 text-right pr-8">
                      <button className="text-zinc-300 hover:text-primary transition-colors">
                        <ArrowUpRight size={20} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {filteredProjects.length === 0 && (
            <div className="p-12 text-center text-sm text-zinc-500 font-medium">
              No assignments match your search.
            </div>
          )}
        </div>
        s
      </div>
    </div>
  );
}
