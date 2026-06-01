"use client"

import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { BlurredAiPosCardsSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"
import { cn } from "@/lib/utils"

type Props = BlurredAiPosCardsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const DEFAULT_BG = "#B2C8D9"
const DEFAULT_TEXT = "#013662"

/** Figma progressive blur ~59% → bottom, 0px → 50px (mask simulates the ramp). */
const CARD_PROGRESSIVE_BLUR: CSSProperties = {
  backdropFilter: "blur(50px)",
  WebkitBackdropFilter: "blur(50px)",
  maskImage:
    "linear-gradient(to top, black 0%, rgba(0,0,0,0.92) 18%, rgba(0,0,0,0.45) 52%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to top, black 0%, rgba(0,0,0,0.92) 18%, rgba(0,0,0,0.45) 52%, transparent 100%)",
}

const CARD_READABILITY_GRADIENT =
  "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.22) 42%, transparent 100%)"

export default function BlurredAiPosCardsSection({
  label,
  title,
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
  const primaryCtaLabel = t(primaryCta?.label)
  const secondaryCtaLabel = t(secondaryCta?.label)

  const visibleCards = (cards ?? []).filter(
    (card) => card.image?.trim() || t(card.title) || t(card.description),
  )

  if (!labelText && !titleText && visibleCards.length === 0) return null

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      surfaceColor={bg}
      className={cn("py-12 sm:py-16 lg:py-20", className)}
    >
      <div
        className="mx-auto flex max-w-7xl flex-col items-center text-center"
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

        {visibleCards.length > 0 ? (
          <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:mt-12 sm:gap-6 md:grid-cols-3 lg:mt-14">
            {visibleCards.map((card, i) => {
              const cardTitle = t(card.title)
              const cardDescription = t(card.description)
              const imageSrc = card.image?.trim()

              return (
                <article
                  key={`${cardTitle}-${i}`}
                  className="relative isolate aspect-4/5 w-full overflow-hidden rounded-[24px] sm:rounded-[32px]"
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={cardTitle || ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-foreground/20" />
                  )}

                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-[58%]"
                    style={CARD_PROGRESSIVE_BLUR}
                    aria-hidden
                  />

                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-[52%]"
                    style={{ background: CARD_READABILITY_GRADIENT }}
                    aria-hidden
                  />

                  <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start p-6 text-left text-foreground sm:p-7">
                    {cardTitle ? (
                      <h3 className="text-xl font-bold leading-tight sm:text-2xl">
                        {cardTitle}
                      </h3>
                    ) : null}
                    {cardDescription ? (
                      <p className="mt-2 text-sm leading-snug text-foreground/90 sm:text-base">
                        {cardDescription}
                      </p>
                    ) : null}
                  </div>
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
                className="h-12 rounded-[10px] border-2 bg-transparent px-8 text-base font-semibold shadow-none hover:opacity-80"
                style={{ borderColor: fg, color: fg }}
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
