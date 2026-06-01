"use client"

import Image from "next/image"
import type { ProductInformationSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"
import { cn } from "@/lib/utils"

type Props = ProductInformationSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const DEFAULT_PANEL_BG = "#E5E0EF"

export default function ProductInformationSection({
  title,
  description,
  image,
  backgroundColor,
  backgroundImage,
  className,
}: Props) {
  const t = useT()

  const panelBg = backgroundColor?.trim() || DEFAULT_PANEL_BG
  const titleText = t(title)
  const descriptionText = t(description)
  const imageSrc = image?.trim()

  if (!titleText && !descriptionText && !imageSrc) return null

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn("bg-foreground text-background", className)}
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-0">
        <div
          className="flex min-h-[280px] flex-col justify-end rounded-[28px] p-8 sm:min-h-[360px] sm:rounded-[32px] sm:p-10 lg:col-span-7 lg:min-h-[600px] lg:p-12"
          style={{ backgroundColor: panelBg }}
        >
          <div className="space-y-4">
            {titleText ? (
              <h2 className="max-w-xl text-2xl font-bold leading-none tracking-tight text-background sm:text-3xl lg:text-[56px] lg:leading-[1.08]">
                {titleText}
              </h2>
            ) : null}
            {descriptionText ? (
              <p className="max-w-lg text-lg leading-none text-background">
                {descriptionText}
              </p>
            ) : null}
          </div>
        </div>

        <div className="relative min-h-[240px] overflow-hidden rounded-[28px] sm:min-h-[360px] sm:rounded-[32px] lg:col-span-5 lg:min-h-[420px]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={titleText || ""}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  )
}
