import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="w-full bg-[#FAFAFA] p-4 md:p-6 h-[600px]">
      <div className="max-w-7xl mx-auto mb-6">
        <Skeleton className="h-8 w-32 bg-zinc-200" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 h-[500px]">
        {/* Main Card Skeleton */}
        <div className="lg:col-span-8 h-full">
          <div className="h-full w-full rounded-2xl border border-zinc-200 bg-white p-8 flex flex-col items-center justify-center space-y-6">
            <Skeleton className="h-24 w-24 rounded-3xl bg-zinc-100" />
            <div className="space-y-2 text-center">
              <Skeleton className="h-6 w-48 mx-auto bg-zinc-100" />
              <Skeleton className="h-4 w-64 mx-auto bg-zinc-100" />
            </div>
            <Skeleton className="h-12 w-48 rounded-xl bg-zinc-100" />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-4 h-full">
          <div className="h-full w-full rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-4 w-24 bg-zinc-100" />
              <Skeleton className="h-4 w-4 rounded-full bg-zinc-100" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg bg-zinc-100" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-full bg-zinc-100" />
                    <Skeleton className="h-2 w-1/2 bg-zinc-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
