"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
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

  const [center, setCenter] = useState(0)
  const [api, setApi] = useState<CarouselApi>()

  const n = urls.length

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCenter(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn(
        "flex h-[calc(113dvh-5rem)] min-h-[calc(113dvh-5rem)] max-h-[calc(113dvh-5rem)] flex-col overflow-hidden bg-background py-0 text-foreground sm:py-0",
        className,
      )}
      innerClassName="flex h-full min-h-0 flex-1 flex-col px-5 lg:px-16"
    >
      {/* Title */}
      <header className="shrink-0 pt-8 text-center max-w-7xl mx-auto md:pt-12">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-7xl">
          {titleText}
        </h1>
      </header>

      {/* Carousel */}
      <div className="relative shrink-0 flex items-center justify-center py-4 md:py-6">
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
            containScroll: false,
            dragFree: false,
            startIndex: n > 0 ? Math.floor((n - 1) / 2) : 0,
          }}
          className="w-full overflow-visible"
        >
          <CarouselContent className="ml-0 items-center [&>*]:-ml-8 md:[&>*]:-ml-14 lg:[&>*]:-ml-16">
            {urls.map((src, i) => {
              const delta = signedDistance(i, center, n)
              const absDelta = Math.abs(delta)
              const isCenter = absDelta === 0

              const scale = isCenter ? 1.08 : absDelta === 1 ? 0.8 : 0.64
              const rotate = isCenter ? 0 : delta < 0 ? -6 : 6
              const opacity = isCenter ? 1 : absDelta === 1 ? 0.85 : 0.5

              return (
                <CarouselItem
                  key={`${src}-${i}`}
                  className="basis-[38%] md:basis-[26%] lg:basis-[22%] pl-0 flex items-center justify-center"
                >
                  <motion.div
                    onClick={() => api?.scrollTo(i)}
                    initial={{ opacity: 0, y: 20, scale: 0.78 }}
                    animate={{ opacity, y: 0, scale, rotate }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "relative w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/6",
                      // 2:3 ratio via aspect-ratio — height comes from width
                      "aspect-[2/3]",
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
                      sizes="(max-width: 768px) 38vw, (max-width: 1024px) 26vw, 22vw"
                      className="object-cover"
                    />
                  </motion.div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTAs */}
      <footer className="flex shrink-0 flex-wrap items-center justify-center gap-3 pb-10 pt-2 md:gap-4 md:pb-14">
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
      </footer>
    </SectionWrapper>
  )
}