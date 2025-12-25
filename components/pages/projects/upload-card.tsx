import { useState, useRef } from "react";
import { FileText, Plus, CheckCircle2, Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Define the shape of the Project object for type safety
export interface ProjectData {
  _id: string;
  contractName: string;
  createdAt: Date | string;
  size: string;
  status: string;
}

interface UploadCardProps {
  // Fix: Strictly type the callback
  onUploadSuccess: (project: ProjectData) => void;
}

export function UploadCard({ onUploadSuccess }: UploadCardProps) {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are supported.");
      return;
    }

    // 1. Init UI
    setStatus("uploading");
    setFileName(file.name);
    setProgress(0);

    // Visual progress (Fast & Smooth)
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 15));
    }, 150);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 2. Upload to API
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadJson = await uploadRes.json();

      if (!uploadJson.success)
        throw new Error(uploadJson.error || "Upload failed");

      // 3. Create Project Record
      const createRes = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadJson.data),
      });

      const createJson = await createRes.json();

      if (createJson.success) {
        clearInterval(progressInterval);
        setProgress(100);
        setStatus("success");

        // 4. Notify Parent Component (Instant UI Update)
        onUploadSuccess({
          _id: createJson.projectId || Math.random().toString(),
          contractName: file.name,
          createdAt: new Date(),
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          status: "processing",
        });

        // 5. Fast Redirect (0.8s wait - Snappy)
        setTimeout(() => {
          router.push(`/projects/${createJson.projectId}`);
        }, 800);
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      setStatus("error");
      alert("Upload failed. Check your connection.");
    }
  };

  return (
    <div
      className={cn(
        "relative h-full w-full rounded-3xl transition-all duration-300 overflow-hidden flex flex-col items-center justify-center text-center bg-white shadow-sm",
        dragActive
          ? "border-2 border-zinc-900 bg-zinc-50"
          : "border border-zinc-200 hover:border-zinc-300 hover:shadow-md"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* BLINKING DOTS BACKGROUND (Fixed) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none animate-pulse"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <AnimatePresence mode="wait">
        {status === "idle" ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 p-8 flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -3 }}
              className="w-24 h-24 bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 flex items-center justify-center mb-8"
            >
              <FileText size={48} className="text-red-600" strokeWidth={1.5} />
            </motion.div>

            <h3 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">
              Upload Contract
            </h3>
            <p className="text-zinc-500 text-sm mb-8 max-w-xs mx-auto font-medium">
              Drag and drop your PDF here to start analysis.
            </p>

            <button
              onClick={() => inputRef.current?.click()}
              className="group relative px-6 py-3 rounded-xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Select Document</span>
            </button>
          </motion.div>
        ) : (
          // === LOADING / SUCCESS STATE ===
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10 w-full max-w-sm p-6 bg-white rounded-2xl border border-zinc-100 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-5">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  status === "success"
                    ? "bg-green-50 text-green-600"
                    : "bg-zinc-50 text-zinc-900"
                )}
              >
                {status === "success" ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <Loader2 size={24} className="animate-spin" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-sm font-bold text-zinc-900 truncate">
                  {fileName}
                </h4>
                <p className="text-xs text-zinc-500 font-medium mt-0.5 flex items-center gap-1">
                  {status === "success" ? (
                    <span className="text-green-600 flex items-center gap-1">
                      Redirecting <Zap size={10} fill="currentColor" />
                    </span>
                  ) : (
                    "Encryption active..."
                  )}
                </p>
              </div>
            </div>

            {/* Premium Progress Bar */}
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden relative">
              <motion.div
                className={cn(
                  "h-full rounded-full transition-colors duration-300",
                  status === "success" ? "bg-green-500" : "bg-zinc-900"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <span>{status === "success" ? "Done" : "Uploading"}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
