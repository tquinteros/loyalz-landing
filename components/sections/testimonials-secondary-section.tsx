"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { CarouselApi } from "@/components/ui/carousel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import type { TestimonialsSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"

type Props = TestimonialsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const AVATAR_FALLBACK_COLORS = ["#C4B896", "#E8C4A0", "#DBC5E8"] as const

export default function TestimonialsSecondarySection({
  title,
  subtitle,
  items,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const subtitleText = t(subtitle)
  const successCasesLabel = t({ es: "Casos de éxito", en: "Success stories" })

  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnapCount, setScrollSnapCount] = useState(0)

  useEffect(() => {
    if (!api) return

    const updateCarouselState = () => {
      setSelectedIndex(api.selectedScrollSnap())
      setScrollSnapCount(api.scrollSnapList().length)
    }

    updateCarouselState()
    api.on("select", updateCarouselState)
    api.on("reInit", updateCarouselState)

    return () => {
      api.off("select", updateCarouselState)
      api.off("reInit", updateCarouselState)
    }
  }, [api])

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={className}>
      {(titleText || subtitleText) && (
        <div className="mb-12">
          <div className="mb-3 flex w-fit items-center gap-3 rounded-[4px] border border-black/5 p-1.5 px-3">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect width="10" height="10" rx="2" fill="black" />
            </svg>
            <p className="text-sm text-background">{successCasesLabel}</p>
          </div>
          {titleText ? (
            <h2 className="text-3xl font-bold tracking-tight text-background sm:text-6xl">
              {titleText}
            </h2>
          ) : null}
          {subtitleText ? (
            <p className="mt-3 text-lg text-background">{subtitleText}</p>
          ) : null}
        </div>
      )}

      <Carousel
        setApi={setApi}
        opts={{ align: "start", containScroll: "trimSnaps" }}
        className="w-full"
      >
        <CarouselContent className="-ml-5">
          {items.map((item, i) => {
            const summary = t(item.summary) || t(item.quote)
            const place = t(item.place) || t(item.role)
            const imageSrc = item.backgroundImage?.trim()
            const avatarColor =
              AVATAR_FALLBACK_COLORS[i % AVATAR_FALLBACK_COLORS.length]

            return (
              <CarouselItem
                key={`${item.author}-${i}`}
                className="pl-5 md:basis-[48%] lg:basis-[46%]"
              >
                <div className="flex h-full flex-col gap-4">
                  {imageSrc ? (
                    <div className="relative aspect-544/282 w-full overflow-hidden rounded-2xl">
                      <Image
                        src={imageSrc}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 544px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="aspect-544/282 w-full rounded-2xl bg-background/10"
                      aria-hidden
                    />
                  )}

                  <Card className="flex-1 rounded-2xl border-0 bg-foreground shadow-sm">
                    <CardContent className="flex h-full flex-col gap-6 p-6 sm:p-8">
                      {summary ? (
                        <blockquote className="text-xl font-bold leading-snug tracking-tight text-background sm:text-2xl lg:text-[28px] lg:leading-none">
                          &ldquo;{summary}&rdquo;
                        </blockquote>
                      ) : null}

                      <figcaption className="mt-auto flex items-center gap-3">
                        <Avatar size="lg">
                          {item.avatar ? (
                            <AvatarImage src={item.avatar} alt={item.author} />
                          ) : null}
                          <AvatarFallback
                            className="font-semibold text-background"
                            style={{ backgroundColor: avatarColor }}
                          >
                            {item.author.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-bold text-background">
                            {item.author}
                          </div>
                          {place ? (
                            <div className="text-xs font-medium text-background/60">
                              {place}
                            </div>
                          ) : null}
                        </div>
                      </figcaption>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({
              length: Math.min(scrollSnapCount || items.length, 3),
            }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={t({
                  es: `Ir al testimonio ${index + 1}`,
                  en: `Go to testimonial ${index + 1}`,
                })}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  selectedIndex === index
                    ? "w-8 bg-background"
                    : "w-8 bg-background/20",
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10 rounded-full border-background/30 bg-black/5 text-background hover:bg-black/5 hover:text-background"
              onClick={() => api?.scrollPrev()}
              disabled={!api?.canScrollPrev()}
            >
              <ArrowLeft className="size-4" />
              <span className="sr-only">
                {t({ es: "Testimonio anterior", en: "Previous testimonial" })}
              </span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10 rounded-full border-background/30 bg-black/5 text-background hover:bg-black/5 hover:text-background"
              onClick={() => api?.scrollNext()}
              disabled={!api?.canScrollNext()}
            >
              <ArrowRight className="size-4" />
              <span className="sr-only">
                {t({ es: "Siguiente testimonio", en: "Next testimonial" })}
              </span>
            </Button>
          </div>
        </div>
      </Carousel>
    </SectionWrapper>
  )
}
