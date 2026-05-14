import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function readingTimeLabel(
  minutes: number | null | undefined,
): string | null {
  if (minutes == null || !Number.isFinite(minutes)) return null
  const m = Math.round(minutes)
  if (m < 1) return null
  return `Lectura de ${m} min`
}

type BlogPostMetaRowProps = {
  category?: string | null
  readingTime?: number | null
  className?: string
}

export function BlogPostMetaRow({
  category,
  readingTime,
  className,
}: BlogPostMetaRowProps) {
  const rt = readingTimeLabel(readingTime)
  const cat = category?.trim()
  if (!cat && !rt) return null
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 text-background/70",
        className,
      )}
    >
      {cat ? (
        <Badge
          variant="outline"
          className="border-background/25 bg-background/10 font-medium rounded-[8px] normal-case text-background"
        >
          {cat}
        </Badge>
      ) : null}
      {rt ? <span className="text-xs font-bold sm:text-[14px]">{rt}</span> : null}
    </div>
  )
}

type ReadMoreLinkProps = {
  className?: string
}

export function BlogReadMoreHint({ className }: ReadMoreLinkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[16px] font-semibold text-background underline-offset-4",
        className,
      )}
    >
      Leer más
      <span aria-hidden className="text-[16px]transition-transform pt-0.5 group-hover:translate-x-0.5">
        {'>'}
      </span>
    </span>
  )
}
