"use client"

import Image from "next/image"
import Link from "next/link"
import { CircleCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ReviewsPricingSectionProps } from "@/lib/types/Pages"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"
import { cn } from "@/lib/utils"

type Props = ReviewsPricingSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const DEFAULT_ACCENT = "#8C7F1F"
const LEGACY_SURFACE_COLORS = new Set(["#F8F5EF", "#F9F6F1"])

function resolveAccent(backgroundColor?: string, accentColor?: string) {
  const bg = backgroundColor?.trim()
  if (bg && !LEGACY_SURFACE_COLORS.has(bg.toUpperCase())) return bg
  return accentColor?.trim() || DEFAULT_ACCENT
}

export default function ReviewsPricingSection({
  label,
  title,
  card,
  image,
  pricingLabel,
  accentColor,
  backgroundColor,
  bottomMessage,
  primaryCta,
  secondaryCta,
  backgroundImage,
  className,
}: Props) {
  const t = useT()

  const labelText = t(label)
  const titleText = t(title)
  const pricingLabelText = t(pricingLabel)
  const bottomMessageText = t(bottomMessage)
  const primaryCtaLabel = t(primaryCta?.label)
  const secondaryCtaLabel = t(secondaryCta?.label)
  const perMonthLabel = t({ es: "usd/mes", en: "usd/month" })

  const accent = resolveAccent(backgroundColor, accentColor)
  const imageSrc = image?.trim()

  const cardTitle = t(card?.title)
  const cardShops = t(card?.shops)
  const features = (card?.features ?? []).filter((f) => t(f))

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn("bg-foreground text-background", className)}
    >
      {(labelText || titleText) && (
        <div className="mx-auto mb-10 flex max-w-4xl flex-col items-center gap-3 text-center sm:mb-12">
          {labelText ? (
            <div className="flex w-fit items-center gap-2 rounded border border-background/10  px-3 py-2">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="10" height="10" rx="2" fill="currentColor" />
              </svg>
              <p className="text-xs font-semibold tracking-wider sm:text-sm">
                {labelText}
              </p>
            </div>
          ) : null}
          {titleText ? (
            <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-none tracking-tight sm:text-[56px]">
              {titleText}
            </h2>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
        <div className="lg:col-span-5">
          <Card
            className="h-full rounded-[24px] border-10 border-solid bg-white shadow-lg"
            style={{ borderColor: accent }}
          >
            <CardContent className="flex h-full flex-col p-6 sm:p-8">
              {cardTitle ? (
                <CardTitle className="text-left text-3xl font-bold leading-none text-background sm:text-4xl">
                  {cardTitle}
                </CardTitle>
              ) : null}

              {card?.price ? (
                <p className="mt-4 text-5xl font-bold leading-none tracking-tight text-background sm:text-6xl lg:text-7xl">
                  {card.price}
                </p>
              ) : null}

              <p className="mt-2 text-sm font-bold text-background sm:text-base">
                {perMonthLabel}
              </p>

              {cardShops ? (
                <p
                  className="mt-4 inline-flex w-full items-center justify-center rounded-[14px] px-3 py-3 text-center text-sm font-semibold text-white sm:text-base"
                  style={{ backgroundColor: accent }}
                >
                  {cardShops}
                </p>
              ) : null}

              {features.length > 0 ? (
                <ul className="mt-6 space-y-0 pt-2">
                  {features.map((feature, index) => {
                    const featureText = t(feature)
                    return (
                      <li
                        key={`${featureText}-${index}`}
                        className="flex items-center gap-2 border-b border-background/15 py-3 text-base text-background sm:text-lg"
                      >
                        <CircleCheck className="size-4 shrink-0 text-background/50" />
                        <span>{featureText}</span>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="flex min-h-[280px] flex-col gap-4 lg:col-span-7 lg:min-h-0">
          {imageSrc ? (
            <div className="relative min-h-[200px] flex-1 overflow-hidden rounded-[24px] sm:min-h-[240px]">
              <Image
                src={imageSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          ) : (
            <div
              className="flex min-h-[200px] flex-1 items-center justify-center rounded-[24px] border border-dashed border-background/20 bg-white/50 p-6 text-center text-sm text-background/60 sm:min-h-[240px]"
              aria-hidden
            />
          )}

          {pricingLabelText ? (
            <div
              className="flex shrink-0 items-center justify-center rounded-[24px] px-6 py-8 sm:px-8 sm:py-10"
              style={{ backgroundColor: accent }}
            >
              <p className="text-center text-lg font-semibold leading-snug text-white sm:text-2xl lg:text-[32px] lg:leading-none">
                {pricingLabelText}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {bottomMessageText ? (
        <div className="mt-10 flex items-center justify-center rounded-[10px] bg-background p-6 sm:mt-12">
          <div className="flex items-center gap-2">
            <svg
              width="24"
              height="23"
              viewBox="0 0 24 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M7.26499 22.4004L2.76762 19.1571L5.57848 15.3084L7.78392 12.757L4.49738 12.0218L0 10.5515L1.68652 5.31901L6.27038 6.78931L9.29746 8.08663L8.99475 4.80008V0H14.53V4.75684L14.2273 8.08663L17.2544 6.78931L21.8382 5.31901L23.5247 10.5515L19.0274 12.0218L15.7408 12.757L17.903 15.2651L20.7571 19.1571L16.2597 22.4004L13.4489 18.5517L11.7624 15.6976L10.0759 18.5084L7.26499 22.4004Z"
                fill={accent}
              />
            </svg>
            <p className="text-center text-base font-bold text-foreground sm:text-lg">
              {bottomMessageText}
            </p>
          </div>
        </div>
      ) : null}

      {(primaryCta?.href && primaryCtaLabel) ||
      (secondaryCta?.href && secondaryCtaLabel) ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
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
              className="h-12 rounded-[10px] border-2 border-background bg-white px-8 text-base font-semibold text-background shadow-none hover:bg-white hover:text-background hover:opacity-75"
            >
              <Link href={secondaryCta.href}>{secondaryCtaLabel}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </SectionWrapper>
  )
}
