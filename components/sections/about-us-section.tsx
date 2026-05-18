"use client"

import Image from "next/image"
import type { AboutUsSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"

type Props = AboutUsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function AboutUsSection({
  title,
  description,
  articles,
  bottomLabel,
  images,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const descriptionText = t(description)
  const bottomLabelText = t(bottomLabel)
  const validImages = (images ?? []).filter(Boolean)

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={className}>
      <div className="space-y-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4">
            {titleText && (
              <h2 className="text-3xl font-bold tracking-tight">{titleText}</h2>
            )}
            {descriptionText && (
              <p className="text-muted-foreground">{descriptionText}</p>
            )}
          </div>

          {(articles ?? []).length > 0 && (
            <ul className="space-y-3">
              {articles.map((article, i) => {
                const text = t(article)
                if (!text) return null
                return (
                  <li
                    key={i}
                    className="rounded-lg border bg-muted/30 px-4 py-3 text-sm"
                  >
                    {text}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {validImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {validImages.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative aspect-video overflow-hidden rounded-xl bg-muted"
              >
                <Image
                  src={src}
                  alt={titleText || "About us"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}

        {bottomLabelText && (
          <p className="text-center text-sm text-muted-foreground">
            {bottomLabelText}
          </p>
        )}
      </div>
    </SectionWrapper>
  )
}
