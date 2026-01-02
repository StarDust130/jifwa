"use client";

import { useState, useEffect } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { UploadCard } from "./upload-card";
import { RecentActivity } from "./recent-activity";
import { cn } from "@/lib/utils";
import { Activity, FileCheck } from "lucide-react";
import { PlanId, getPlanMeta } from "@/lib/plans";

interface ProjectsClientProps {
  initialProjects: any[];
  plan: PlanId;
  limit: number;
  currentUsage: number;
}

export function ProjectsClient({
  initialProjects,
  plan,
  limit,
  currentUsage,
}: ProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [usage, setUsage] = useState<number>(currentUsage);
  const planMeta = getPlanMeta(plan);

  // 🔄 Sync with server on mount
  useEffect(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    setProjects(initialProjects);
    setUsage(currentUsage);
  }, [initialProjects, currentUsage]);

  const handleUploadSuccess = (newProject: any) => {
    setProjects((prev) => [newProject, ...prev]);
    setUsage((prev) => prev + 1);
    router.refresh();
  };

  const hasHistory = projects.length > 0;
  const isAtLimit = usage >= limit;

  return (
    <div className="w-full font-sans min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-black tracking-tight text-primary flex items-center gap-3">
          <Activity className="text-zinc-400" />
          Projects
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500 mt-3">
          <span className="px-2 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-600">
            {planMeta.label}
          </span>
          <span className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">
            {Math.min(usage, limit)} /{" "}
            {limit === Number.MAX_SAFE_INTEGER ? "∞" : limit} active
          </span>
          {isAtLimit && (
            <button
              onClick={() => router.push("/billing")}
              className="px-2.5 py-1 rounded-lg bg-black text-white uppercase tracking-[0.15em] text-[10px] font-black"
            >
              Upgrade for more
            </button>
          )}
        </div>
      </div>

      <LayoutGroup>
        <motion.div
          layout
          className={cn(
            "max-w-7xl mx-auto grid gap-6",
            hasHistory
              ? "grid-cols-1 lg:grid-cols-12 items-start"
              : "grid-cols-1"
          )}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* LEFT: UPLOAD CARD */}
          <motion.div
            layout
            className={cn(hasHistory ? "lg:col-span-8" : "lg:col-span-12")}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <UploadCard
              onUploadSuccess={handleUploadSuccess}
              isDisabled={isAtLimit}
            />
          </motion.div>

          {/* RIGHT: ACTIVITY LIST (Only if history exists) */}
          <AnimatePresence>
            {hasHistory && (
              <motion.div
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="lg:col-span-4 w-full"
              >
                {/* Visual Wrapper to match Upload Card style */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 shadow-sm h-full min-h-[400px] flex flex-col">
                  <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-600">
                      <FileCheck size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-primary">
                        Active Contracts
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-medium">
                        {projects.length} Total Analysis
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1">
                    <RecentActivity projects={projects} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
