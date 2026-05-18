"use client"

import Image from "next/image"
import type { AboutStatsSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"

type Props = AboutStatsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function AboutStatsSection({
  title,
  description,
  image,
  stats,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const descriptionText = t(description)

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={className}>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            {titleText && (
              <h2 className="text-3xl font-bold tracking-tight">{titleText}</h2>
            )}
            {descriptionText && (
              <p className="text-muted-foreground">{descriptionText}</p>
            )}
          </div>

          {(stats ?? []).length > 0 && (
            <div className="grid grid-cols-2 gap-6">
              {stats.map((item, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-4xl font-bold">{item.stat}</p>
                  <p className="text-sm text-muted-foreground">
                    {t(item.statLabel)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {image && (
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <Image
              src={image}
              alt={titleText || "Stats"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
