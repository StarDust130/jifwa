
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Box, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSwitcherProps {
  currentRole: string;
  onSwitch: (role: string) => void;
}

export function RoleSwitcher({ currentRole, onSwitch }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: "client",
      label: "Client",
      icon: Briefcase,
      sub: "Manager",
      desc: "Manage projects & funds",
    },
    {
      id: "vendor",
      label: "Vendor",
      icon: Box,
      sub: "Executor",
      desc: "Submit work & invoices",
    },
  ];

  const activeRole = roles.find((r) => r.id === currentRole) || roles[0];

  return (
    <div className="relative z-50">
      {/* 🟢 MAIN BUTTON (Static, Clean, No Wiggle) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-1.5 pr-2 rounded-xl border transition-all group outline-none",
          "bg-white border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
          "hover:border-zinc-300 hover:shadow-sm active:bg-zinc-50"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Static Icon Container - No Animation */}
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center border shadow-sm transition-colors",
              // Current Role Icon is Dark (High Contrast) to stand out
              currentRole === "client"
                ? "bg-zinc-900 border-zinc-800 text-white"
                : "bg-white border-zinc-200 text-zinc-900"
            )}
          >
            <activeRole.icon size={16} strokeWidth={2} />
          </div>

          <div className="text-left">
            <p className="text-sm font-bold text-zinc-900 capitalize leading-none mb-0.5">
              {activeRole.label}
            </p>
            <p className="text-[10px] text-zinc-500 font-bold tracking-wide uppercase">
              {activeRole.sub} Workspace
            </p>
          </div>
        </div>
        <ChevronsUpDown
          size={14}
          className="text-zinc-400 group-hover:text-zinc-900 transition-colors"
        />
      </button>

      {/* 🟢 DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }} // Fast, professional fade
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-[0_12px_32px_-10px_rgba(0,0,0,0.1)] z-50 p-1.5"
            >
              {roles.map((role) => {
                const isActive = currentRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setIsOpen(false);
                      onSwitch(role.id);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left mb-1 last:mb-0 group relative",
                      isActive ? "bg-zinc-100" : "hover:bg-zinc-50"
                    )}
                  >
                    {/* List Icon */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-md flex items-center justify-center border transition-all",
                        isActive
                          ? "bg-white border-zinc-200 text-zinc-900 shadow-sm"
                          : "border-transparent text-zinc-400 group-hover:text-zinc-600"
                      )}
                    >
                      <role.icon size={15} />
                    </div>

                    <div className="flex-1">
                      <span
                        className={cn(
                          "text-xs font-bold block",
                          isActive ? "text-zinc-900" : "text-zinc-700"
                        )}
                      >
                        {role.label}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {role.desc}
                      </span>
                    </div>

                    {isActive && (
                      <Check
                        size={14}
                        className="text-zinc-900"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
