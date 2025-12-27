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
  FileText,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { updateMilestone } from "@/app/actions/milestone";

export function VendorSubmitModal({
  milestone,
  projectId,
  onOptimisticUpdate,
}: {
  milestone: any;
  projectId: string;
  onOptimisticUpdate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"file" | "link">("file");

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async () => {
    if (!file && !linkUrl) {
      toast.error("Please provide a file or link");
      return;
    }

    setLoading(true);

    // ⚡️ Instant UI Update
    onOptimisticUpdate();
    setIsOpen(false);
    toast.success("Submitted for review");

    try {
      let finalFileUrl = "";
      if (file) {
        if (file.size > 4 * 1024 * 1024) throw new Error("File max 4MB");
        finalFileUrl = await toBase64(file);
      }

      await updateMilestone(projectId, milestone._id, "submit_proof", {
        fileUrl: finalFileUrl,
        linkUrl,
        notes,
      });
    } catch (error: any) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold shadow-lg hover:bg-black transition-all">
          <UploadCloud size={14} className="text-zinc-400" />
          <span>Submit Proof</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px] bg-white p-0 overflow-hidden rounded-2xl border-zinc-100">
        <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
          <DialogTitle className="text-lg font-bold text-zinc-900">
            Submit Deliverable
          </DialogTitle>
          <p className="text-xs text-zinc-500 mt-1">
            Upload evidence for the client.
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Tabs */}
          <div className="flex bg-zinc-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("file")}
              className={cn(
                "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
                activeTab === "file"
                  ? "bg-white shadow-sm text-zinc-900"
                  : "text-zinc-500"
              )}
            >
              File
            </button>
            <button
              onClick={() => setActiveTab("link")}
              className={cn(
                "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
                activeTab === "link"
                  ? "bg-white shadow-sm text-zinc-900"
                  : "text-zinc-500"
              )}
            >
              Link
            </button>
          </div>

          {activeTab === "file" && (
            <div className="relative">
              {!file ? (
                <label
                  htmlFor="f-up"
                  className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 cursor-pointer hover:bg-zinc-50"
                >
                  <UploadCloud className="w-6 h-6 text-zinc-300 mb-2" />
                  <p className="text-xs font-bold text-zinc-500">
                    Click to Upload
                  </p>
                </label>
              ) : (
                <div className="flex justify-between items-center p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-zinc-100">
                      <FileText size={16} />
                    </div>
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {file.name}
                    </p>
                  </div>
                  <button onClick={() => setFile(null)}>
                    <X size={14} />
                  </button>
                </div>
              )}
              <input
                id="f-up"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          )}

          {activeTab === "link" && (
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-zinc-400"
            />
          )}

          <textarea
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-zinc-400 min-h-[80px]"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" size={16} />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
