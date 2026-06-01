"use client"

import type { CSSProperties } from "react"
import Link from "next/link"
import { CircleCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PosPlansSectionProps } from "@/lib/types/Pages"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"
import { cn } from "@/lib/utils"

type Props = PosPlansSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const POS_ACCENT = "#EC491E"

function getPosPlansCardStyles(index: number) {
  const pillBase =
    "mt-4 inline-flex w-full items-center justify-center rounded-[14px] px-3 py-3 text-center text-sm font-semibold sm:text-base"

  if (index === 0) {
    return {
      cardClass: "border-[10px] border-solid bg-foreground shadow-lg",
      borderStyle: { borderColor: POS_ACCENT } as CSSProperties,
      pillClassName: cn(pillBase, "bg-[#EC491E] text-foreground"),
      textClass: "text-background",
      featureBorderClass: "border-background/25",
      checkClass: "text-background",
    }
  }

  return {
    cardClass: "border-0 bg-[#EC491E] text-foreground shadow-lg",
    borderStyle: undefined as CSSProperties | undefined,
    pillClassName: cn(pillBase, "bg-foreground text-[#EC491E]"),
    textClass: "text-foreground",
    featureBorderClass: "border-foreground/25",
    checkClass: "text-foreground",
  }
}

function BottomMessageStarIcon() {
  return (
    <svg
      width="24"
      height="23"
      viewBox="0 0 24 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0"
      aria-hidden="true"
    >
      <path
        d="M7.26499 22.4004L2.76762 19.1571L5.57848 15.3084L7.78392 12.757L4.49738 12.0218L0 10.5515L1.68652 5.31901L6.27038 6.78931L9.29746 8.08663L8.99475 4.80008V0H14.53V4.75684L14.2273 8.08663L17.2544 6.78931L21.8382 5.31901L23.5247 10.5515L19.0274 12.0218L15.7408 12.757L17.903 15.2651L20.7571 19.1571L16.2597 22.4004L13.4489 18.5517L11.7624 15.6976L10.0759 18.5084L7.26499 22.4004Z"
        fill="#FFB7A4"
      />
    </svg>
  )
}

function BottomMessage({ text }: { text: string }) {
  const trimmed = text.trimStart()
  if (trimmed.startsWith("*")) {
    return (
      <p className="flex items-center justify-center gap-2 text-center text-lg text-foreground">
        <BottomMessageStarIcon />
        <span>{trimmed.slice(1).trimStart()}</span>
      </p>
    )
  }
  return <p className="text-center text-lg text-foreground">{text}</p>
}

export default function PosPlansSection({
  label,
  title,
  bottomMessage,
  cards,
  primaryCta,
  secondaryCta,
  backgroundImage,
  className,
}: Props) {
  const t = useT()

  const labelText = t(label)
  const titleText = t(title)
  const bottomMessageText = t(bottomMessage)
  const primaryCtaLabel = t(primaryCta?.label)
  const secondaryCtaLabel = t(secondaryCta?.label)

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn("bg-foreground text-background py-12 sm:py-16 lg:py-20", className)}
    >
      {(labelText || titleText) && (
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
              <p className="text-xs font-semibold tracking-wider sm:text-sm">
                {labelText}
              </p>
            </div>
          ) : null}
          {titleText ? (
            <h2 className="mx-auto max-w-4xl text-balance text-4xl font-bold leading-none tracking-tight text-background sm:text-[56px]">
              {titleText.split("\n").map((line, i, lines) => (
                <span key={`${line}-${i}`}>
                  {line}
                  {i < lines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h2>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map((card, i) => {
          const cardLabel = t(card.title)
          const cardShops = t(card.shops)
          const styles = getPosPlansCardStyles(i)
          const features = (card.features ?? []).filter((f) => t(f))

          return (
            <Card
              key={`${cardLabel}-${i}`}
              className={cn(
                "rounded-[24px] border-0 bg-transparent text-inherit shadow-none",
                styles.cardClass,
                styles.textClass,
              )}
              style={styles.borderStyle}
            >
              <CardContent className="p-6 sm:p-8">
                {cardLabel ? (
                  <CardTitle
                    className={cn(
                      "text-left text-3xl font-bold leading-none sm:text-[32px]",
                      styles.textClass,
                    )}
                  >
                    {cardLabel}
                  </CardTitle>
                ) : null}

                {card.price ? (
                  <p
                    className={cn(
                      "mt-4 text-5xl font-bold leading-none tracking-tight sm:text-6xl lg:text-[80px]",
                      styles.textClass,
                    )}
                  >
                    {card.price}
                  </p>
                ) : null}

                {cardShops ? (
                  <p className={styles.pillClassName}>{cardShops}</p>
                ) : null}

                {features.length > 0 ? (
                  <ul className="mt-6 space-y-0 pt-2">
                    {features.map((feature, index) => {
                      const featureText = t(feature)
                      return (
                        <li
                          key={`${featureText}-${index}`}
                          className={cn(
                            "flex items-center gap-2 border-b py-3 text-base sm:text-lg",
                            styles.featureBorderClass,
                            styles.textClass,
                          )}
                        >
                          <CircleCheck
                            className={cn("size-4 shrink-0", styles.checkClass)}
                          />
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
        <div className="mt-16 flex items-center justify-center rounded-[10px] bg-background p-6">
          <BottomMessage text={bottomMessageText} />
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
              className="h-12 rounded-[10px] border-2 border-background bg-transparent px-8 text-base font-semibold text-background shadow-none hover:bg-transparent hover:text-background hover:opacity-75"
            >
              <Link href={secondaryCta.href}>{secondaryCtaLabel}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </SectionWrapper>
  )
}
