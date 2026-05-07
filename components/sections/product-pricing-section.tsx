"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { ProductPricingSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { cn } from "@/lib/utils"

type Props = ProductPricingSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function ProductPricingSection({
  label,
  title,
  description,
  cards,
  backgroundImage,
  className,
}: Props) {
  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn("bg-background", className)}
    >
      <div className="w-full space-y-8 sm:space-y-10">
        {(label || title || description) && (
          <div className="max-w-7xl space-y-2 text-left">
            {label ? (
              <div className="flex items-center gap-2 rounded border border-foreground/20 bg-background/30 px-4 py-2 w-fit">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="10" height="10" rx="2" fill="#F8F5EF" />
                </svg>
                <p className="text-xs font-semibold text-foreground tracking-wider">
                  {label}
                </p>
              </div>
            ) : null}
            {title ? (
              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-base text-foreground/90 sm:text-xl">{description}</p>
            ) : null}
          </div>
        )}

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => {
            const isFree = Number(card.price) === 0

            return (
              <li key={`${card.title}-${index}`} className="h-full list-none">
                <motion.article
                  className={cn(
                    "flex h-[380px] flex-col rounded-3xl p-6 text-foreground sm:h-[420px]",
                  )}
                  style={{
                    backgroundColor: card.color || "#754390",
                    transformOrigin: "100% 100%",
                  }}
                  whileHover={{ rotate: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <p
                    className={cn(
                      "text-lg font-semibold",
                      isFree ? "invisible" : "text-foreground",
                    )}
                    aria-hidden={isFree}
                  >
                    Desde
                  </p>
                  <p className="mt-2 text-6xl font-bold leading-none">
                    {isFree ? "Free" : `$${card.price}`}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-lg font-medium",
                      isFree ? "invisible" : "text-foreground/90",
                    )}
                    aria-hidden={isFree}
                  >
                    usd/mes
                  </p>

                  <h3 className="mt-5 text-4xl font-bold leading-tight">{card.title}</h3>
                  <p className="mt-3 text-lg leading-snug text-foreground/90">
                    {card.description}
                  </p>

                  <Link
                    href={card.href || "#"}
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-xl font-medium text-foreground/90 transition-colors hover:text-foreground"
                  >
                    {card.ctaLabel || "Explorar"}
                    <span aria-hidden>›</span>
                  </Link>
                </motion.article>
              </li>
            )
          })}
        </ul>
      </div>
    </SectionWrapper>
  )
}
