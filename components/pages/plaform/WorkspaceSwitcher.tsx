"use client";

import * as React from "react";
import { ChevronsUpDown, BriefcaseBusiness, Package } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Role = "client" | "vendor";

const ROLES: Record<
  Role,
  {
    label: string;
    description: string;
    icon: React.ElementType;
  }
> = {
  client: {
    label: "Client",
    description: "Manage your projects",
    icon: BriefcaseBusiness,
  },
  vendor: {
    label: "Vendor",
    description: "Deliver and track work",
    icon: Package, // better semantic than Store
  },
};

export function WorkspaceSwitcher() {
  const [role, setRole] = React.useState<Role>("client");
  const [open, setOpen] = React.useState(false);

  const ActiveIcon = ROLES[role].icon;

  return (
    <div className="px-3 pb-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between",
              "rounded-md border border-gray-200 bg-white",
              "px-3 py-2 text-sm font-medium text-gray-900",
              "hover:bg-gray-50 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-gray-200"
            )}
          >
            <div className="flex items-center gap-2.5">
              {/* ICON */}
              <ActiveIcon
                className="h-[18px] w-[18px] text-gray-700"
                strokeWidth={2.25}
              />
              <span>{ROLES[role].label}</span>
            </div>

            {/* CHEVRON */}
            <ChevronsUpDown
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-150",
                open && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className={cn(
            "w-[220px] rounded-md border border-gray-200 bg-white p-1 shadow-sm",
            "animate-in fade-in zoom-in-95"
          )}
        >
          {(Object.keys(ROLES) as Role[]).map((key) => {
            const Icon = ROLES[key].icon;
            const isActive = key === role;

            return (
              <button
                key={key}
                onClick={() => {
                  setRole(key);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-sm px-3 py-2 text-left transition-colors",
                  isActive ? "bg-gray-100" : "hover:bg-gray-50"
                )}
              >
                <Icon
                  className="mt-[2px] h-[18px] w-[18px] text-gray-700"
                  strokeWidth={2.25}
                />

                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {ROLES[key].label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {ROLES[key].description}
                  </div>
                </div>
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
}
