"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { CommonCTASectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { cn } from "@/lib/utils"

type Props = CommonCTASectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function CommonCTASection({
  backgroundColor,
  title,
  description,
  firstCta,
  secondCta,
  image,
  backgroundImage,
  className,
}: Props) {
  const hasSectionBg = !!backgroundImage

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      innerClassName="w-full max-w-none px-4 lg:px-16"
      className={cn(
        "",
        !hasSectionBg && "bg-foreground! py-8 sm:py-12 lg:py-16",
        hasSectionBg && "py-16 sm:py-24",
        className,
      )}
    >
      <div
        className={cn(
          "grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0",
          !hasSectionBg &&
            "rounded-[28px] sm:rounded-[32px] p-8 lg:p-4",
          hasSectionBg && "relative",
        )}
        style={
          !hasSectionBg && backgroundColor
            ? { backgroundColor }
            : undefined
        }
      >
        {/* Left: 8 cols (12 if no image) — title, description, CTAs */}
        <div
          className={cn(
            "min-w-0 lg:px-16  space-y-5",
            image ? "lg:col-span-8" : "lg:col-span-12",
          )}
        >
          {title ? (
            <h2 className="text-left text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl max-w-2xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="max-w-2xl text-left text-base leading-relaxed text-white/95 sm:text-lg">
              {description}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2 sm:gap-4 lg:pt-4">
            {firstCta?.label && firstCta?.href ? (
              <Button
                asChild
                size="lg"
                className="h-12 rounded-[12px] border-0 bg-[#F8F5EF] px-8 text-base font-semibold shadow-none hover:bg-[#F8F5EF]/90"
              >
                <Link
                  href={firstCta.href}
                  style={{ color: backgroundColor || undefined }}
                >
                  {firstCta.label}
                </Link>
              </Button>
            ) : null}
            {secondCta?.label && secondCta?.href ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-[12px] border-2 border-white bg-transparent px-8 text-base font-semibold text-white shadow-none hover:bg-white/10 hover:text-white"
              >
                <Link href={secondCta.href}>{secondCta.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>

        {/* Right: 4 cols — image */}
        {image ? (
          <div className="relative w-full lg:col-span-4">
            <div className="relative mx-auto aspect-4/3 w-full max-w-md overflow-hidden rounded-[24px] sm:max-w-none lg:mx-0">
              <Image
                src={image}
                alt={title || "CTA"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </div>
        ) : null}
      </div>
    </SectionWrapper>
  )
}
