"use client"

import type { ClubCardsSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

type Props = ClubCardsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function ClubCardsSection({
  label,
  title,
  subtitle,
  cards,
  backgroundImage,
  className,
}: Props) {
  return (
    <SectionWrapper backgroundImage={backgroundImage} className={`${className} bg-chart-5`}>
      <div className="space-y-6">
        {(label || title || subtitle) && (
          <div className="space-y-3">
            {label ? (
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {label}
              </p>
            ) : null}
            {title ? <h2 className="text-3xl font-bold text-foreground sm:text-5xl">{title}</h2> : null}
            {subtitle ? (
              <p className="max-w-3xl text-base sm:text-lg text-foreground">{subtitle}</p>
            ) : null}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <Card key={`${card.title}-${index}`} className="rounded-xl border">
              <CardContent className="p-5">
                <CardTitle className="text-xl font-semibold text-foreground">
                  {card.title}
                </CardTitle>
                {card.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {card.description}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
