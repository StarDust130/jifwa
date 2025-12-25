import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProject() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header Skeleton */}
      <div className="h-14 border-b border-zinc-200 bg-white px-6 flex items-center justify-between">
        <div className="flex gap-2 w-1/3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Timeline Skeleton */}
        <div className="lg:col-span-8 space-y-8 pl-4 border-l border-zinc-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="pl-8 relative">
              <Skeleton className="absolute left-[-5px] top-0 w-3 h-3 rounded-full" />
              <Skeleton className="h-4 w-20 mb-3" />
              <div className="p-6 bg-white border border-zinc-100 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
