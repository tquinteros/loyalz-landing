import { Skeleton } from "@/components/ui/skeleton"

/** Loading state for the full-page section editor. */
export function PageEditorSkeleton() {
  return (
    <div className="-m-4 flex min-h-[calc(100dvh-3.5rem)] flex-col md:-m-6">
      <div className="flex items-center justify-between gap-3 border-b bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-md" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      <div className="grid flex-1 min-h-0 grid-cols-1 gap-0 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
        <aside className="border-b p-4 lg:border-b-0 lg:border-r">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </aside>

        <div className="p-6">
          <div className="mx-auto max-w-2xl space-y-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
