"use client"

import Image from "next/image"
import type { AboutStatsSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
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
  const statItems = stats ?? []

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn("bg-background text-foreground", className)}
    >
      <div className="flex flex-col items-center text-center">
        {titleText && (
          <h2 className="text-balance max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[56px] lg:leading-[1.1]">
            {titleText}
          </h2>
        )}

        {descriptionText && (
          <p className="mt-6 max-w-3xl text-pretty text-base font-normal leading-relaxed text-foreground sm:text-[18px]">
            {descriptionText}
          </p>
        )}

        {image && (
          <div className="relative mt-10 aspect-16/6 w-full overflow-hidden rounded-[32px] bg-muted">
            <Image
              src={image}
              alt={titleText || "Stats"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        )}

        {statItems.length > 0 && (
          <dl className="-mt-16 z-20 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {statItems.map((item, i) => {
              const labelText = t(item.statLabel)
              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center rounded-[24px] bg-card px-4 py-8 text-center sm:px-6"
                >
                  <dt className="sr-only">{labelText}</dt>
                  <dd className="text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl lg:text-[56px] lg:leading-none">
                    {item.stat}
                  </dd>
                  {labelText && (
                    <p className="mt-3 text-pretty text-lg font-semibold text-card-foreground sm:text-[24px] sm:leading-snug">
                      {labelText}
                    </p>
                  )}
                </div>
              )
            })}
          </dl>
        )}
      </div>
    </SectionWrapper>
  )
}
