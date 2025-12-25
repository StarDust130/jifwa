import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";

export function EmptyProjectsState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-blue-100 blur-sm opacity-50 animate-pulse"></div>
        <div className="relative bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <FolderOpen size={48} className="text-blue-500/80" />
        </div>
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">
        No projects found
      </h3>
      <p className="mt-2 text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
        You haven't uploaded any contracts yet. Upload a PDF to generate your
        first execution timeline instantly.
      </p>

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-slate-900/20 active:scale-95"
      >
        <Plus size={18} />
        <span>Create First Project</span>
      </Link>
    </div>
  );
}
