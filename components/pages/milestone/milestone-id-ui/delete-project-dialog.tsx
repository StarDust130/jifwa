"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

export function DeleteProjectDialog({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      // Prefetch to make exit instant
      router.prefetch("/projects");
      router.push("/projects");
    } catch (error) {
      alert("Could not delete project. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-[400px] rounded-xl border-zinc-200">
        <AlertDialogHeader>
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-2 border border-red-100">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <AlertDialogTitle className="text-primary">
            Delete Project?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-500 text-sm">
            This will remove the project, including contracts, milestones, and
            vendor data. You can restore it later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="text-sm font-medium rounded-lg border-zinc-200 hover:bg-zinc-50 hover:text-primary h-10">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg h-10 shadow-sm flex items-center gap-2 border border-red-700"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {isDeleting ? "Deleting..." : "Delete Project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
