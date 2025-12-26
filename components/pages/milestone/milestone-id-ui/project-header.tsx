"use client";

import Link from "next/link";
import { ArrowLeft, Download, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InviteVendorModal } from "@/components/pages/projects/project-id-ui/invite-vendor-modal";
import { DeleteProjectDialog } from "@/components/pages/projects/project-id-ui/delete-project-dialog";
import { Button } from "@/components/ui/button";

export function ProjectHeader({
  project,
  isClient,
}: {
  project: any;
  isClient: boolean;
}) {
  return (
    <nav className="backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* --- Left: Breadcrumb & Title --- */}
        <div className="flex items-center gap-3">
          <Link
            href="/milestones"
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>

          <div className="flex items-center gap-2 text-sm">
            <h1 className="font-bold text-zinc-900 truncate max-w-[150px] sm:max-w-md">
              {project.contractName}
            </h1>
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
            <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors outline-none focus:ring-0">
              <MoreHorizontal size={16} />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 bg-white border border-zinc-200 shadow-lg rounded-lg p-1"
            >
              <DropdownMenuItem className="text-xs font-medium text-zinc-600 focus:bg-zinc-50 cursor-pointer p-2 rounded-md flex gap-2">
                <Download size={14} /> Download PDF
              </DropdownMenuItem>

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
