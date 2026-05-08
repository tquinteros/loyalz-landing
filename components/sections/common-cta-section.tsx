"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { CommonCTASectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"

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
  const t = useT()
  const titleText = t(title)
  const descriptionText = t(description)
  const firstCtaLabel = t(firstCta?.label)
  const secondCtaLabel = t(secondCta?.label)
  const fallbackImageAlt = t({ es: "CTA", en: "CTA" })

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
          {titleText ? (
            <h2 className="text-left text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-6xl max-w-2xl">
              {titleText}
            </h2>
          ) : null}
          {descriptionText ? (
            <p className="max-w-2xl text-left text-base leading-relaxed text-foreground/95 sm:text-lg">
              {descriptionText}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2 sm:gap-4 lg:pt-4">
            {firstCtaLabel && firstCta?.href ? (
              <Button
                asChild
                size="lg"
                className="h-12 rounded-[12px] border-0 bg-foreground px-8 text-base font-semibold shadow-none hover:bg-foreground/90"
              >
                <Link
                  href={firstCta.href}
                  style={{ color: backgroundColor || undefined }}
                >
                  {firstCtaLabel}
                </Link>
              </Button>
            ) : null}
            {secondCtaLabel && secondCta?.href ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-[12px] border-2 border-foreground bg-transparent px-8 text-base font-semibold text-foreground shadow-none hover:bg-foreground/10 hover:text-foreground"
              >
                <Link href={secondCta.href}>{secondCtaLabel}</Link>
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
                alt={titleText || fallbackImageAlt}
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
