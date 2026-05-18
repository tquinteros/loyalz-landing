"use client"

import type { AboutSeparatorSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"

type Props = AboutSeparatorSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function AboutSeparatorSection({
  title,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={className}>
      <div className="flex items-center gap-6">
        <div className="h-px flex-1 bg-border" />
        {titleText && (
          <p className="shrink-0 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {titleText}
          </p>
        )}
        <div className="h-px flex-1 bg-border" />
      </div>
    </SectionWrapper>
  )
}
