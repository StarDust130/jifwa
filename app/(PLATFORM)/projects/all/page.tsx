"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

// --- 1. REALISTIC "RICH" PDF ICON ---
const RichPdfIcon = () => (
  <div className="relative w-8 h-10 shrink-0 transition-transform group-hover:scale-105 duration-300">
    <div className="absolute inset-0 bg-white border border-zinc-300 rounded-[4px] shadow-sm group-hover:shadow-md transition-all"></div>
    {/* Red Header */}
    <div className="absolute top-0 left-0 w-full h-[14px] bg-red-600 rounded-t-[3px] opacity-90"></div>
    <div className="absolute top-[3px] left-[4px] text-[6px] font-black text-white tracking-wider">
      PDF
    </div>
    {/* Text Lines */}
    <div className="absolute top-[20px] left-1.5 right-1.5 h-[2px] bg-zinc-100 rounded-full"></div>
    <div className="absolute top-[26px] left-1.5 right-3 h-[2px] bg-zinc-100 rounded-full"></div>
    <div className="absolute top-[32px] left-1.5 right-2 h-[2px] bg-zinc-100 rounded-full"></div>
    {/* Folded Corner Effect */}
    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-zinc-50 rounded-bl-md border-b border-l border-zinc-200 shadow-sm"></div>
  </div>
);

// Helper: Format Bytes to MB
const formatSize = (size?: string | number) => {
  if (!size) return "-";
  if (typeof size === "string") return size; // Already formatted
  return (size / 1024 / 1024).toFixed(2) + " MB";
};

export default function AllProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "processing"
  >("all");

  // 1️⃣ Fetch Real Data
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProjects(json.data);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // 2️⃣ Search & Filter Logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.contractName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? p.status !== "processing"
        : p.status === "processing";
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {/* --- HEADER (Sticky) --- */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/projects"
              className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-all"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="h-6 w-px bg-zinc-200 hidden md:block"></div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              All Contracts
            </h1>
            <span className="bg-zinc-100 text-zinc-500 text-xs font-medium px-2 py-0.5 rounded-full">
              {filteredProjects.length}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-72">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors"
              />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/5 transition-all"
              />
            </div>

            <button
              onClick={() =>
                setStatusFilter((prev) => (prev === "all" ? "active" : "all"))
              }
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-medium transition-all shadow-sm
                    ${
                      statusFilter !== "all"
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                    }`}
            >
              <Filter size={14} />
              <span>
                {statusFilter === "all" ? "All Status" : "Active Only"}
              </span>
              <ChevronDown size={12} className="opacity-50" />
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN TABLE CONTENT --- */}
      <div className="max-w-[1600px] mx-auto p-0 md:p-6">
        <div className="bg-white md:border border-zinc-200 md:rounded-xl overflow-hidden min-h-[600px]">
          {loading ? (
            // SKELETON LOADER
            <div className="p-4 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-3 border-b border-zinc-50 animate-pulse"
                >
                  <div className="w-8 h-10 bg-zinc-100 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-100 rounded w-1/3" />
                    <div className="h-3 bg-zinc-50 rounded w-1/4" />
                  </div>
                  <div className="h-4 bg-zinc-100 rounded w-20" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            // EMPTY STATE
            <div className="flex flex-col items-center justify-center h-[500px] text-zinc-400">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4">
                <Search size={24} className="opacity-20" />
              </div>
              <h3 className="text-zinc-900 font-semibold mb-1">
                No contracts found
              </h3>
              <p className="text-sm text-zinc-500">
                Try clearing your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="mt-4 text-xs font-medium text-red-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            // TABLE
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-[40%] cursor-pointer hover:text-zinc-700">
                      <div className="flex items-center gap-1">
                        Contract Name <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-[20%]">
                      Date
                    </th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-[15%]">
                      Status
                    </th>
                    <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-[15%]">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 w-[10%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredProjects.map((project, i) => (
                    <motion.tr
                      key={project._id || i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => router.push(`/projects/${project._id}`)}
                      className="group hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      {/* Name Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <RichPdfIcon />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-zinc-900 group-hover:text-red-600 transition-colors">
                              {project.contractName}
                            </span>
                            <span className="text-[11px] text-zinc-400 font-mono mt-0.5">
                              {/* Real Size Data */}
                              {formatSize(project.size)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date Column */}
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-zinc-600">
                          {project.createdAt
                            ? new Date(project.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                          {project.createdAt
                            ? new Date(project.createdAt).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : ""}
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        {project.status === "processing" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Processing
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Risk/Analysis Column - Real Data Only */}
                      <td className="px-6 py-4">
                        {project.riskScore !== undefined ? (
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-20 bg-zinc-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-colors ${
                                  project.riskScore > 70
                                    ? "bg-red-500"
                                    : project.riskScore > 40
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{ width: `${project.riskScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-zinc-700">
                              {project.riskScore}/100
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-400 italic">
                            Pending Analysis
                          </span>
                        )}
                      </td>

                      {/* Action Column */}
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-zinc-300 hover:text-zinc-900 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
