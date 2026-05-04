"use client"

import Image from "next/image"
import type { ClubActivationSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { cn } from "@/lib/utils"

type Props = ClubActivationSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function ClubActivationSection({
  title,
  activationCards,
  bottomLabel,
  backgroundImage,
  className,
}: Props) {
  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn("bg-background", className)}
    >
      <div className="w-full space-y-8 sm:space-y-6">
        {title ? (
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h2>
        ) : null}

        <ul className="grid w-full grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
          {activationCards.map((card, index) => {
            const bandAtBottom = index % 2 === 0

            return (
              <li
                key={`${card.title}-${index}`}
                className="w-full min-w-0 list-none"
              >
                <article
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl sm:rounded-[28px]",
                    "h-[280px] sm:h-[360px] md:h-[440px] lg:h-[514px]",
                  )}
                >
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 514px"
                      priority={index < 3}
                      
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted" aria-hidden />
                  )}

                  <div
                    className={cn(
                      "absolute z-10 flex h-[42%] flex-col justify-start gap-2 overflow-hidden rounded-[18px] sm:h-[38%] sm:rounded-[22px] sm:p-6 lg:h-[33%] lg:rounded-3xl",
                      "bg-[#F8F5EF] p-5 text-foreground shadow-sm",
                      "left-4 right-4 sm:left-5 sm:right-5",
                      bandAtBottom
                        ? "bottom-4 sm:bottom-5"
                        : // Mobile: band always at bottom; sm+: alternate → top
                        "bottom-4 top-auto sm:bottom-auto sm:top-5",
                    )}
                  >
                    {card.stat ? (
                      <p className="text-3xl font-bold tabular-nums leading-none text-background sm:text-5xl lg:text-[80px]">
                        {card.stat}
                      </p>
                    ) : null}
                    {card.title ? (
                      <p className="text-base leading-snug text-background sm:text-lg">
                        <span className="font-bold">{card.title}</span>
                        {card.description ? (
                          <span className="font-normal">
                            {" "}
                            {card.description}
                          </span>
                        ) : null}
                      </p>
                    ) : null}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>

        {bottomLabel ? (
          <div className="bg-chart-5 rounded-2xl p-4 py-8">
            <p className="text-center text-xl font-medium text-foreground sm:text-6xl">
              {bottomLabel}
            </p>
          </div>
        ) : null}
      </div>
    </SectionWrapper>
  )
}
