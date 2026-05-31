"use client"

import type { CSSProperties } from "react"
import { CircleCheck } from "lucide-react"
import type { PricingClubAiSectionProps } from "@/lib/types/Pages"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"
import { cn } from "@/lib/utils"

type Props = PricingClubAiSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const CLUB_GROWTH_ACCENT = "#DBC5E8"
const CLUB_BUSINESS_ACCENT = "#754390"
const CLUB_START_PILL = "#9CA3AF"

function getClubCardStyles(index: number) {
  if (index === 0) {
    return {
      cardClass: "border-0 shadow-lg",
      borderStyle: undefined as CSSProperties | undefined,
      pillStyle: {
        backgroundColor: CLUB_START_PILL,
        color: "#ffffff",
      },
    }
  }

  if (index === 1) {
    return {
      cardClass: "border-[10px] border-solid shadow-lg",
      borderStyle: { borderColor: CLUB_GROWTH_ACCENT },
      pillStyle: {
        backgroundColor: CLUB_GROWTH_ACCENT,
        color: "#1a1028",
      },
    }
  }

  return {
    cardClass: "border-[10px] border-solid shadow-lg",
    borderStyle: { borderColor: CLUB_BUSINESS_ACCENT },
    pillStyle: {
      backgroundColor: CLUB_BUSINESS_ACCENT,
      color: "#ffffff",
    },
  }
}

function getAiCardStyles() {
  return {
    cardClass: "border-0 shadow-lg",
    borderStyle: undefined as CSSProperties | undefined,
    pillStyle: {
      backgroundColor: "rgba(255,255,255,0.15)",
      color: "inherit",
    },
  }
}

export default function PricingClubAiSection({
  product,
  label,
  title,
  description,
  bottomMessage,
  cards,
  backgroundImage,
  className,
}: Props) {
  const t = useT()

  const labelText = t(label)
  const titleText = t(title)
  const descriptionText = t(description)
  const bottomMessageText = t(bottomMessage)
  const perMonthLabel = t({ es: "usd/mes", en: "usd/month" })

  const isClub = product === "club"

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn("bg-foreground text-background", className)}
    >
      {(labelText || titleText || descriptionText) && (
        <div className="mx-auto mb-12 flex max-w-4xl flex-col items-center gap-3 text-center">
          {labelText ? (
            <div className="flex w-fit items-center gap-2 rounded border border-background px-3 py-2">
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
              <p className="text-xs font-semibold tracking-wider text-background sm:text-sm">
                {labelText}
              </p>
            </div>
          ) : null}
          {titleText ? (
            <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-none tracking-tight text-background sm:text-[56px]">
              {titleText}
            </h2>
          ) : null}
          {descriptionText ? (
            <p className="mt-1 text-base text-background/80 sm:text-lg">
              {descriptionText}
            </p>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, i) => {
          const cardTitle = t(card.title)
          const cardShops = t(card.shops)
          const styles = isClub ? getClubCardStyles(i) : getAiCardStyles()
          const features = (card.features ?? []).filter((f) => t(f))

          return (
            <Card
              key={`${cardTitle}-${i}`}
              className={cn(
                "rounded-[24px] bg-black/5 text-background transition-colors duration-200",
                styles.cardClass,
              )}
              style={styles.borderStyle}
            >
              <CardContent className="p-6 sm:p-8">
                {cardTitle ? (
                  <CardTitle className="text-left text-3xl font-bold leading-none text-background sm:text-4xl">
                    {cardTitle}
                  </CardTitle>
                ) : null}

                {card.price ? (
                  <p className="mt-4 text-5xl font-bold leading-none tracking-tight text-background sm:text-6xl lg:text-7xl">
                    {card.price}
                  </p>
                ) : null}

                <p className="mt-2 text-sm font-bold text-background sm:text-base">
                  {perMonthLabel}
                </p>

                {cardShops ? (
                  <p
                    className="mt-4 inline-flex w-full items-center justify-center rounded-[14px] px-3 py-3 text-center text-sm font-semibold sm:text-base"
                    style={styles.pillStyle}
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
                          className="flex items-center gap-2 border-b border-background/20 py-3 text-base text-background sm:text-lg"
                        >
                          <CircleCheck className="size-4 shrink-0 text-background" />
                          <span>{featureText}</span>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {bottomMessageText ? (
        <p className="mt-16 text-center text-lg text-background">
          {bottomMessageText}
        </p>
      ) : null}
    </SectionWrapper>
  )
}
