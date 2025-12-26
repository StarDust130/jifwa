"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  Clock,
  ChevronRight,
  Filter,
  Plus,
  FolderOpen, // Changed icon for empty state
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatFullDate } from "@/lib/helper";
import { motion } from "framer-motion";

// --- CUSTOM ICONS & BADGES ---

const RichPdfIcon = () => (
  <motion.div
    whileHover={{ y: -4, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative w-10 h-12 shrink-0 group cursor-pointer"
  >
    <div className="absolute inset-0 bg-white border-2 border-zinc-100 rounded-lg shadow-sm group-hover:shadow-md group-hover:border-red-200 transition-all duration-300" />
    <div className="absolute top-0 left-0 w-full h-[18px] bg-red-600 rounded-t-md flex items-center justify-center shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]">
      <span className="text-[8px] font-black text-white tracking-[0.15em] leading-none drop-shadow-sm">
        PDF
      </span>
    </div>
    <div className="absolute top-[26px] left-2.5 right-2.5 space-y-1.5">
      <div className="h-[1.5px] w-full bg-zinc-100 rounded-full group-hover:bg-zinc-200 transition-colors" />
      <div className="h-[1.5px] w-3/4 bg-zinc-100 rounded-full group-hover:bg-zinc-200 transition-colors" />
    </div>
    <motion.div
      initial={{ width: 10, height: 10 }}
      whileHover={{ width: 14, height: 14 }}
      className="absolute top-0 right-0 bg-zinc-50 rounded-bl-lg border-b border-l border-zinc-200 shadow-[2px_2px_5px_rgba(0,0,0,0.05)] transition-all duration-300"
    />
  </motion.div>
);

const StatusBadge = ({ status }: { status: string }) => (
  <div
    className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0",
      status === "processing"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-emerald-50 text-emerald-700 border-emerald-100"
    )}
  >
    <span
      className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === "processing"
          ? "bg-amber-500 animate-pulse"
          : "bg-emerald-500"
      )}
    />
    {status === "active" ? "Active" : "Done"}
  </div>
);

// --- MAIN COMPONENT ---

