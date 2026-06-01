"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { ProductClubBenefitsSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"

type Props = ProductClubBenefitsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

function BenefitIcon({ color }: { color: string }) {
  return (
    <svg
      width="29"
      height="24"
      viewBox="0 0 29 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="size-7 sm:size-8"
    >
      <path
        d="M20.25 15.625L25 11.5625L28.75 11.875L23.25 16.6562L24.875 23.75L21.6875 21.8125L20.25 15.625ZM17.3125 6.5L16 3.4375L17.4375 0L20.3125 6.78125L17.3125 6.5ZM4.78125 23.75L6.8125 14.9688L0 9.0625L9 8.28125L12.5 0L16 8.28125L25 9.0625L18.1875 14.9688L20.2188 23.75L12.5 19.0938L4.78125 23.75Z"
        fill={color}
      />
    </svg>
  )
}

export default function ProductClubBenefitsSection({
  title,
  benefits,
  backgroundColor,
  primaryCta,
  secondaryCta,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const primaryCtaLabel = t(primaryCta?.label)
  const secondaryCtaLabel = t(secondaryCta?.label)
  const accent = backgroundColor?.trim() || "#754390"

  const validBenefits = (benefits ?? []).filter(
    (item) => t(item.title) || t(item.description),
  )

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      surfaceColor={backgroundColor ?? null}
      className={cn("text-foreground", className)}
    >
      <div className="flex flex-col items-center text-center">
        {titleText ? (
          <h2 className="max-w-4xl text-[32px] font-bold leading-none tracking-tight sm:text-[44px] lg:text-[56px]">
            {titleText}
          </h2>
        ) : null}

        {validBenefits.length > 0 ? (
          <ul className="mt-12 grid w-full list-none grid-cols-1 gap-5 p-0 text-left sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {validBenefits.map((item, index) => {
              const itemTitle = t(item.title)
              const itemDescription = t(item.description)
              const iconSrc = item.icon?.trim()
              return (
                <li key={`${itemTitle}-${index}`} className="min-w-0">
                  <article className="flex h-full flex-col  gap-4 rounded-[24px] bg-foreground p-6 sm:rounded-[28px] sm:p-8 sm:pb-20">
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-xl border sm:size-14"
                      style={{ borderColor: `${accent}40` }}
                    >
                      {iconSrc ? (
                        <div className="relative size-7 sm:size-8">
                          <Image
                            src={iconSrc}
                            alt={itemTitle || ""}
                            fill
                            sizes="32px"
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <BenefitIcon color={accent} />
                      )}
                    </div>
                    {itemTitle ? (
                      <h3
                        className="text-xl font-bold leading-none sm:text-2xl lg:text-[32px]"
                        style={{ color: accent }}
                      >
                        {itemTitle}
                      </h3>
                    ) : null}
                    {itemDescription ? (
                      <p
                        className="text-base leading-snug sm:text-lg sm:leading-none"
                        style={{ color: accent }}
                      >
                        {itemDescription}
                      </p>
                    ) : null}
                  </article>
                </li>
              )
            })}
          </ul>
        ) : null}

        {(primaryCta?.href && primaryCtaLabel) ||
        (secondaryCta?.href && secondaryCtaLabel) ? (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:mt-14 sm:gap-4">
            {primaryCta?.href && primaryCtaLabel ? (
              <Button
                asChild
                size="lg"
                className="h-12 rounded-[10px] border-0 bg-foreground px-8 text-base font-semibold shadow-none hover:bg-foreground/90"
                style={{ color: accent }}
              >
                <Link href={primaryCta.href}>{primaryCtaLabel}</Link>
              </Button>
            ) : null}
            {secondaryCta?.href && secondaryCtaLabel ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-[10px] border-2 border-foreground bg-transparent px-8 text-base font-semibold text-foreground shadow-none hover:bg-transparent hover:text-foreground hover:opacity-75"
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
