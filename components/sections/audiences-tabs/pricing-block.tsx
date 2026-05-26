"use client"

import { ArrowUpRight } from "lucide-react"
import type { AudiencePricingProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"

type Props = {
  data: AudiencePricingProps | undefined
}

function pricePanelBg(bg: string) {
  return `color-mix(in srgb, ${bg} 32%, #ffffff)`
}

function pricePanelText(bg: string) {
  return `color-mix(in srgb, ${bg} 78%, #1a1028)`
}

function formatPriceAmount(price: string, freeLabel: string) {
  const trimmed = price?.trim() ?? ""
  if (!trimmed || trimmed === "0") return freeLabel
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `$${trimmed}`
  return trimmed
}

export function AudiencePricingBlock({ data }: Props) {
  const t = useT()
  if (!data) return null

  const labelText = t(data.label)
  const titleText = t(data.title)
  const descriptionText = t(data.description)
  const cards = (data.pricingCards ?? []).filter(
    (card) =>
      card.price?.trim() ||
      t(card.title) ||
      t(card.label) ||
      t(card.description),
  )
  const freeLabel = t({ es: "Gratis", en: "Free" })
  const fromLabel = t({ es: "Desde", en: "From" })
  const perMonthLabel = t({ es: "usd/mes", en: "usd/month" })

  const hasHeader = labelText || titleText || descriptionText
  if (!hasHeader && cards.length === 0) return null

  return (
    <div className="space-y-8 sm:space-y-10">
      {hasHeader ? (
        <div className="max-w-4xl space-y-3 text-left">
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
              <p className="text-xs font-semibold tracking-wider text-background">
                {labelText}
              </p>
            </div>
          ) : null}
          {titleText ? (
            <h2 className="text-3xl font-bold leading-none tracking-tight text-background sm:text-4xl lg:text-5xl xl:text-[56px] xl:leading-[1.05]">
              {titleText}
            </h2>
          ) : null}
          {descriptionText ? (
            <p className="text-base text-background/80 sm:text-lg sm:leading-none">
              {descriptionText}
            </p>
          ) : null}
        </div>
      ) : null}

      {cards.length > 0 ? (
        <ul className="flex flex-col gap-4 sm:gap-5">
          {cards.map((card, i) => {
            const cardTitle = t(card.title)
            const cardLabel = t(card.label)
            const cardDesc = t(card.description)
            const cardBg = card.backgroundColor?.trim() || "#754390"
            const priceAmount = formatPriceAmount(card.price, freeLabel)
            const isFree = !card.price?.trim() || card.price.trim() === "0"
            const panelBg = pricePanelBg(cardBg)
            const panelText = pricePanelText(cardBg)

            return (
              <li key={`${cardTitle}-${i}`} className="list-none">
                <article
                  className="grid grid-cols-1 overflow-hidden rounded-[20px] text-foreground sm:rounded-[24px] lg:grid-cols-12"
                  style={{ backgroundColor: cardBg }}
                >
                  <div
                    className="flex min-h-[120px] flex-col justify-center px-6 py-8 sm:min-h-[140px] sm:px-8 lg:col-span-3"
                    style={{
                      backgroundColor: panelBg,
                      color: panelText,
                    }}
                  >
                    {isFree ? (
                      <p className="text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
                        {priceAmount}
                      </p>
                    ) : (
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold sm:text-sm">
                          {fromLabel}
                        </p>
                        <p className="text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
                          {priceAmount}
                        </p>
                        <p className="text-xs font-medium opacity-90 sm:text-sm">
                          {perMonthLabel}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex min-h-[120px] items-center gap-4 px-6 py-6 sm:px-8 lg:col-span-9">
                    <div className="min-w-0 flex-1 space-y-1">
                      {cardTitle ? (
                        <h3 className="text-2xl font-bold leading-none sm:text-3xl lg:text-4xl">
                          {cardTitle}
                        </h3>
                      ) : null}
                      {cardLabel ? (
                        <p className="text-base font-medium opacity-95 sm:text-lg">
                          {cardLabel}
                        </p>
                      ) : null}
                      {cardDesc ? (
                        <p className="text-sm leading-none opacity-90 sm:text-base">
                          {cardDesc}
                        </p>
                      ) : null}
                    </div>
                    <ArrowUpRight
                      className="size-8 shrink-0 opacity-90 sm:size-10"
                      aria-hidden
                    />
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
