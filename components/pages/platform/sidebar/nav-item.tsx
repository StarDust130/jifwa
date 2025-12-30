"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown, FolderDot } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  link: any;
  isActive: boolean;
  dropdownItems?: any[];
  currentRole?: string;
}

export function NavItem({
  link,
  isActive,
  dropdownItems = [],
  currentRole,
}: NavItemProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(isActive && link.name === "Assignments");

  const hasDropdown =
    currentRole === "vendor" &&
    link.name === "Assignments" &&
    dropdownItems.length > 0;

  // 🟢 SMART ANIMATIONS: Spring physics only. No shaking.
  const getIconVariants = (name: string): Variants => {
    const n = name.toLowerCase();

    // 1. Settings -> Spin with momentum
    if (n.includes("setting") || n.includes("config")) {
      return {
        rest: { rotate: 0 },
        hover: {
          rotate: 180,
          transition: { duration: 0.5, ease: "backOut" },
        },
      };
    }

    // 2. Dashboard/Home -> Smooth Pulse
    if (n.includes("dashboard") || n.includes("home")) {
      return {
        rest: { scale: 1 },
        hover: {
          scale: 1.2,
          transition: { type: "spring", stiffness: 400, damping: 10 },
        },
      };
    }

    // 3. Assignments/Docs -> The "Lift" (Moves up, no shake)
    if (
      n.includes("assignment") ||
      n.includes("project") ||
      n.includes("doc")
    ) {
      return {
        rest: { y: 0, scale: 1 },
        hover: {
          y: -4,
          scale: 1.1,
          transition: { type: "spring", stiffness: 300, damping: 15 },
        },
      };
    }

    // 4. Users/Profile -> The "Nod" (Tilt)
    if (n.includes("user") || n.includes("profile") || n.includes("team")) {
      return {
        rest: { rotate: 0, scale: 1 },
        hover: {
          rotate: 12,
          scale: 1.1,
          transition: { type: "spring", stiffness: 300, damping: 10 },
        },
      };
    }

    // 5. Analytics -> Pop & Tilt
    if (n.includes("analytics") || n.includes("stat")) {
      return {
        rest: { scale: 1, rotate: 0 },
        hover: {
          scale: 1.2,
          rotate: -5,
          transition: { type: "spring", stiffness: 300 },
        },
      };
    }

    // Default -> Simple Scale
    return {
      rest: { scale: 1 },
      hover: {
        scale: 1.15,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      },
    };
  };

  const iconVariants = getIconVariants(link.name);

  const chevronVariants: Variants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  return (
    <motion.div
      className="mb-1"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div className="relative group">
        <Link
          href={link.href}
          className={cn(
            "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative z-10 border select-none",
            isActive
              ? "bg-white text-primary border-zinc-200/60 shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
              : "text-zinc-500 border-transparent hover:bg-white hover:text-zinc-900 hover:shadow-sm hover:border-zinc-200/40"
          )}
        >
          <div className="flex items-center gap-3">
            {/* 🟢 ICON ANIMATION CONTAINER */}
            <motion.div
              variants={iconVariants}
              className={cn(
                "flex items-center justify-center origin-center",
                isActive
                  ? "text-zinc-900"
                  : "text-zinc-400 group-hover:text-zinc-900"
              )}
            >
              <link.icon size={18} strokeWidth={2} />
            </motion.div>
            <span>{link.name}</span>
          </div>

          {hasDropdown && (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-1 -mr-2 rounded-lg hover:bg-zinc-100 text-current transition-colors cursor-pointer"
            >
              <motion.div
                variants={chevronVariants}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} className="text-zinc-400" />
              </motion.div>
            </div>
          )}
        </Link>
      </div>

      <AnimatePresence>
        {hasDropdown && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-1 ml-4 pl-3 border-l-2 border-zinc-100 space-y-1 pb-2 pt-1">
              <p className="px-2 mb-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-70">
                Recent Jobs
              </p>

              {dropdownItems.map((project, i) => {
                const isProjectActive =
                  pathname === `/assignments/${project.projectId}`;

                return (
                  <Link
                    key={i}
                    href={`/assignments/${project.projectId}`}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium truncate transition-all group/sub",
                      isProjectActive
                        ? "bg-white text-zinc-900 border border-zinc-100 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-white/60"
                    )}
                  >
                    {/* Sub-item micro-interaction */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FolderDot
                        size={14}
                        className={cn(
                          "shrink-0",
                          isProjectActive
                            ? "text-zinc-900"
                            : "text-zinc-300 group-hover/sub:text-zinc-900"
                        )}
                      />
                    </motion.div>
                    <span className="truncate">{project.displayName}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
