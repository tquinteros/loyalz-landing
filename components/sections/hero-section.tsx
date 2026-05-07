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
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { CTA, HeroSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"

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

  const ctaLabel =
    legacy.ctaLabel?.trim() || legacy.primaryCta?.label?.trim() || "Demo Gratis"
  const ctaHref =
    legacy.ctaHref?.trim() || legacy.primaryCta?.href?.trim() || "#"

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
        "flex h-[calc(100dvh-5rem)] min-h-[calc(100dvh-5rem)] max-h-[calc(100dvh-5rem)] flex-col overflow-hidden bg-background py-0 text-foreground sm:py-0",
        className,
      )}
      innerClassName="flex h-full min-h-0 flex-1 flex-col px-5 lg:px-16"
    >
      <header className="shrink-0 pt-10 text-center md:pt-14">
        <h1 className="mx-auto text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-7xl">
          {title}
        </h1>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center py-6 md:py-10">
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
            containScroll: false,
            dragFree: false,
            startIndex: Math.min(2, Math.max(0, n - 1)),
          }}
          className="w-full max-w-none px-0"
        >
          <CarouselContent className="ml-0">
            {urls.map((src, i) => {
              const delta = signedDistance(i, center, n)
              const absDelta = Math.abs(delta)
              const isCenter = absDelta === 0

              const scale = isCenter ? 1.25 : absDelta === 1 ? 0.625 : 0.52
              const rotate = isCenter ? 0 : delta < 0 ? -9 : 9
              const opacity = isCenter ? 1 : absDelta === 1 ? 0.9 : 0.66

              return (
                <CarouselItem
                  key={`${src}-${i}`}
                  className="basis-1/5 pl-0"
                >
                  <motion.button
                    type="button"
                    onClick={() => api?.scrollTo(i)}
                    initial={{ opacity: 0, y: 20, scale: 0.78 }}
                    animate={{ opacity, y: 0, scale, rotate }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "relative mx-auto aspect-3/4 w-full max-w-none overflow-hidden rounded-2xl border border-white/10 bg-white/6",
                      isCenter
                        ? "z-30 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.9)]"
                        : "z-10",
                    )}
                  >
                    <Image
                      src={src}
                      alt=""
                      priority={isCenter}
                      width={470}
                      height={470}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          {/* {n > 1 ? (
            <>
              <CarouselPrevious className="left-1 top-1/2 z-30 hidden -translate-y-1/2 border-white/20 bg-white/10 text-white hover:bg-white/20 md:flex" />
              <CarouselNext className="right-1 top-1/2 z-30 hidden -translate-y-1/2 border-white/20 bg-white/10 text-white hover:bg-white/20 md:flex" />
            </>
          ) : null} */}
        </Carousel>
      </div>

      <footer className="flex shrink-0 justify-center pb-10 pt-2 md:pb-14">
        <Button
          asChild
          variant="secondary"
          className="h-auto rounded-full border-0 bg-white px-10 py-3.5 text-base font-semibold text-black shadow-none hover:bg-white/90"
        >
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </footer>
    </SectionWrapper>
  )
}
