"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Quote } from "lucide-react"
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

export default function TestimonialsSection({
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
// TODO: ADD 112PX PY TO SECTIONS
// TODO: ADD BORDER TO 2ND PRICING CARD & HOVERING COLOR MUST BE SOLID IN LAST ONE
  return (
    <SectionWrapper backgroundImage={backgroundImage} className={className}>
      {(titleText || subtitleText) && (
        <div className=" mb-12">
          <div className="flex items-center mb-3 gap-3 border border-black/5 rounded-[4px] p-1.5 px-3 w-fit">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10" height="10" rx="2" fill="black" />
            </svg>

            <p className="text-sm text-background">
              {successCasesLabel}
            </p>
          </div>
          {titleText ? (
            <h2 className="text-3xl text-background font-bold tracking-tight sm:text-6xl">
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
            const firstName = item.author.split(" ")[0] || item.author
            const hasBg = !!item.backgroundImage?.trim()

            return (
              <CarouselItem
                key={`${item.author}-${i}`}
                className="pl-5 md:basis-[48%]"
              >
                <Card
                  className={cn(
                    "relative h-full overflow-hidden rounded-2xl border-10 border-transparent transition-colors duration-200 hover:border-accent",
                    !hasBg && "bg-card",
                  )}
                >
                  {hasBg ? (
                    <>
                      <Image
                        src={item.backgroundImage as string}
                        alt=""
                        fill
                        aria-hidden
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-linear-to-b from-black/30 via-black/50 to-black/70"
                      />
                    </>
                  ) : null}

                  <CardContent
                    className={cn(
                      "relative flex min-h-[500px] flex-col justify-between p-7 sm:p-8",
                      hasBg && "text-foreground",
                    )}
                  >
                    <div>
                      <div className="mb-10 flex min-h-14 items-start justify-between gap-4">
                        {item.logo?.trim() ? (
                          <div className="relative h-16 w-36 shrink-0 sm:h-20 sm:w-44">
                            <Image
                              src={item.logo}
                              alt={`${place || item.author} logo`}
                              fill
                              sizes="(max-width: 640px) 144px, 176px"
                              className="object-contain object-left"
                            />
                          </div>
                        ) : (
                          <Quote
                            className={cn(
                              "size-8",
                              hasBg ? "text-foreground" : "text-background",
                            )}
                          />
                        )}
                      </div>

                      {summary ? (
                        <blockquote
                          className={cn(
                            "text-3xl font-semibold leading-[1.05] tracking-tight",
                            hasBg ? "text-foreground" : "text-background",
                          )}
                        >
                          “{summary}”
                        </blockquote>
                      ) : null}
                    </div>

                    <figcaption className="mt-8 flex items-center gap-3">
                      <Avatar size="lg">
                        {item.avatar ? (
                          <AvatarImage src={item.avatar} alt={item.author} />
                        ) : null}
                        <AvatarFallback className="bg-primary/20 font-semibold text-primary">
                          {item.author.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div
                          className={cn(
                            "text-sm font-bold",
                            hasBg ? "text-foreground" : "text-background",
                          )}
                        >
                          {firstName}
                        </div>
                        {place ? (
                          <div
                            className={cn(
                              "text-xs font-medium",
                              hasBg ? "text-foreground/80" : "text-muted-foreground",
                            )}
                          >
                            {place}
                          </div>
                        ) : null}
                      </div>
                    </figcaption>
                  </CardContent>
                </Card>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(scrollSnapCount || items.length, 3) }).map(
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={t({
                    es: `Ir al testimonio ${index + 1}`,
                    en: `Go to testimonial ${index + 1}`,
                  })}
                  className={`h-1.5 rounded-full transition-all ${selectedIndex === index
                    ? "w-8 bg-background"
                    : "w-8 bg-background/20"
                    }`}
                  onClick={() => api?.scrollTo(index)}
                />
              ),
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10 rounded-full border-foreground/30 bg-black/5 hover:bg-black/5 hover:text-background text-background"
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
              className="size-10 rounded-full border-foreground/30 bg-black/5 hover:bg-black/5 hover:text-background text-background"
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
