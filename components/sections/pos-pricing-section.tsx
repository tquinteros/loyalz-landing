"use client"

import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { PosPricingSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"
import { cn } from "@/lib/utils"

type Props = PosPricingSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const DEFAULT_BG = "#F5B8A8"
const DEFAULT_TEXT = "#E85D33"

export default function PosPricingSection({
  label,
  title,
  description,
  cards,
  primaryCta,
  secondaryCta,
  backgroundColor,
  textColor,
  backgroundImage,
  className,
}: Props) {
  const t = useT()

  const bg = backgroundColor?.trim() || DEFAULT_BG
  const fg = textColor?.trim() || DEFAULT_TEXT
  const labelText = t(label)
  const titleText = t(title)
  const descriptionText = t(description)
  const primaryCtaLabel = t(primaryCta?.label)
  const secondaryCtaLabel = t(secondaryCta?.label)

  const visibleCards = (cards ?? []).filter(
    (card) => card.image?.trim() || t(card.title) || t(card.description),
  )

  if (!labelText && !titleText && !descriptionText && visibleCards.length === 0) {
    return null
  }

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      surfaceColor={bg}
      className={cn("py-12 sm:py-16 lg:py-20", className)}
    >
      <div
        className="flex flex-col items-center text-center"
        style={{ color: fg } as CSSProperties}
      >
        {labelText ? (
          <div
            className="flex w-fit items-center gap-2 rounded border px-3 py-2"
            style={{ borderColor: fg }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="10" height="10" rx="2" fill={fg} />
            </svg>
            <p className="text-xs font-semibold tracking-wider sm:text-sm">
              {labelText}
            </p>
          </div>
        ) : null}

        {titleText ? (
          <h2 className="mt-5 max-w-4xl text-balance text-3xl font-bold leading-[1.08] tracking-tight sm:mt-6 sm:text-4xl lg:text-[56px]">
            {titleText}
          </h2>
        ) : null}

        {descriptionText ? (
          <p className="mt-4 max-w-3xl text-base leading-snug sm:text-lg lg:text-xl">
            {descriptionText}
          </p>
        ) : null}

        {visibleCards.length > 0 ? (
          <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:mt-14">
            {visibleCards.map((card, i) => {
              const cardTitle = t(card.title)
              const cardDescription = t(card.description)
              const imageSrc = card.image?.trim()

              return (
                <article
                  key={`${cardTitle}-${i}`}
                  className="flex flex-col overflow-hidden rounded-[24px] p-5 text-left text-foreground sm:rounded-[32px] sm:p-6"
                  style={{ backgroundColor: fg }}
                >
                  {imageSrc ? (
                    <div className="relative mb-5 size-[240px] shrink-0 overflow-hidden rounded-[20px] sm:rounded-[24px]">
                      <Image
                        src={imageSrc}
                        alt={cardTitle || ""}
                        width={240}
                        height={240}
                        className="size-full object-cover"
                        sizes="240px"
                      />
                    </div>
                  ) : null}

                  {cardTitle ? (
                    <h3 className="text-xl font-bold leading-tight sm:text-[32px]">
                      {cardTitle}
                    </h3>
                  ) : null}
                  {cardDescription ? (
                    <p className="mt-2 text-sm leading-snug text-foreground/90 sm:text-base">
                      {cardDescription}
                    </p>
                  ) : null}
                </article>
              )
            })}
          </div>
        ) : null}

        {(primaryCta?.href && primaryCtaLabel) ||
        (secondaryCta?.href && secondaryCtaLabel) ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-12 sm:gap-4">
            {primaryCta?.href && primaryCtaLabel ? (
              <Button
                asChild
                size="lg"
                className="h-12 rounded-[10px] border-0 bg-background px-8 text-base font-semibold text-foreground shadow-none hover:bg-background/90"
              >
                <Link href={primaryCta.href}>{primaryCtaLabel}</Link>
              </Button>
            ) : null}
            {secondaryCta?.href && secondaryCtaLabel ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-[10px] border-2 border-background bg-transparent px-8 text-base font-semibold text-background shadow-none hover:bg-background/10 hover:text-background hover:opacity-75"
              >
                <Link href={secondaryCta.href}>{secondaryCtaLabel}</Link>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </SectionWrapper>
  )
}
