"use client"

import Image from "next/image"
import { useMemo } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { defaultCenterIndex } from "./utils"

const SLIDE_BASIS = "basis-[80%]"

type Props = {
  images: string[]
  alt?: string
}

export function AudienceTabCarousel({ images, alt }: Props) {
  const urls = useMemo(
    () => images.map((s) => String(s).trim()).filter(Boolean),
    [images],
  )
  const n = urls.length

  if (n === 0) return null

  const startIndex = defaultCenterIndex(n)
  const loop = n > 1
  const slideBasis = n === 1 ? "basis-full" : SLIDE_BASIS

  return (
    <div className="relative w-full overflow-hidden bg-foreground pb-8 sm:pb-12">
      <Carousel
        opts={{
          align: "center",
          loop,
          containScroll: false,
          startIndex,
          duration: 28,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 items-stretch">
          {urls.map((src, i) => (
            <CarouselItem
              key={`${src}-${i}`}
              className={cn(slideBasis, "pl-4")}
            >
              <div className="relative aspect-4/3 w-full max-h-[80dvh] overflow-hidden rounded-2xl bg-background/20">
                <Image
                  src={src}
                  alt={alt || `Imagen ${i + 1}`}
                  fill
                  priority={i === startIndex}
                  sizes="80vw"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-16 right-16 flex items-center gap-4 rounded-[14px] bg-foreground p-4 px-8 text-background">
                  <Image src="/qr.svg" alt="Loyalz" width={62} height={62} />
                  <div className="flex flex-col gap-2">
                    <span className="text-[14px]">Powered by</span>
                    <Image
                      src="/loyalz_small.svg"
                      alt="Loyalz"
                      width={151}
                      height={100}
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
