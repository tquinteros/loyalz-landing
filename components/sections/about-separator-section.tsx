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
    <SectionWrapper backgroundImage={backgroundImage} className={`${className} bg-background`}>
      <div className="flex items-center justify-center gap-6 bg-foreground py-10 rounded-3xl">
        {titleText && (
          <p className="shrink-0 text-lg sm:text-[32px] font-bold text-background">
            {titleText}
          </p>
        )}
      </div>
    </SectionWrapper>
  )
}
