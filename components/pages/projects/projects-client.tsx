"use client";

import { useState, useEffect } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { UploadCard } from "./upload-card";
import { RecentActivity } from "./recent-activity";
import { cn } from "@/lib/utils";
import { Activity, FileCheck } from "lucide-react";

interface ProjectsClientProps {
  initialProjects: any[];
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>(initialProjects);

  // 🔄 Sync with server on mount
  useEffect(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleUploadSuccess = (newProject: any) => {
    setProjects((prev) => [newProject, ...prev]);
    router.refresh();
  };

  const hasHistory = projects.length > 0;

  return (
    <div className="w-full font-sans min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-3">
          <Activity className="text-zinc-400" />
          Projects
        </h1>
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
              isDisabled={hasHistory}
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
                      <h3 className="text-sm font-bold text-zinc-900">
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
