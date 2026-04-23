import { Skeleton } from "@/components/ui/skeleton"

/** Generic skeleton used while the DB-driven page is streaming in. */
export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-16 py-16 sm:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <Skeleton className="mx-auto h-4 w-40" />
          <Skeleton className="mx-auto h-12 w-full" />
          <Skeleton className="mx-auto h-6 w-3/4" />
          <div className="flex justify-center gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-6 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    </div>
  )
}
