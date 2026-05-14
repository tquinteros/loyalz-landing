import { Skeleton } from "@/components/ui/skeleton"

export const BlogsSkeleton = () => {
  return (
    <section className="relative w-full bg-foreground py-16 text-background sm:py-24">
      <div className="relative px-5 lg:px-16">
        <div className="max-w-2xl space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-full max-w-md sm:h-12" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-4/5 max-w-md" />
        </div>

        <div className="mt-14 space-y-4 sm:mt-16">
          <Skeleton className="h-7 w-48 sm:h-8" />
          <div className="mt-8 grid w-full grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-10 xl:gap-12">
            <div className="min-w-0 space-y-5">
              <Skeleton className="aspect-[16/10] w-full rounded-3xl" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-8 w-full max-w-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex min-w-0 w-full flex-col gap-8 border-t border-background/15 pt-8 lg:border-t-0 lg:border-l lg:pl-8 xl:pl-12">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex w-full items-start gap-4 sm:gap-5">
                  <Skeleton className="size-24 shrink-0 rounded-2xl sm:size-28 lg:size-32 xl:size-36" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-0.5">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-4 sm:mt-20">
          <Skeleton className="h-7 w-56 sm:h-8" />
          <ul className="mt-8 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 m-0">
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="min-w-0">
                <div className="overflow-hidden rounded-2xl border border-background/20 bg-transparent shadow-sm">
                  <Skeleton className="aspect-[16/10] w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export const BlogsDetailSkeleton = () => {
  return (
    <div className="container mx-auto max-w-3xl px-5 py-10 lg:px-0">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-72" />
      </div>
    </div>
  )
}
