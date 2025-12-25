"use client";

import { useState, useEffect } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { UploadCard } from "./upload-card";
import { RecentActivity } from "./recent-activity";
import { cn } from "@/lib/utils";

interface ProjectsClientProps {
  initialProjects: any[];
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  // Initialize with props, but allow updates
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [loading, setLoading] = useState(true);

  // 🔄 FIX: Fetch data on mount so history persists when you navigate back
  useEffect(() => {
    async function fetchRecentProjects() {
      try {
        const res = await fetch("/api/projects"); // Connects to your existing API
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

    // Only fetch if we didn't get data from the server (SSR)
    if (initialProjects.length === 0) {
      fetchRecentProjects();
    } else {
      setLoading(false);
    }
  }, [initialProjects]);

  const hasHistory = projects.length > 0;

  const handleUploadSuccess = (newProject: any) => {
    // ⚡️ Instant UI update: Add new project to top of list
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <div className="w-full  font-sans  min-h-screen">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          Projects
        </h1>
      </div>

      <LayoutGroup>
        <motion.div
          layout
          className={cn(
            "max-w-7xl mx-auto grid gap-4 h-[500px]",
            // ANIMATION LOGIC:
            // 100% Width if empty -> 75% Width if history exists
            hasHistory ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"
          )}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Upload Card Area */}
          <motion.div
            layout
            className={cn(
              "h-full",
              hasHistory ? "lg:col-span-8" : "lg:col-span-12"
            )}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <UploadCard onUploadSuccess={handleUploadSuccess} />
          </motion.div>

          {/* Recent Activity Area */}
          <AnimatePresence>
            {hasHistory && (
              <motion.div
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="lg:col-span-4 h-full"
              >
                <RecentActivity projects={projects} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
