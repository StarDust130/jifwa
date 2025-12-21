"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  FileText,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Filter,
  MoreVertical,
  Calendar,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- MOCK DATA (Structure based on cite: 76, 175) ---
const PROJECTS = [
  {
    id: "1",
    name: "SaaS Service Agreement",
    client: "Acme Corp",
    value: "$12,500",
    status: "In Progress",
    statusStyle: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
    dueDate: "Nov 14, 2025",
    progress: 65,
  },
  {
    id: "2",
    name: "Non-Disclosure Agreement",
    client: "Linear Inc",
    value: "$0.00",
    status: "Signed",
    statusStyle: "bg-green-50 text-green-700 border-green-200 ring-green-100",
    dueDate: "Oct 22, 2025",
    progress: 100,
  },
  {
    id: "3",
    name: "Vendor Contract Q4",
    client: "Growth.io",
    value: "$4,500",
    status: "Review Needed",
    statusStyle:
      "bg-orange-50 text-orange-700 border-orange-200 ring-orange-100",
    dueDate: "Overdue",
    progress: 10,
    isOverdue: true,
  },
];

// Stats Card Component with Hover Effect
const StatsCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  delay,
  color,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 300, damping: 30 }}
    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden"
  >
    <div
      className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full blur-2xl -translate-y-10 translate-x-10 group-hover:opacity-10 transition-opacity`}
    ></div>

    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:border-gray-200 transition-colors">
        <Icon size={20} className="text-gray-900" />
      </div>
      {subtext && (
        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1">
          <ArrowUpRight size={10} /> {subtext}
        </span>
      )}
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
        {value}
      </h3>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
        {title}
      </p>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Welcome back. You have 2 contracts requiring attention.
          </p>
        </div>
        <Link href="/dashboard/projects/create">
          <Button className="bg-gray-900 hover:bg-black text-white shadow-xl shadow-gray-900/20 rounded-xl h-12 px-6 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm">
            <Plus size={18} className="mr-2" />
            Upload Contract
          </Button>
        </Link>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Active Projects"
          value="3"
          icon={FileText}
          color="bg-blue-500"
          subtext="+2 this week"
          delay={0.1}
        />
        <StatsCard
          title="Action Required"
          value="2"
          icon={AlertCircle}
          color="bg-red-500"
          delay={0.2}
        />
        <StatsCard
          title="Revenue Locked"
          value="$17,000"
          icon={DollarSign}
          color="bg-green-500"
          delay={0.3}
        />
      </div>

      {/* 3. RECENT PROJECTS TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div>
            <h2 className="font-bold text-lg text-gray-900">
              Recent Contracts
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Manage and track your legal agreements.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg text-xs font-bold text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              <Filter size={14} className="mr-2" /> Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg text-xs font-bold text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider w-[40%]">
                  Project Name
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-right text-xs uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PROJECTS.map((project) => (
                <tr
                  key={project.id}
                  className="group hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                          {project.client}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ring-2 ring-opacity-50 ${project.statusStyle}`}
                    >
                      {project.status === "Signed" && (
                        <CheckCircle2 size={12} className="mr-1.5" />
                      )}
                      {project.status === "Review Needed" && (
                        <AlertCircle size={12} className="mr-1.5" />
                      )}
                      {project.status === "In Progress" && (
                        <Clock size={12} className="mr-1.5" />
                      )}
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-2 text-xs font-medium ${
                        project.isOverdue
                          ? "text-red-600 bg-red-50 px-2 py-1 rounded-md w-fit"
                          : "text-gray-500"
                      }`}
                    >
                      <Calendar size={14} />
                      {project.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900 font-mono">
                    {project.value}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-300 hover:text-gray-900 hover:bg-gray-200 rounded-lg"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-center">
          <Button
            variant="ghost"
            className="text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-transparent flex items-center gap-1"
          >
            View All Projects <ArrowUpRight size={12} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
