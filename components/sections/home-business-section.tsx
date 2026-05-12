"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import type { HomeBusinessSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

type Props = HomeBusinessSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const BRAND_DOTS = ["#754390", "#EC491E", "#8C7F1F", "#013662"]

export default function HomeBusinessSection({
  label,
  title,
  description,
  businessCards,
  primaryCta,
  secondaryCta,
  stats,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const labelText = t(label)
  const titleText = t(title)
  const descriptionText = t(description)
  const primaryCtaLabel = t(primaryCta?.label)
  const secondaryCtaLabel = t(secondaryCta?.label)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={`${className} bg-background text-foreground`}>

      {/* ── Centered header ─────────────────────────────────────────── */}
      {(labelText || titleText || descriptionText) && (
        <div className="mb-12 flex flex-col items-center space-y-4 text-center">
          {labelText ? (
            <div className="flex w-fit items-center gap-3 rounded border border-foreground/20 p-2 px-3">
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
              <p className="text-xs tracking-widest text-foreground">{labelText}</p>
            </div>
          ) : null}

          {titleText ? (
            <h2 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-6xl">
              {titleText}
            </h2>
          ) : null}

          {descriptionText ? (
            <p className="max-w-xl text-sm leading-relaxed text-foreground sm:text-base">
              {descriptionText}
            </p>
          ) : null}
        </div>
      )}

      {/* ── Business cards ───────────────────────────────────────────── */}
      {businessCards?.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {businessCards.map((card, i) => {
            const cardTitle = t(card.title)
            const cardDescription = t(card.description)
            const isHovered = hoveredCard === i

            return (
              <motion.div
                key={`${cardTitle}-${i}`}
                className="relative h-[320px] overflow-hidden rounded-2xl sm:h-[380px] lg:h-[420px]"
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image — animates from 62% to 100% on hover */}
                <motion.div
                  className="absolute inset-x-0 top-0 overflow-hidden rounded-2xl"
                  animate={{ height: isHovered ? "100%" : "62%" }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                >
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={cardTitle}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full" aria-hidden />
                  )}

                  {/* Blur + dark gradient overlay — reveals on hover */}
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-3/5 backdrop-blur-xl"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.65) 15%, rgba(0,0,0,0.1) 60%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to top, black 35%, transparent 100%)",
                      maskImage:
                        "linear-gradient(to top, black 35%, transparent 100%)",
                    }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  />
                </motion.div>

                {/* Text — fixed at bottom, plain on rest, overlaid on hover */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-xl font-bold text-foreground sm:text-2xl lg:text-[28px]">
                    {cardTitle}
                  </h3>
                  {cardDescription ? (
                    <p className="mt-1 text-sm leading-snug text-foreground/80 sm:text-base">
                      {cardDescription}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ── Brand dots + CTAs ────────────────────────────────────────── */}
      {(primaryCtaLabel || secondaryCtaLabel) && (
        <div className="mt-8 flex mb-50 flex-col items-center gap-12">
          <div className="flex items-center gap-2" aria-hidden="true">
            {BRAND_DOTS.map((color) => (
              <span
                key={color}
                className="inline-block h-2.5 w-10 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {primaryCtaLabel && primaryCta?.href ? (
              <Button size="lg" className="gap-2 bg-foreground text-background px-6 py-5">
                {primaryCtaLabel}
              </Button>
            ) : null}

            {secondaryCtaLabel && secondaryCta?.href ? (
              <Button asChild size="lg" className="gap-2 border px-6 py-5 border-foreground">
                <Link href={secondaryCta.href}>
                  {secondaryCtaLabel}
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      )}

      {stats?.length > 0 && (
        <ul className="mt-16 grid w-full grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
          {stats.map((stat, index) => {
            const bandAtBottom = index % 2 === 0
            const statTitle = t(stat.title)

            return (
              <li key={`${stat.stat}-${index}`} className="w-full min-w-0 list-none">
                <article
                  className={cn(
                    "flex h-[280px] w-full flex-col gap-4 sm:h-[360px] md:h-[440px] lg:h-[514px]",
                  )}
                >
                  <div
                    className={cn(
                      "relative min-h-0 w-full flex-3 overflow-hidden rounded-2xl sm:rounded-[28px]",
                      bandAtBottom ? "order-1" : "order-2",
                    )}
                  >
                    {stat.image ? (
                      <Image
                        src={stat.image}
                        alt={statTitle}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 3}
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" aria-hidden />
                    )}
                  </div>

                  <div
                    className={cn(
                      "flex min-h-0 w-full flex-2 flex-col justify-start gap-3 overflow-hidden rounded-2xl p-5 sm:rounded-[28px] sm:p-6",
                      bandAtBottom ? "order-2" : "order-1",
                    )}
                    style={{ backgroundColor: stat.backgroundColorCard }}
                  >
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      {BRAND_DOTS.map((color) => (
                        <span
                          key={color}
                          className="inline-block h-2 w-10 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <p className={`text-3xl font-bold tabular-nums leading-none text-foreground sm:text-5xl lg:text-[80px] ${stat.backgroundColorCard === '#F8F5EF' && 'text-background!'}`}>
                      {stat.stat}
                    </p>

                    {statTitle ? (
                      <p className={`text-[18px] leading-snug text-foreground/80 ${stat.backgroundColorCard === '#F8F5EF' && 'text-background!'}`}>
                        {statTitle}
                      </p>
                    ) : null}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </SectionWrapper>
  )
}
