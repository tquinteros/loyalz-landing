"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CTA, HeroSectionProps, LocalizedString } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"

type Props = HeroSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

type LegacyHeroPayload = Props & {
  primaryCta?: CTA
}

const TAG_COPIES = 4

type HeroTagCard =
  | {
      kind: "stat"
      label: LocalizedString
      value: LocalizedString
      detail?: LocalizedString
      className: string
      sizeClassName: string
      badge?: FloatingBadge
    }
  | {
      kind: "notification"
      sender: LocalizedString
      message: LocalizedString
      className: string
      sizeClassName: string
      badge?: FloatingBadge
    }

type FloatingBadge = {
  color: string
  className: string
}

const HERO_TAGS: HeroTagCard[] = [
  {
    kind: "stat",
    label: { es: "Calificación Promedio", en: "Average Rating" },
    value: { es: "4.8", en: "4.8" },
    detail: { es: "56 reseñas", en: "56 reviews" },
    className: "bg-[#F8F5EF33] text-foreground backdrop-blur-md",
    sizeClassName: "w-fit min-w-[230px]",
    badge: {
      color: "#8C7F1F",
      className: "left-full top-1/2 -translate-x-1/2 -translate-y-1/2",
    },
  },
  {
    kind: "stat",
    label: { es: "Ingresos por Fidelización", en: "Loyalty Revenue" },
    value: { es: "10.000US$", en: "US$10,000" },
    className: "bg-foreground text-background",
    sizeClassName: "w-fit min-w-[310px]",
    badge: {
      color: "#EC491E",
      className: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
    },
  },
  {
    kind: "notification",
    sender: { es: "AIR COFFEE", en: "AIR COFFEE" },
    message: {
      es: "👀 ¡Disfrutá un 50% de descuento en nuestro local hoy! ☕️",
      en: "👀 Enjoy 50% off at our store today! ☕️",
    },
    className: "bg-[#F8F5EF33] text-foreground backdrop-blur-md",
    sizeClassName: "w-[360px]",
  },
  {
    kind: "stat",
    label: { es: "Ticket Promedio", en: "Average Ticket" },
    value: { es: "$ 16", en: "$16" },
    className: "bg-foreground text-background",
    sizeClassName: "w-fit min-w-[230px]",
    badge: {
      color: "#754390",
      className: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
    },
  },
]

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

  const tagLoop = Array.from({ length: TAG_COPIES }, () => HERO_TAGS).flat()
  const tagDuration = Math.max(18, HERO_TAGS.length * 5)

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
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-25 w-screen -translate-x-1/2 -translate-y-1/2 overflow-hidden">
            <motion.ul
              className="flex w-max items-center gap-3 px-3 sm:gap-4 sm:px-4"
              animate={{ x: [`-${100 / TAG_COPIES}%`, "0%"] }}
              transition={{
                duration: tagDuration,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {tagLoop.map((tag, i) => (
                <li
                  key={`${tag.kind}-${i}`}
                  className={cn(
                    "relative flex h-[108px] shrink-0 items-center overflow-visible rounded-[8px] border border-foreground/10 px-5 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
                    tag.sizeClassName,
                    tag.className,
                  )}
                  aria-hidden={i >= HERO_TAGS.length ? true : undefined}
                >
                  {tag.badge ? (
                    <span
                      className={cn(
                        "absolute z-10 flex size-[60px] items-center justify-center rounded-[8px]",
                        tag.badge.className,
                      )}
                      style={{ backgroundColor: tag.badge.color }}
                    >
                      <Image
                        src="/logo.svg"
                        alt=""
                        width={32}
                        height={32}
                        className="size-8 invert"
                      />
                    </span>
                  ) : null}

                  {tag.kind === "stat" ? (
                    <span className="grid gap-1">
                      <span className="whitespace-nowrap text-[14px] font-medium leading-none">
                        {t(tag.label)}
                      </span>
                      <span className="whitespace-nowrap text-[48px] font-medium leading-none tracking-tight">
                        {t(tag.value)}
                      </span>
                      {tag.detail ? (
                        <span className="whitespace-nowrap text-[12px] font-medium leading-none opacity-70">
                          {t(tag.detail)}
                        </span>
                      ) : null}
                    </span>
                  ) : (
                    <span className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase leading-none">
                        {t(tag.sender)}
                      </span>
                      <span className="text-[14px] font-medium leading-tight">
                        {t(tag.message)}
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </motion.ul>
          </div>

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
