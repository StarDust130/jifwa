"use client";

import { cn } from "@/lib/utils";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      // Force light theme content for maximum contrast
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-600" />,
        info: <InfoIcon className="size-4 text-primary" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600" />,
        error: <OctagonXIcon className="size-4 text-rose-600" />,
        loading: <Loader2Icon className="size-4 animate-spin text-primary" />,
      }}
      toastOptions={{
        // Using a multi-layered shadow for that 'z-50' depth
        className: cn(
          "group !bg-white !text-black !border !border-zinc-900",
          "shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.15)]",
          "rounded-2xl p-4 flex items-center gap-3"
        ),
        style: {
          background: "#FFFFFF",
          color: "#000000",
        },
      }}
      style={
        {
          "--normal-bg": "#FFFFFF",
          "--normal-text": "#000000",
          "--normal-border": "#E4E4E7", // zinc-200
          "--border-radius": "16px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
