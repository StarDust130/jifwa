import Link from "next/link";
import {
  FileText,
  Calendar,
  ArrowRight,
  DollarSign,
  Clock,
} from "lucide-react";

interface ProjectCardProps {
  project: {
    _id: string;
    contractName: string;
    total_value: string;
    status: string;
    createdAt: Date;
    partyName?: string; // Optional vendor name
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Logic: Only show money if it looks like a currency (contains digits or $)
  const hasMoney = project.total_value && project.total_value.match(/\d/);

  // Format Date
  const dateStr = new Date(project.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Status Styling
  const statusStyles = {
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20",
    completed: "bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/20",
    archived: "bg-gray-50 text-gray-600 border-gray-100 ring-gray-500/20",
  };
  const currentStatus =
    statusStyles[project.status as keyof typeof statusStyles] ||
    statusStyles.active;

  return (
    <Link
      href={`/projects/${project._id}`}
      className="group relative flex flex-col bg-white border border-gray-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1"
    >
      {/* HEADER: Icon & Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
          <FileText size={20} />
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ring-1 ${currentStatus}`}
        >
          {project.status}
        </span>
      </div>

      {/* BODY: Title & Vendor */}
      <div className="mb-6 flex-grow">
        <h3
          className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors"
          title={project.contractName}
        >
          {project.contractName}
        </h3>
        {project.partyName && (
          <p className="text-sm text-slate-500 mt-1">
            with {project.partyName}
          </p>
        )}
      </div>

      {/* MONEY & META SECTION */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        {/* Conditional Money Card */}
        {hasMoney ? (
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
              <DollarSign size={14} /> Value
            </div>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {project.total_value}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 opacity-70">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
              Type
            </div>
            <span className="text-sm font-semibold text-slate-700">
              Standard Contract
            </span>
          </div>
        )}

        {/* Footer Date & Action */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Clock size={12} />
            <span>Created {dateStr}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            View Details <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </Link>
  );
}
