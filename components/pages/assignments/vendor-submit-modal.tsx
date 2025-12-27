"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  UploadCloud,
  Link as LinkIcon,
  Loader2,
  Check,
  FileText,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function VendorSubmitModal({
  milestone,
  projectId,
}: {
  milestone: any;
  projectId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"file" | "link">("file");
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [notes, setNotes] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Mock API Call
      await new Promise((r) => setTimeout(r, 1000));

      // Add your real API call here

      setIsOpen(false);
      setFile(null);
      setLinkUrl("");
      router.refresh();
    } catch (error) {
      alert("Error submitting work");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="group flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-sm font-bold shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all hover:shadow-md active:scale-95">
          <UploadCloud
            size={16}
            className="text-zinc-400 group-hover:text-zinc-900 transition-colors"
          />
          <span>Submit Work</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px] bg-white p-0 gap-0 overflow-hidden rounded-2xl border-zinc-100 shadow-2xl">
        <div className="p-5 border-b border-zinc-100 flex justify-between items-start">
          <div>
            <DialogTitle className="text-lg font-bold text-zinc-900">
              Submit Deliverable
            </DialogTitle>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              ID: {milestone._id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 mx-5 mt-5 bg-zinc-100 rounded-lg">
          <button
            onClick={() => setActiveTab("file")}
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2",
              activeTab === "file"
                ? "bg-white shadow-sm text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <UploadCloud size={14} /> Upload File
          </button>
          <button
            onClick={() => setActiveTab("link")}
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2",
              activeTab === "link"
                ? "bg-white shadow-sm text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <LinkIcon size={14} /> External Link
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* FILE UPLOAD AREA (Fixed) */}
          {activeTab === "file" && (
            <div className="group relative">
              {!file ? (
                <>
                  {/* 🟢 THE FIX: Input covers full area and z-index is handled */}
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-2 bg-white rounded-lg shadow-sm mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-zinc-400" />
                      </div>
                      <p className="mb-1 text-sm font-bold text-zinc-700">
                        Click to upload
                      </p>
                      <p className="text-xs text-zinc-400">
                        PDF, PNG, JPG (Max 50MB)
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </>
              ) : (
                <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-zinc-100 shrink-0">
                      <FileText size={20} className="text-zinc-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-zinc-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
                  >
                    <X size={16} className="text-zinc-500" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LINK INPUT */}
          {activeTab === "link" && (
            <div className="relative">
              <LinkIcon
                className="absolute left-3 top-3.5 text-zinc-400"
                size={16}
              />
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          )}

          {/* Note Input */}
          <textarea
            className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all resize-none min-h-[80px]"
            placeholder="Add a note (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={(!file && !linkUrl) || loading}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-zinc-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Submit for Review"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
