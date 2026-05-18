"use client"

import Image from "next/image"
import type { AboutHeroSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"

type Props = AboutHeroSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function AboutHeroSection({
  title,
  description,
  images,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const descriptionText = t(description)
  const validImages = (images ?? []).filter(Boolean)

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={className}>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          {titleText && (
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {titleText}
            </h1>
          )}
          {descriptionText && (
            <p className="text-lg text-muted-foreground">{descriptionText}</p>
          )}
        </div>

        {validImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {validImages.slice(0, 4).map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative aspect-square overflow-hidden rounded-xl bg-muted"
              >
                <Image
                  src={src}
                  alt={titleText || "About"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
