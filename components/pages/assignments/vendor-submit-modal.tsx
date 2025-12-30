import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadCloud, Loader2, FileText, X, AlertCircle } from "lucide-react";
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
    // 1. Basic validation
    if (!file && !linkUrl) {
      toast.error("Please provide a file or link");
      return;
    }

    // 2. 1MB Limit validation
    if (activeTab === "file" && file && file.size > 1024 * 1024) {
      toast.error("File is too large! Maximum size is 1MB.");
      return;
    }

    setLoading(true);

    try {
      let finalFileUrl = "";
      if (activeTab === "file" && file) {
        finalFileUrl = await toBase64(file);
      }

      // 3. Call Server Action
      const result = await updateMilestone(
        projectId,
        milestone._id,
        "submit_proof",
        {
          fileUrl: finalFileUrl,
          linkUrl: activeTab === "link" ? linkUrl : "",
          notes,
        }
      );

      // 4. Handle UI Update ONLY on Success
      if (result.success) {
        onOptimisticUpdate(); // Update board UI
        setIsOpen(false);
        toast.success("Submitted for review");
        // Clear form
        setFile(null);
        setLinkUrl("");
        setNotes("");
      } else {
        toast.error(result.error || "Submission failed");
      }
    } catch (error: any) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-lg hover:bg-black transition-all">
          <UploadCloud size={14} className="text-zinc-400" />
          <span>Submit Proof</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px] bg-white p-0 overflow-hidden rounded-2xl border-zinc-100">
        <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
          <DialogTitle className="text-lg font-bold text-primary">
            Submit Deliverable
          </DialogTitle>
          <p className="text-xs text-zinc-500 mt-1">
            Upload evidence (Max 1MB) for the client.
          </p>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex bg-zinc-100 rounded-lg p-1">
            {["file", "link"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
                  activeTab === t
                    ? "bg-white shadow-sm text-primary"
                    : "text-zinc-500"
                )}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "file" && (
            <div className="relative">
              {!file ? (
                <label
                  htmlFor="f-up"
                  className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 cursor-pointer hover:bg-zinc-100 transition-colors"
                >
                  <UploadCloud className="w-6 h-6 text-zinc-300 mb-2" />
                  <p className="text-xs font-bold text-zinc-500">
                    Click to Upload
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Max 1MB allowed
                  </p>
                </label>
              ) : (
                <div className="flex justify-between items-center p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-zinc-100">
                      <FileText size={16} />
                    </div>
                    <p className="text-xs font-bold text-primary truncate">
                      {file.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              <input
                id="f-up"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const selected = e.target.files?.[0] || null;
                  if (selected && selected.size > 1024 * 1024) {
                    toast.error("File exceeds 1MB limit");
                    return;
                  }
                  setFile(selected);
                }}
              />
            </div>
          )}

          {activeTab === "link" && (
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 ring-zinc-900/5 transition-all"
            />
          )}

          <textarea
            placeholder="Add notes for the client..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 ring-zinc-900/5 min-h-[80px] resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Submit Material"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
