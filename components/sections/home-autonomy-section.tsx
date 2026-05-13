"use client"

import Image from "next/image"
import type { HomeAutonomySectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"

type Props = HomeAutonomySectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const ACCENT_SWATCHES = ["#754390", "#EC491E", "#8C7F1F", "#013662"] as const

/** Light frosted glass — transparent tint + moderate blur (reads natural in browser vs Figma’s 90px). */
const STAT_GLASS_CLASS = cn(
  "bg-[rgba(248,245,239,0.22)] backdrop-blur-[18px] backdrop-saturate-[1.2]",
  "[-webkit-backdrop-filter:blur(18px)_saturate(1.2)]",
  "[box-shadow:0_2px_14px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.55)]",
  "dark:bg-[rgba(255,255,255,0.08)] dark:[box-shadow:0_2px_14px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.12)]",
)

/** Intrinsic asset ratio (Figma frame 825×620). Display width scales up in layout. */
const IPAD_W = 2048
const IPAD_H = 1024

const CORNER_POSITIONS = [
  "left-0 top-[4%] z-20 w-[min(46%,10rem)] -translate-x-2 sm:-translate-x-6 sm:w-[11rem] md:w-[12rem] lg:w-[18rem]",
  "right-0 top-[4%] z-20 w-[min(46%,10rem)] translate-x-2 sm:translate-x-6 sm:w-[11rem] md:w-[12rem] lg:w-[18rem]",
  "left-0 bottom-[22%] z-20 w-[min(46%,10rem)] -translate-x-2 sm:-translate-x-6 sm:bottom-[20%] sm:w-[11rem] md:w-[12rem] lg:w-[18rem]",
  "right-0 bottom-[22%] z-20 w-[min(46%,10rem)] translate-x-2 sm:translate-x-6 sm:bottom-[20%] sm:w-[11rem] md:w-[12rem] lg:w-[18rem]",
] as const

function StatCard({
  title,
  statText,
  description,
  accent,
  positionClass,
}: {
  title: string
  statText: string
  description: string
  accent: string
  positionClass: string
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-xl p-3 sm:rounded-2xl sm:p-4 bg-foreground text-background",
        // STAT_GLASS_CLASS,
        positionClass,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] leading-tight sm:text-lg">
          {title}
        </p>
        <span
          className="mt-0.5 size-2 shrink-0 rounded-sm sm:size-2.5"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
      </div>
      {statText ? (
        <p className="mt-1.5 text-lg leading-none tracking-tight sm:text-xl md:text-6xl">
          {statText}
        </p>
      ) : null}
      {description ? (
        <p className="mt-2 inline-block border border-[#0000004D] rounded-full px-3 py-0.5 text-[10px] sm:text-xs">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default function HomeAutonomySection({
  title,
  stats,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const cornerStats = stats?.slice(0, 4) ?? []
  const overflowStats = stats?.slice(4) ?? []

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn(
        "bg-[#F2EFE8] text-foreground dark:bg-zinc-950",
        className,
      )}
    >
      <div className="flex w-full flex-col items-center">
        <div className="relative w-full pb-6 pt-4 sm:pb-10 sm:pt-8">
          {/* Wrapper matches iPad width so corner cards anchor to device edges */}
          <div className="relative mx-auto w-full max-w-[min(100%,min(98vw,1280px))]">
            {cornerStats.map((stat, index) => {
              const pos = CORNER_POSITIONS[index]
              if (!pos) return null
              return (
                <StatCard
                  key={`corner-stat-${index}`}
                  title={t(stat.title)}
                  statText={t(stat.statText)}
                  description={t(stat.description)}
                  accent={ACCENT_SWATCHES[index % ACCENT_SWATCHES.length]}
                  positionClass={pos}
                />
              )
            })}

            <div className="relative z-10 flex justify-center">
              <Image
                src="/ipadpro.png"
                alt="IPAD"
                width={2048}
                height={1024}
                className="h-auto w-full max-w-full select-none object-contain drop-shadow-xl"
              />
            </div>
          </div>
          {overflowStats.length > 0 ? (
            <ul className="relative z-10 mt-6 flex flex-wrap justify-center gap-3 px-2">
              {overflowStats.map((stat, i) => (
                <li
                  key={`overflow-${i}`}
                  className={cn(
                    "list-none rounded-xl px-4 py-3 text-center",
                    STAT_GLASS_CLASS,
                  )}
                >
                  <p className="text-xs text-muted-foreground">{t(stat.title)}</p>
                  <p className="mt-1 text-6xl font-bold">{t(stat.statText)}</p>
                  {t(stat.description) ? (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {t(stat.description)}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          {titleText ? (
            <div className="relative z-20 -mt-10 w-full px-2 sm:-mt-32">
              <div className="rounded-2xl bg-background px-4 py-5 text-center shadow-md sm:rounded-3xl sm:px-10 sm:py-8 lg:px-14 lg:py-10">
                <p className="text-balance max-w-7xl mx-auto font-semibold leading-tight tracking-tight text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[60px] xl:leading-[1.08]">
                  {titleText}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  )
}
