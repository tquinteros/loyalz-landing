"use client"

import type { CSSProperties } from "react"
import Image from "next/image"
import type { ProductAiInformationSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"
import { cn } from "@/lib/utils"

type Props = ProductAiInformationSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const DEFAULT_BG = "#B2C8D9"
const DEFAULT_TEXT = "#013662"

export default function ProductAiInformationSection({
  label,
  title,
  description,
  bottomDescription,
  image,
  backgroundColor,
  textColor,
  backgroundImage,
  className,
}: Props) {
  const t = useT()

  const bg = backgroundColor?.trim() || DEFAULT_BG
  const fg = textColor?.trim() || DEFAULT_TEXT
  const labelText = t(label)
  const titleText = t(title)
  const descriptionText = t(description)
  const bottomText = t(bottomDescription)
  const imageSrc = image?.trim()

  if (!labelText && !titleText && !descriptionText && !bottomText && !imageSrc) {
    return null
  }

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      surfaceColor={bg}
      className={cn("py-12 sm:py-16 lg:py-20", className)}
      innerClassName="text-[var(--product-ai-info-fg)]"
    >
      <div
        className="grid grid-cols-12 items-stretch gap-8 lg:gap-10"
        style={
          {
            "--product-ai-info-fg": fg,
            color: fg,
          } as CSSProperties
        }
      >
        <div className="col-span-12 flex min-h-[280px] flex-col justify-between gap-10 lg:col-span-6 lg:min-h-[576px] lg:gap-12">
          <div className="space-y-5 sm:space-y-6">
            {labelText ? (
              <div
                className="flex w-fit items-center gap-2 rounded border px-3 py-2"
                style={{ borderColor: fg }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect width="10" height="10" rx="2" fill={fg} />
                </svg>
                <p className="text-xs tracking-wider sm:text-sm">
                  {labelText}
                </p>
              </div>
            ) : null}

            {titleText ? (
              <h2 className="max-w-xl text-3xl font-bold leading-none tracking-tight sm:text-4xl lg:text-[56px]">
                {titleText}
              </h2>
            ) : null}

            {descriptionText ? (
              <p className="max-w-lg text-base leading-none sm:text-lg lg:leading-none">
                {descriptionText}
              </p>
            ) : null}
          </div>

          {bottomText ? (
            <p className="max-w-xl text-lg font-bold leading-none sm:text-xl lg:text-[32px] lg:leading-none">
              {bottomText}
            </p>
          ) : null}
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="relative aspect-620/576 w-full min-h-[280px] overflow-hidden rounded-[28px] sm:rounded-[32px] lg:aspect-auto lg:h-full lg:min-h-[576px]">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={titleText || labelText || ""}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : null}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
