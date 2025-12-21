"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center font-sans text-black">
      <div className="flex flex-col items-center gap-4">
        {/* Fast Rotation: 600ms instead of 1s (default) */}
        <Loader2
          className="animate-[spin_0.6s_linear_infinite] text-black"
          size={32}
          strokeWidth={3}
        />

        <div className="flex flex-col items-center">
          <span className="text-xs font-black uppercase tracking-[0.4em] italic">
            Loading
          </span>

          {/* Faster Progress Line: 0.8s cycle */}
          <div className="w-16 h-[2.5px] bg-gray-100 mt-3 overflow-hidden relative">
            <div className="absolute inset-0 bg-black w-1/2 animate-[loading_0.8s_infinite_linear]" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
