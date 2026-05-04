"use client"

import Image from "next/image"
import type { NotificationClubSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { cn } from "@/lib/utils"

type Props = NotificationClubSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

/**
 * Positions are relative to the phone stack wrapper (~same width as the device),
 * so badges stay over/near the handset — not the full grid cell (which was pushing
 * `left-0` badges far from a `ml-auto` phone).
 */
const BADGE_POSITIONS = [
  "left-[4%] right-[4%] top-[5%] z-20 max-w-none sm:left-[6%] sm:right-[6%]",
  "left-1 right-3 top-[30%] z-30 sm:left-0 sm:right-[16%] sm:top-[32%]",
  "bottom-[16%] left-[3%] right-[3%] z-20 sm:bottom-[18%]",
] as const

function GlassBadge({
  brand,
  message,
  positionClass,
}: {
  brand: string
  message: string
  positionClass: string
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute max-w-full rounded-2xl border border-white/40 bg-[#754390]/40 p-3 shadow-lg backdrop-blur-md sm:p-3.5",
        positionClass,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            className="size-8 shrink-0 rounded-lg bg-foreground/60 ring-1 ring-foreground/40"
            aria-hidden
          />
          <span className="truncate text-[11px] font-bold uppercase tracking-wide text-foreground sm:text-xs">
            {brand}
          </span>
        </div>
        <span className="shrink-0 text-[10px] text-foreground">ahora</span>
      </div>
      <p className="mt-2 text-left text-[13px] leading-snug text-foreground sm:text-sm">
        {message}
      </p>
    </div>
  )
}

export default function NotificationClubSection({
  title,
  description,
  badges,
  backgroundImage,
  className,
}: Props) {
  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn(
        "bg-[#DBC5E8] pt-16 pb-0 sm:pt-24 sm:pb-0",
        className,
      )}
    >
      <div className="overflow-x-hidden rounded-[28px] bg-[#DBC5E8] px-5 pt-10 pb-0 sm:px-8 md:px-10 lg:rounded-[32px] lg:px-14 lg:pt-14">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12 xl:gap-16">
          {/* Left: copy */}
          <div className="min-w-0 space-y-4 self-start lg:space-y-5">
            {title ? (
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-chart-5 sm:text-4xl lg:text-6xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="max-w-xl text-base leading-relaxed text-chart-5 sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          <div className="flex min-h-[420px] w-full flex-col justify-end sm:min-h-[460px] lg:min-h-full lg:items-end">
            <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[380px] lg:mx-0 lg:max-w-[420px]">
              {badges.map((badge, index) => (
                <GlassBadge
                  key={`${badge.brand}-${index}`}
                  brand={badge.brand}
                  message={badge.message}
                  positionClass={BADGE_POSITIONS[index % BADGE_POSITIONS.length]}
                />
              ))}

              <div className="relative z-0 mt-auto flex w-full justify-end">
                <Image
                  src="/club/mobile.png"
                  alt=""
                  width={520}
                  height={1040}
                  className="pointer-events-none h-auto max-h-[min(72vh,620px)] w-full max-w-[360px] select-none object-contain object-bottom sm:max-h-[min(70vh,640px)] sm:max-w-[380px] lg:max-h-[min(78vh,680px)] lg:max-w-[420px]"
                  sizes="(max-width: 1024px) 360px, 420px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
