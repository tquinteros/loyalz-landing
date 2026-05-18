"use client"

import Image from "next/image"
import type { AboutHeroSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
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
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {titleText && (
          <h1 className="text-balance text-3xl font-bold tracking-tight text-background sm:text-5xl lg:text-[80px] lg:leading-[1.05]">
            {titleText}
          </h1>
        )}
        {descriptionText && (
          <p className="mt-6 max-w-3xl text-pretty text-base text-background sm:text-[18px] sm:leading-relaxed">
            {descriptionText}
          </p>
        )}

        {validImages.length > 0 && (
          <div className="mt-12 flex w-full flex-wrap items-end justify-center gap-4 lg:flex-nowrap lg:gap-0 lg:[&>*+*]:-ml-10">
            {validImages.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-2xl bg-muted shadow-lg",
                  i === Math.floor(validImages.length / 2)
                    ? "h-56 w-40 sm:h-72 sm:w-48"
                    : "h-44 w-52 sm:h-56 sm:w-64",
                )}
                style={{ zIndex: i }}
              >
                <Image
                  src={src}
                  alt={titleText || "About"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 40vw, 280px"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
