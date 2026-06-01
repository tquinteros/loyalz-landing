"use client"

import Image from "next/image"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ProductHowItWorksSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { usePathname } from "next/navigation"
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
  "bottom-20 left-[16%]",
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
  const pathname = usePathname()
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
          <h2
            style={{ color: backgroundColor === '#DBC5E8' ? '#754390' : '#000000' }}
            className="mx-auto max-w-5xl text-balance text-center text-3xl font-bold tracking-tight text-background sm:text-4xl lg:text-6xl">
            {titleText}
          </h2>
        ) : null}

        {urls.length > 0 ? (
          <div
            className="relative mx-auto mt-12 flex min-h-[clamp(280px,58vw,505px)] items-center justify-center overflow-visible sm:mt-16 lg:min-h-[685px]"
          >
            <div className="flex relative items-center justify-center overflow-visible">
              {urls.map((src, i) => {
                const delta = signedDistance(i, center, n)
                const absDelta = Math.abs(delta)
                const isCenter = absDelta === 0

                const rotate = isCenter ? 0 : delta < 0 ? -8 : 8
                const opacity = isCenter ? 1 : absDelta === 1 ? 0.88 : 0.5

                return (
                  <motion.div
                    key={`${src}-${i}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity, y: 0, rotate }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "relative shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-neutral-100",
                      isCenter
                        ? "h-[clamp(252px,60vw,505px)] w-[clamp(140px,34vw,280px)] lg:h-[685px] lg:w-[380px]"
                        : "h-[clamp(208px,52vw,420px)] w-[clamp(114px,28vw,230px)] lg:h-[566px] lg:w-[310px]",
                      "-ml-16 first:ml-0 sm:-ml-20 md:-ml-24 lg:-ml-[100px]",
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
                      sizes={
                        isCenter
                          ? "(max-width: 1024px) 34vw, 380px"
                          : "(max-width: 1024px) 28vw, 310px"
                      }
                      className="object-cover"
                    />
                  </motion.div>
                )
              })}
              {
                pathname === '/club' && (
                  <div className="absolute top-12 bg-foreground right-8 z-40 w-fit p-2 rounded-[6px]">
                    <Image src="/products//club/qr.svg" alt="QR" width={72} height={72} />
                  </div>
                )
              }
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
                    "pointer-events-none absolute z-40 flex items-center gap-3 rounded-xl border border-background/8 bg-foreground px-4 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.14)]",
                    BADGE_POSITIONS[idx],
                  )}
                >
                  {item.stat ? (
                    <span
                      style={{ color: backgroundColor === '#DBC5E8' ? '#754390' : '#000000' }}
                      className="text-xl font-bold leading-none text-background sm:text-5xl">
                      {item.stat}
                    </span>
                  ) : null}
                  {statTitle ? (
                    <span
                      style={{ color: backgroundColor === '#DBC5E8' ? '#754390' : '#000000' }}
                      className="text-xs max-w-[16rem] leading-none text-background/60 sm:text-sm">
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
