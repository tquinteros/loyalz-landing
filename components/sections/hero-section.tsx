"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CTA, HeroSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"

type Props = HeroSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

type LegacyHeroPayload = Props & {
  primaryCta?: CTA
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

export default function HeroSection(props: Props) {
  const { title, backgroundImage, className } = props
  const legacy = props as LegacyHeroPayload
  const t = useT()

  const titleText = t(title)
  const ctaLabel =
    t(legacy.ctaLabel).trim() ||
    t(legacy.primaryCta?.label).trim() ||
    t({ es: "Demo Gratis", en: "Free Demo" })
  const ctaHref =
    legacy.ctaHref?.trim() || legacy.primaryCta?.href?.trim() || "#"

  const secondaryCtaLabel = t(legacy.secondaryCta?.label).trim()
  const secondaryCtaHref = legacy.secondaryCta?.href?.trim() ?? ""
  const showSecondaryCta = Boolean(secondaryCtaLabel && secondaryCtaHref)

  const urls = useMemo(() => {
    const list = Array.isArray(legacy.images)
      ? legacy.images.map((s) => String(s).trim()).filter(Boolean)
      : []
    return list
  }, [legacy.images])

  const n = urls.length
  const center = defaultCenterIndex(n)

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn(
        "flex h-[calc(113dvh-5rem)] min-h-[calc(113dvh-5rem)] max-h-[calc(113dvh-5rem)] flex-col overflow-hidden bg-background py-0 text-foreground sm:py-0",
        className,
      )}
      innerClassName="flex h-full min-h-0 flex-1 flex-col px-5 lg:px-16"
    >
      <header className="mx-auto max-w-7xl shrink-0 pt-6 text-center md:pt-10 lg:pt-12">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-7xl">
          {titleText}
        </h1>
      </header>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-visible py-2 md:py-4">
        <div className="flex w-full max-w-6xl items-center justify-center overflow-visible px-2 sm:max-w-7xl">
          {urls.map((src, i) => {
            const delta = signedDistance(i, center, n)
            const absDelta = Math.abs(delta)
            const isCenter = absDelta === 0

            const scale = isCenter ? 1 : absDelta === 1 ? 0.82 : 0.68
            const rotate = isCenter ? 0 : delta < 0 ? -6 : 6
            const opacity = isCenter ? 1 : absDelta === 1 ? 0.9 : 0.55

            return (
              <motion.div
                key={`${src}-${i}`}
                initial={{ opacity: 0, y: 20, scale: 0.78 }}
                animate={{ opacity, y: 0, scale, rotate }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/6 aspect-2/3",
                  "h-[min(46dvh,520px)] w-auto sm:h-[min(50dvh,560px)] md:h-[min(54dvh,600px)] lg:h-[min(58dvh,640px)]",
                  "-ml-24 first:ml-0 sm:-ml-28 md:-ml-32 lg:-ml-36 xl:-ml-40",
                  isCenter
                    ? "z-30 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.9)]"
                    : absDelta === 1
                      ? "z-20"
                      : "z-10",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  priority={isCenter}
                  fill
                  sizes="(max-width: 768px) 70vw, (max-width: 1024px) 45vw, 420px"
                  className="object-cover"
                />
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-center gap-3 pb-8 pt-2 md:gap-4 md:pb-12">
        <Button
          asChild
          variant="secondary"
          className="h-auto rounded-[10px] border-0 bg-foreground px-10 py-3.5 text-base font-semibold text-background shadow-none hover:bg-foreground/90"
        >
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
        {showSecondaryCta ? (
          <Button
            asChild
            variant="outline"
            className="h-auto rounded-[10px] border border-foreground bg-transparent px-10 py-3.5 text-base font-semibold text-foreground shadow-none hover:bg-foreground/10"
          >
            <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
          </Button>
        ) : null}
      </div>
    </SectionWrapper>
  )
}
