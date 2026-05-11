"use client"

import type { ClubCardsSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useT } from "@/providers/language-provider"

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
  const t = useT()
  const labelText = t(label)
  const titleText = t(title)
  const subtitleText = t(subtitle)

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={`${className} bg-chart-5`}>
      <div className="space-y-6">
        {(labelText || titleText) && (
          <div className="space-y-3">
            <div className="flex flex-col gap-2 lg:px-14 ">
              {labelText ?
                <div className="flex p-2 px-3 rounded-[5px] items-center gap-2 border w-fit border-[#9067A3]">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="10" height="10" rx="2" fill="#F8F5EF" />
                  </svg>
                  <p className="text-xs font-semibold text-foreground tracking-wider">
                    {labelText}
                  </p>
                </div>
                : null}
              {titleText ? <h2 className="text-3xl max-w-7xl font-bold text-foreground sm:text-6xl">{titleText}</h2> : null}
            </div>

          </div>
        )}
        <div className="flex flex-col mt-12 lg:mt-56 gap-6">
          {subtitleText ? (
            <p className="font-bold text-base sm:text-3xl text-foreground">{subtitleText}</p>
          ) : null}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => {
              const cardTitle = t(card.title)
              const cardDescription = t(card.description)
              return (
                <Card key={`${cardTitle}-${index}`} className="rounded-xl bg-foreground border-4 p-8 border-[#DBC5E8]">
                  <CardContent className="p-0">
                    <div className="border p-2 border-[#DBC5E8] rounded-lg w-fit">
                      <svg width="29" height="24" viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.25 15.625L25 11.5625L28.75 11.875L23.25 16.6562L24.875 23.75L21.6875 21.8125L20.25 15.625ZM17.3125 6.5L16 3.4375L17.4375 0L20.3125 6.78125L17.3125 6.5ZM4.78125 23.75L6.8125 14.9688L0 9.0625L9 8.28125L12.5 0L16 8.28125L25 9.0625L18.1875 14.9688L20.2188 23.75L12.5 19.0938L4.78125 23.75Z" fill="#754390" />
                      </svg>
                    </div>
                    <CardTitle className="text-[32px] font-bold text-chart-5 my-3">
                      {cardTitle}
                    </CardTitle>
                    {cardDescription ? (
                      <p className="mt-2 text-lg leading-relaxed text-background">
                        {cardDescription}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
