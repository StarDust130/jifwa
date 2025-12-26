import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Plus,
  CheckCircle2,
  Loader2,
  Zap,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface ProjectData {
  _id: string;
  contractName: string;
  createdAt: Date | string;
  size: string;
  status: string;
}

interface UploadCardProps {
  onUploadSuccess: (project: ProjectData) => void;
}

// 🔄 Dynamic Loading Messages (The "Living" Loader)
const LOADING_STEPS = [
  "Establishing secure connection...",
  "Scanning document structure...",
  "Verifying legal terminology...",
  "Extracting parties & dates...",
  "Analyzing key clauses...",
  "Finalizing contract summary...",
];

// Message to show if it takes too long (> 8 seconds)
const LONG_WAIT_MESSAGE = "Taking longer than usual (large file detected)...";

export function UploadCard({ onUploadSuccess }: UploadCardProps) {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Status states
  const [status, setStatus] = useState<
    "idle" | "uploading" | "analyzing" | "success" | "error"
  >("idle");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);

  // Dynamic Text State
  const [loadingText, setLoadingText] = useState(LOADING_STEPS[0]);

  // 🔄 CYCLE LOADING TEXT LOGIC
  useEffect(() => {
    let stepIndex = 0;
    let interval: NodeJS.Timeout;

    if (status === "analyzing") {
      // Reset text
      setLoadingText(LOADING_STEPS[0]);

      interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < LOADING_STEPS.length) {
          setLoadingText(LOADING_STEPS[stepIndex]);
        } else {
          // If we run out of messages, show the "Long Wait" message
          setLoadingText(LONG_WAIT_MESSAGE);
        }
      }, 1500); // Change text every 1.5s
    }

    return () => clearInterval(interval);
  }, [status]);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are supported.");
      return;
    }

    // 1. Reset UI
    setStatus("uploading");
    setFileName(file.name);
    setProgress(10);
    setErrorTitle("");
    setErrorMessage("");
    setLoadingText("Uploading securely...");

    // 2. Stage 1: Upload (Fast to 60%)
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 60) return 60;
        return prev + 10;
      });
    }, 150);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 3. Send to API
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(uploadInterval);

      // Stage 2: AI Analysis (Switch to "Living" Loader)
      setStatus("analyzing");
      setProgress(65);

      const analysisInterval = setInterval(() => {
        // Slow steady crawl so it never looks fully stuck
        setProgress((prev) => (prev >= 98 ? 98 : prev + 0.5));
      }, 200);

      const uploadJson = await uploadRes.json();
      clearInterval(analysisInterval);

      // 🛑 HANDLE API ERRORS
      if (!uploadRes.ok || !uploadJson.success) {
        throw new Error(uploadJson.error || "Validation failed");
      }

      // 4. Create Project
      const createRes = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadJson.data),
      });

      const createJson = await createRes.json();

      if (createJson.success) {
        setProgress(100);
        setStatus("success");
        setLoadingText("Redirecting...");

        router.prefetch(`/milestones/${createJson.projectId}`);

        onUploadSuccess({
          _id: createJson.projectId,
          contractName: file.name,
          createdAt: new Date(),
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          status: "processing",
        });

        setTimeout(() => {
          router.push(`/milestones/${createJson.projectId}`);
        }, 500);
      }
    } catch (err: any) {
      console.error(err);
      let title = "Document Rejected";
      let msg = err.message || "Upload failed";

      if (
        msg.toLowerCase().includes("resume") ||
        msg.toLowerCase().includes("not a contract")
      ) {
        title = "Not a Contract";
      }

      setErrorTitle(title);
      setErrorMessage(msg);
      setStatus("error");
    }
  };

  return (
    <div
      className={cn(
        "relative h-full w-full rounded-3xl transition-all duration-300 overflow-hidden flex flex-col items-center justify-center text-center bg-white shadow-sm border",
        dragActive
          ? "border-zinc-900 bg-zinc-50"
          : "border-zinc-200 hover:border-zinc-300",
        // Soft Orange Border for Error
        status === "error" && "border-amber-200 bg-amber-50/20"
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

      {/* Background Pattern */}
      {status !== "error" && (
        <div
          className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />
      )}

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
        ) : status === "error" ? (
          // === ⚠️ SOFTER ERROR STATE ===
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-md p-8 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-100">
              <AlertCircle size={36} className="text-amber-500" />
            </div>

            <h3 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight">
              {errorTitle}
            </h3>

            <p className="text-zinc-500 font-medium text-sm mb-8 text-center px-6 leading-relaxed">
              {errorMessage}
            </p>

            <button
              onClick={() => setStatus("idle")}
              className="px-6 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-all shadow-sm flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Try Another File
            </button>
          </motion.div>
        ) : (
          // === 🚀 DYNAMIC "LIVING" LOADER ===
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
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

                {/* 🔄 ANIMATED TEXT CONTAINER */}
                <div className="h-5 overflow-hidden relative w-full mt-1">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingText} // Changing key triggers animation
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "text-xs font-bold uppercase tracking-wide absolute w-full truncate",
                        status === "success"
                          ? "text-green-600"
                          : status === "analyzing"
                          ? "text-indigo-600"
                          : "text-zinc-400"
                      )}
                    >
                      {status === "success" ? (
                        <span className="flex items-center gap-1">
                          Complete <Zap size={10} fill="currentColor" />
                        </span>
                      ) : (
                        loadingText
                      )}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden relative">
              <motion.div
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out",
                  status === "success"
                    ? "bg-green-500"
                    : status === "analyzing"
                    ? "bg-indigo-500"
                    : "bg-zinc-900"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <span>
                {status === "analyzing" ? "AI Processing" : "Encryption"}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
