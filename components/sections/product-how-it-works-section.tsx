"use client"

import Image from "next/image"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ProductHowItWorksSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"

type Props = ProductHowItWorksSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

function signedDistance(index: number, current: number, total: number) {
  if (total <= 1) return 0
  let delta = index - current
  const half = total / 2
  if (delta > half) delta -= total
  if (delta < -half) delta += total
  return delta
}

function defaultCenterIndex(total: number) {
  if (total <= 0) return 0
  return Math.floor((total - 1) / 2)
}

const BADGE_POSITIONS = [
  "bottom-6 left-[8%]",
  "bottom-14 right-[8%]",
  "top-[10%] right-[6%]",
  "top-[10%] left-[6%]",
] as const

export default function ProductHowItWorksSection({
  title,
  backgroundColor,
  images,
  stats,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)

  const urls = useMemo(
    () =>
      Array.isArray(images)
        ? images.map((s) => String(s).trim()).filter(Boolean)
        : [],
    [images],
  )

  const n = urls.length
  const center = defaultCenterIndex(n)

  const visibleStats = (stats ?? []).slice(0, 4)

  return (
    <section
      className={cn(
        "relative w-full overflow-visible py-16 sm:py-24",
        className,
      )}
      style={backgroundColor?.trim() ? { backgroundColor } : undefined}
    >
      <div className="px-5 lg:px-16">
        {titleText ? (
          <h2 className="mx-auto max-w-3xl text-balance text-center text-3xl font-bold tracking-tight text-background sm:text-4xl lg:text-5xl">
            {titleText}
          </h2>
        ) : null}

        {urls.length > 0 ? (
          <div className="relative mx-auto mt-12 flex items-center justify-center overflow-visible sm:mt-16"
            style={{ minHeight: "clamp(320px, 45vh, 520px)" }}
          >
            <div className="flex items-center justify-center overflow-visible">
              {urls.map((src, i) => {
                const delta = signedDistance(i, center, n)
                const absDelta = Math.abs(delta)
                const isCenter = absDelta === 0

                const scale = isCenter ? 1 : absDelta === 1 ? 0.82 : 0.68
                const rotate = isCenter ? 0 : delta < 0 ? -8 : 8
                const opacity = isCenter ? 1 : absDelta === 1 ? 0.88 : 0.5

                return (
                  <motion.div
                    key={`${src}-${i}`}
                    initial={{ opacity: 0, y: 24, scale: 0.78 }}
                    animate={{ opacity, y: 0, scale, rotate }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "relative shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-neutral-100 aspect-2/3",
                      "h-[clamp(260px,38vh,420px)] w-auto",
                      "-ml-20 first:ml-0 sm:-ml-24 md:-ml-28",
                      isCenter
                        ? "z-30 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.35)]"
                        : absDelta === 1
                          ? "z-20 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.2)]"
                          : "z-10",
                    )}
                  >
                    <Image
                      src={src}
                      alt=""
                      priority={isCenter}
                      fill
                      sizes="(max-width: 768px) 55vw, 340px"
                      className="object-cover"
                    />
                  </motion.div>
                )
              })}
            </div>

            {visibleStats.map((item, idx) => {
              const statTitle = t(item.title)
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: 0.15 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "pointer-events-none absolute z-40 flex flex-col gap-0.5 rounded-xl border border-background/8 bg-foreground px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.14)]",
                    BADGE_POSITIONS[idx],
                  )}
                >
                  {item.stat ? (
                    <span className="text-xl font-bold leading-none text-background sm:text-2xl">
                      {item.stat}
                    </span>
                  ) : null}
                  {statTitle ? (
                    <span className="text-xs leading-none text-background/60 sm:text-sm">
                      {statTitle}
                    </span>
                  ) : null}
                </motion.div>
              )
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}
