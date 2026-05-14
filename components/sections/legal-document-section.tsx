"use client"

import { SectionWrapper } from "./section-wrapper"
import { ContentRenderer } from "@/components/blogs/content-renderer"
import { useLanguage, useT } from "@/providers/language-provider"
import type { LegalDocumentSectionProps } from "@/lib/types/Pages"

type Props = LegalDocumentSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function LegalDocumentSection({
  title,
  description,
  body,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const { locale } = useLanguage()
  const doc = body?.[locale] ?? body?.es ?? body?.en ?? null
  const intro = t(description)?.trim()

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={className}
      innerClassName="mx-auto max-w-3xl"
    >
      <header className="space-y-4 text-background">
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t(title)}
        </h1>
        {intro ? (
          <p className="text-balance text-base leading-relaxed text-background/85 sm:text-lg">
            {t(description)}
          </p>
        ) : null}
      </header>
      <div className="mt-10 max-w-none text-background">
        <ContentRenderer content={doc} className="text-background" />
      </div>
    </SectionWrapper>
  )
}
