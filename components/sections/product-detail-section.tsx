"use client"

import { SectionWrapper } from "./section-wrapper"
import type { ProductDetailSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"

type Props = ProductDetailSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const accentColor = (hex?: string) => hex?.trim() || "#754390"

export default function ProductDetailSection({
  label,
  title,
  details,
  backgroundColor,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const labelText = t(label)
  const titleText = t(title)
  const color = accentColor(backgroundColor)

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      surfaceColor={backgroundColor ?? null}
      className={cn("text-foreground", className)}
    >
      <div className="flex flex-col gap-10 lg:gap-14">
        {/* Header */}
        <div className="flex flex-col px-0 lg:px-16 py-0 lg:py-16 gap-5 lg:gap-6">
          {labelText ? (
            <div className="flex w-fit items-center gap-2 rounded-[5px] border border-foreground/30 px-3 py-2">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect width="10" height="10" rx="2" fill="#F8F5EF" />
              </svg>
              <span className="text-xs font-semibold tracking-wider">
                {labelText}
              </span>
            </div>
          ) : null}

          {titleText ? (
            <h2 className="text-[32px] font-bold leading-none sm:text-[44px] lg:text-[56px]">
              {titleText}
            </h2>
          ) : null}
        </div>

        {/* Stats grid — 3 per row on desktop */}
        {details && details.length > 0 ? (
          <dl className="grid my-24 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {details.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-[24px] bg-foreground p-6 sm:rounded-[28px] sm:p-8"
              >
                <dt
                  className="text-[48px] font-bold leading-none tabular-nums sm:text-[64px] lg:text-[80px]"
                  style={{ color }}
                >
                  {item.stat}
                </dt>
                <dd
                  className="text-base font-normal leading-snug lg:text-[18px]"
                  style={{ color }}
                >
                  {t(item.description)}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </SectionWrapper>
  )
}
