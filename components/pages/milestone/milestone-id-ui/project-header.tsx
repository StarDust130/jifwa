"use client";

import Link from "next/link";
import { ArrowLeft, Download, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { InviteVendorModal } from "./invite-vendor-modal";
import { DeleteProjectDialog } from "./delete-project-dialog";

export function ProjectHeader({
  project,
  isClient,
  inReviewCount,
  isCompleted,
}: {
  project: any;
  isClient: boolean;
  inReviewCount: number;
  isCompleted: boolean;
}) {
  return (
    <nav className="backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* --- Left: Breadcrumb & Title --- */}
        <div className="flex items-center gap-3">
          <Link
            href="/milestones"
            className="p-1.5 rounded-md text-zinc-400 hover:text-primary hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>

          <div className="flex items-center gap-2 text-sm">
            <h1 className="font-bold text-primary truncate max-w-[150px] sm:max-w-md">
              {project.contractName}
            </h1>
            <span
              className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : inReviewCount > 0
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200"
              }`}
            >
              {isCompleted
                ? "Completed"
                : inReviewCount > 0
                ? `${inReviewCount} awaiting review`
                : "Active"}
            </span>
          </div>
        </div>

        {/* --- Right: Actions --- */}
        <div className="flex items-center gap-2">
          {/* Invite Button (Strict Black Style) */}
          {isClient && !project.vendorEmail && (
            // We force the button styles inside the modal to be Black/White
            <Button>
              {" "}
              <InviteVendorModal projectId={project._id.toString()} />
            </Button>
          )}

          {/* More Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-primary transition-colors outline-none focus:ring-0">
              <MoreHorizontal size={16} />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 bg-white border border-zinc-200 shadow-lg rounded-lg p-1"
            >
              {/* <DropdownMenuItem className="text-xs font-medium text-zinc-600 focus:bg-zinc-50 cursor-pointer p-2 rounded-md flex gap-2">
                <Download size={14} /> Download PDF
              </DropdownMenuItem> */}

              {/* DELETE DIALOG TRIGGER */}
              <DeleteProjectDialog projectId={project._id.toString()}>
                <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-red-50 hover:text-red-700 text-red-600 font-medium w-full gap-2">
                  <Trash2 size={14} /> Delete Project
                </div>
              </DeleteProjectDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