export default function MilestoneClient({
  initialProjects = [],
  currentUser,
}: {
  initialProjects: any[];
  currentUser: any; // ✅ Fixed Type Error
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const isVendor = currentUser?.currentRole === "vendor";

  const filtered = useMemo(
    () =>
      initialProjects.filter((p) => {
        const matchesSearch = p.contractName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? p.status === statusFilter : true;
        return matchesSearch && matchesStatus;
      }),
    [initialProjects, searchTerm, statusFilter]
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🎨 COOL EMPTY STATE UI
  if (initialProjects.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="relative group mx-auto mb-8 w-32 h-32">
            {/* Animated Background Blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100 to-zinc-50 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            <div className="relative w-full h-full bg-white rounded-[2rem] border-2 border-dashed border-zinc-200 flex items-center justify-center shadow-sm group-hover:border-zinc-300 group-hover:scale-105 transition-all duration-300">
              <FolderOpen
                className="text-zinc-300 group-hover:text-zinc-900 transition-colors duration-300"
                size={48}
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <h2 className="text-2xl font-black tracking-tight text-zinc-900">
              {isVendor ? "No Work Assigned Yet" : "No Contracts Found"}
            </h2>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">
              {isVendor
                ? "You haven't been invited to any contracts. Check back later or view all projects."
                : "Your workspace is clean. Create a new contract to start tracking milestones."}
            </p>
          </div>

          {/* 👇 THE REQUESTED BUTTON */}
          <button
            onClick={() => router.push("/projects")}
            className="group inline-flex items-center gap-2 bg-zinc-900 text-white pl-6 pr-5 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-zinc-200 hover:bg-zinc-800 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>Go to Projects</span>
            <ArrowRight
              size={16}
              className="text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all"
            />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-zinc-200/80 w-full sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-xl font-black tracking-tighter uppercase leading-none">
                    {filtered.length === 1 ? "Milestone" : "Milestones"}
                  </h1>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 animate-pulse rounded-full bg-emerald-500" />
                    {filtered.length} Total Contract
                    {filtered.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {!isVendor && (
                <button
                  onClick={() => router.push("/projects")}
                  className="md:hidden p-2.5 bg-zinc-950 text-white rounded-xl shadow-lg"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-72 md:w-80">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Search Contracts..."
                  className="w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-3 rounded-2xl text-xs font-medium focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() =>
                    setStatusFilter(statusFilter === "active" ? null : "active")
                  }
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-3 border rounded-2xl transition-all flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-tighter",
                    statusFilter === "active"
                      ? "bg-zinc-900 border-zinc-900 text-white shadow-lg"
                      : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  )}
                >
                  <Filter size={14} /> Active
                </button>

                {!isVendor && (
                  <button
                    onClick={() => router.push("/projects")}
                    className="hidden md:flex items-center gap-2 bg-zinc-950 text-white px-5 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-tighter shadow-xl shadow-zinc-200 hover:bg-zinc-800 transition-all"
                  >
                    <Plus size={16} /> New Contract
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TABLE CONTENT */}
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="hidden md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                  <th className="px-8 py-6">Contract Name</th>
                  <th className="px-8 py-6">Timeline</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {currentItems.map((p) => {
                  const { date, time } = formatFullDate(p.createdAt);
                  return (
                    <tr
                      key={p._id}
                      onClick={() => router.push(`/projects/${p._id}`)}
                      className="hover:bg-zinc-50/50 cursor-pointer transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <RichPdfIcon />
                          <div className="min-w-0">
                            <span className="block text-sm font-bold text-zinc-900 group-hover:text-red-600 transition-colors truncate">
                              {p.contractName}
                            </span>
                            <span className="text-[9px] text-zinc-400 font-mono">
                              UID: {p._id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
                            <Calendar size={13} className="text-zinc-300" />{" "}
                            {date}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold ml-5">
                            <Clock size={11} className="text-zinc-300" /> {time}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-8 py-6 text-right text-sm font-black text-zinc-950">
                        {p.total_value || "$0.00"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE LIST */}
          <div className="md:hidden divide-y divide-zinc-100">
            {currentItems.map((p) => {
              const { date, time } = formatFullDate(p.createdAt);
              return (
                <div
                  key={p._id}
                  onClick={() => router.push(`/projects/${p._id}`)}
                  className="p-5 active:bg-zinc-50 flex items-start gap-4"
                >
                  <div className="shrink-0">
                    <RichPdfIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-bold text-zinc-900 line-clamp-2 leading-tight">
                        {p.contractName}
                      </h3>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-[13px] font-black text-zinc-900 mt-2">
                      {p.total_value || "$0.00"}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> {date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {time}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-zinc-300 self-center"
                  />
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="py-6 border-t border-zinc-100 px-6">
              <Pagination>
                <PaginationContent className="w-full justify-between sm:justify-center">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={cn(
                        "rounded-xl border-zinc-200 shadow-sm font-bold text-[11px] uppercase tracking-tighter",
                        currentPage === 1 && "opacity-40 pointer-events-none"
                      )}
                    />
                  </PaginationItem>
                  <div className="hidden sm:flex items-center gap-1 px-4">
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          className={cn(
                            "rounded-xl w-9 h-9 font-bold",
                            currentPage === i + 1
                              ? "bg-zinc-950 text-white"
                              : "bg-white border-zinc-200"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </div>
                  <div className="sm:hidden text-[11px] font-black text-zinc-400 uppercase">
                    Pg {currentPage} / {totalPages}
                  </div>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                      className={cn(
                        "rounded-xl border-zinc-200 shadow-sm font-bold text-[11px] uppercase tracking-tighter",
                        currentPage === totalPages &&
                          "opacity-40 pointer-events-none"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
