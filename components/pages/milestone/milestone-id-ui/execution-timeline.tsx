"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { TimelineItem } from "./timeline-item";

export function ExecutionTimeline({
  milestones,
  projectId,
  isClient,
}: {
  milestones: any[];
  projectId: string;
  isClient: boolean;
}) {
  if (!milestones || milestones.length === 0) return <EmptyState />;

  const completedCount = milestones.filter(
    (m) => m.status === "approved"
  ).length;
  const progressPercent = Math.min(
    (completedCount / milestones.length) * 100,
    100
  );

  return (
    <div className="relative space-y-8 py-4 w-full">
      <div className="absolute left-[27px] sm:left-[35px] top-4 bottom-8 w-[2px] bg-zinc-100 rounded-full" />
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${progressPercent}%` }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="absolute left-[27px] sm:left-[35px] top-4 w-[2px] bg-zinc-900 rounded-full z-0"
        style={{ maxHeight: "calc(100% - 60px)" }}
      />

      {milestones.map((m, i) => (
        <TimelineItem
          key={m._id}
          m={m}
          i={i}
          prevStatus={i > 0 ? milestones[i - 1].status : "approved"}
          projectId={projectId}
          isClient={isClient}
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm border border-zinc-100">
        <Clock size={20} className="text-zinc-300" />
      </div>
      <p className="text-sm font-bold text-primary">Roadmap Empty</p>
    </div>
  );
}
