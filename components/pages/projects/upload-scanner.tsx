"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function UploadScanner() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "scanning" | "success">("idle");
  const [file, setFile] = useState<File | null>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setStatus("scanning");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // 1. Upload API
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!json.success) throw new Error("Upload failed");

      // 2. Create Project API
      const saveRes = await fetch("/api/projects/create", {
        method: "POST",
        body: JSON.stringify(json.data),
      });
      const saveJson = await saveRes.json();

      if (saveJson.success) {
        setStatus("success");
        setTimeout(() => router.push(`/projects/${saveJson.projectId}`), 1500);
      }
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* STATE 1: IDLE (Drag & Drop) */}
        {status === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative bg-white border border-zinc-200 rounded-2xl p-10 text-center shadow-sm hover:shadow-md transition-all">
              <input
                type="file"
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
              />
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-zinc-100">
                <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-primary">
                Upload Contract PDF
              </h3>
              <p className="text-zinc-500 text-sm mt-2 max-w-sm mx-auto">
                Drag and drop your agreement here. Our AI will extract
                milestones automatically.
              </p>
            </div>
          </motion.div>
        )}

        {/* STATE 2: SCANNING ANIMATION */}
        {status === "scanning" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden border border-zinc-800"
          >
            {/* The Scanning Beam */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] z-10"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-20 flex flex-col items-center">
              <div className="w-16 h-16 bg-zinc-800/50 rounded-xl flex items-center justify-center mb-6 border border-zinc-700">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Analyzing Contract...
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                Extracting deliverables, dates, and value.
              </p>

              <div className="flex gap-2 text-xs font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Reading PDF
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" /> AI Processing
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* STATE 3: SUCCESS */}
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-green-200 rounded-2xl p-8 text-center shadow-lg"
          >
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-primary">
              Analysis Complete!
            </h3>
            <p className="text-zinc-500 text-sm mt-1">
              Redirecting to your new workspace...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
