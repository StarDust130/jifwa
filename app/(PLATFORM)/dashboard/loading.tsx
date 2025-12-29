import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full  min-h-screen p-4 md:p-8 font-sans">
      {/* 1. Header Skeleton */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-48 bg-zinc-200" />
            <Skeleton className="h-6 w-16 rounded-full bg-zinc-200" />
          </div>
          <Skeleton className="h-4 w-64 bg-zinc-200/60" />
        </div>
        <Skeleton className="h-12 w-40 rounded-xl bg-zinc-200" />
      </div>

      {/* 2. Grid Layout (Main + Sidebar) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Stat Cards & Recent Activity (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Stats Row Placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-zinc-100 p-6 rounded-2xl shadow-sm space-y-4"
              >
                <Skeleton className="h-12 w-12 rounded-xl bg-zinc-100" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24 bg-zinc-100" />
                  <Skeleton className="h-3 w-32 bg-zinc-100/60" />
                </div>
              </div>
            ))}
          </div>

          {/* Activity Section Placeholder */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <Skeleton className="h-5 w-32 bg-zinc-200" />
              <Skeleton className="h-4 w-12 bg-zinc-100" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-zinc-200 rounded-2xl p-5 h-48 flex flex-col justify-between"
                >
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-20 rounded-lg bg-zinc-100" />
                    <Skeleton className="h-4 w-4 rounded-full bg-zinc-100" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-zinc-50" />
                    <Skeleton className="h-4 w-2/3 bg-zinc-50" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full bg-zinc-100 mt-4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Info (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="h-full w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-5 w-28 bg-zinc-200" />
              <Skeleton className="h-4 w-4 rounded-full bg-zinc-100" />
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-xl bg-zinc-100 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-3/4 bg-zinc-100" />
                    <Skeleton className="h-2 w-1/2 bg-zinc-100/60" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Graphic Placeholder */}
            <div className="mt-12 p-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <Skeleton className="h-24 w-full rounded-xl bg-white" />
              <Skeleton className="h-3 w-1/2 mx-auto mt-4 bg-zinc-200/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
