"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Quote } from "lucide-react"
import type { CarouselApi } from "@/components/ui/carousel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SectionWrapper } from "./section-wrapper"
import type { TestimonialsSectionProps } from "@/lib/types/Pages"

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
      {(title || subtitle) && (
        <div className=" mb-12">
          <div className="flex items-center mb-3 gap-3 border border-black/5 rounded-[4px] p-1.5 px-3 w-fit">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10" height="10" rx="2" fill="black" />
            </svg>

            <p className="text-sm text-background">
              Casos de éxito
            </p>
          </div>
          {title ? (
            <h2 className="text-3xl text-background font-bold tracking-tight sm:text-6xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-3 text-lg text-background">{subtitle}</p>
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
            const summary = item.summary || item.quote
            const place = item.place || item.role
            const firstName = item.author.split(" ")[0] || item.author

            return (
              <CarouselItem
                key={`${item.author}-${i}`}
                className="pl-5 md:basis-[48%]"
              >
                <Card className="h-full rounded-2xl border-4 border-transparent bg-card shadow-sm transition-colors duration-200 hover:border-accent">
                  <CardContent className="flex min-h-[500px] flex-col justify-between p-7 sm:p-8">
                    <div>
                      <div className="mb-10 flex min-h-14 items-start justify-between gap-4">
                        {item.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.logo}
                            alt={`${place || item.author} logo`}
                            className="max-h-20 max-w-40 object-contain"
                          />
                        ) : (
                          <Quote className="size-8 text-background" />
                        )}
                      </div>

                      {item.badges?.length ? (
                        <div className="mb-7 flex flex-wrap gap-2">
                          {item.badges.map((badge, index) => (
                            <Badge
                              key={`${badge}-${index}`}
                              variant="secondary"
                              className="rounded-md border-none bg-black/5 hover:bg-black/5 px-2.5 py-1 text-[11px] font-bold text-background"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      {summary ? (
                        <blockquote className="text-3xl font-semibold leading-[1.05] tracking-tight text-background">
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
                        <div className="text-sm font-bold text-background">
                          {firstName}
                        </div>
                        {place ? (
                          <div className="text-xs font-medium text-muted-foreground">
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
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${selectedIndex === index
                    ? "w-8 bg-foreground"
                    : "w-8 bg-foreground/20"
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
              <span className="sr-only">Previous testimonial</span>
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
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </Carousel>
    </SectionWrapper>
  )
}
