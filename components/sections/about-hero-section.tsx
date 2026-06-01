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
  images: _images,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const descriptionText = t(description)
  // const validImages = (images ?? []).filter(Boolean)

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn(
        "flex flex-col overflow-x-clip bg-card pb-0 pt-16 text-card-foreground sm:pt-24 pb-0!",
        className,
      )}
      innerClassName="flex flex-1 flex-col px-0"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-5 text-center lg:px-16">
        {titleText && (
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl lg:text-[80px] lg:leading-[1.05]">
            {titleText}
          </h1>
        )}
        {descriptionText && (
          <p className="mt-6 max-w-3xl text-pretty text-base sm:text-[18px] sm:leading-none">
            {descriptionText}
          </p>
        )}
      </div>

      <div className="relative mt-10 w-full sm:mt-16">
        <Image
          src="/aboutushero.png"
          alt={titleText || "About"}
          width={2529}
          height={1008}
          priority
          className="block h-auto w-full"
          sizes="100vw"
        />
      </div>

      {/* {validImages.length > 0 && (
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
      )} */}
    </SectionWrapper>
  )
}
