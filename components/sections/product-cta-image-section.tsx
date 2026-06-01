"use client"

import type { ProductCtaImageSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"

type Props = ProductCtaImageSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function ProductCtaImageSection({
  title,
  label,
  labelBackgroundColor,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const labelText = t(label)

  return (
    <div
    style={{ backgroundColor: labelBackgroundColor ?? "#DBC5E8" }}
    className="p-4 rounded-[32px]">
      <SectionWrapper
        backgroundImage={backgroundImage}
        className={`min-h-[480px] sm:min-h-[640px] rounded-xl overflow-hidden${className ? ` ${className}` : ""}`}
        innerClassName="absolute inset-0 flex items-center justify-center px-5 lg:px-16"
        backgroundOverlayClassName="bg-background/50"
      >
        <div className="flex flex-col items-center gap-6 text-center">
          {titleText ? (
            <div className="relative">
              {labelText ? (
                <span
                  className="-rotate-20 absolute -top-12 left-[60%] -translate-x-1/2 inline-block rounded-[8px] px-5 py-2 text-3xl font-semibold text-background shadow"
                  style={{ backgroundColor: labelBackgroundColor ?? "#DBC5E8" }}
                >
                  {labelText}
                </span>
              ) : null}
              <h2 className="max-w-2xl text-2xl font-semibold leading-14 text-foreground sm:text-5xl">
                {titleText}
              </h2>
            </div>
          ) : null}
        </div>
      </SectionWrapper>
    </div>
  )
}
