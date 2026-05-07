"use client"

import Image from "next/image"
import type { HomeActivationSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { cn } from "@/lib/utils"

type Props = HomeActivationSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function HomeActivationSection({
  title,
  activationCards,
  brands,
  bottomLabel,
  backgroundImage,
  className,
}: Props) {
  const marqueeBrands = [...(brands ?? []), ...(brands ?? [])]

  return (
    <div className="py-16 sm:py-24 flex flex-col gap-8">
      <SectionWrapper
        backgroundImage={backgroundImage}
        className={cn("bg-background py-0 sm:py-0", className)}
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
                      "w-full",
                      "h-[280px] sm:h-[360px] md:h-[440px] lg:h-[514px]",
                      "flex flex-col gap-4",
                    )}
                  >
                    <div
                      className={cn(
                        "relative min-h-0 w-full flex-3 overflow-hidden rounded-2xl sm:rounded-[28px]",
                        bandAtBottom
                          ? "order-1"
                          : "order-2",
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
                        <div className="h-full w-full bg-muted" aria-hidden />
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex min-h-0 w-full flex-2 flex-col justify-start gap-2 overflow-hidden rounded-2xl p-5 text-foreground sm:rounded-[28px] sm:p-6",
                        "bg-[#F8F5EF]",
                        bandAtBottom
                          ? "order-2"
                          : "order-1",
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
            <div className="p-4 py-8">
              <p className="text-center text-xl font-medium text-foreground sm:text-6xl">
                {bottomLabel}
              </p>
            </div>
          ) : null}

        </div>
      </SectionWrapper>
      {brands?.length ? (
        <div className="w-full overflow-hidden">
          <div className="home-activation-marquee flex w-max min-w-full items-center gap-10">
            {marqueeBrands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex items-center gap-3 whitespace-nowrap"
              >
                <div className="relative h-8 w-24 sm:h-10 sm:w-28">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name || "Brand logo"}
                      fill
                      className="object-contain"
                      sizes="112px"
                    />
                  ) : (
                    <div className="h-full w-full rounded-md bg-muted" aria-hidden />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground/80 sm:text-base">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>

  )
}
