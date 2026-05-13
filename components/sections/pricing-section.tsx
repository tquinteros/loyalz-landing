"use client"
import { CircleCheck } from "lucide-react"
import type { PricingSectionProps } from "@/lib/types/Pages"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { SectionWrapper } from "./section-wrapper"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { useT } from "@/providers/language-provider"
import Image from "next/image"
import { cn } from "@/lib/utils"

type Props = PricingSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function PricingSection({
  label,
  title,
  description,
  bottomMessage,
  cards,
  backgroundImage,
  className,
}: Props) {
  const pathname = usePathname()
  const t = useT()

  const labelText = t(label)
  const titleText = t(title)
  const descriptionText = t(description)
  const bottomMessageText = t(bottomMessage)

  const pricingStyles = useMemo(() => {
    if (pathname?.startsWith("/club")) {
      return {
        cardBackground: "bg-[#DBC5E8]",
        cardHover: "hover:bg-chart-5 hover:text-foreground",
        cardText: "text-chart-5",
        savingsButton: "bg-chart-5 text-foreground border-chart-5",
      }
    }

    return {
      cardBackground: "bg-black/5",
      cardHover: "hover:bg-background hover:text-background",
      cardText: "text-background",
      savingsButton: "bg-background text-foreground",
    }
  }, [pathname])

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={`${className} bg-foreground`}>
      {(labelText || titleText || descriptionText) && (
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {labelText ? (
            <p className={`mb-3 text-xs ${pricingStyles.cardText} font-semibold uppercase tracking-widest `}>
              {labelText}
            </p>
          ) : null}
          {titleText ? (
            <h2 className={`text-4xl ${pricingStyles.cardText} font-bold tracking-tight sm:text-6xl max-w-2xl mx-auto`}>{titleText}</h2>
          ) : null}
          {descriptionText ? (
            <p className={`mt-3 ${pricingStyles.cardText}`}>{descriptionText}</p>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, i) => {
          const cardTitle = t(card.title)
          const cardShops = t(card.shops)
          const isSecondCard = i === 1
          const isThirdCard = i === 2
          /** Light surface — use foreground ink so copy stays readable (inverted vs translucent cards). */
          const cardTextClass = isThirdCard ? "text-foreground" : pricingStyles.cardText
          const savingsClass = isThirdCard
            ? "border-transparent bg-foreground text-background"
            : pricingStyles.savingsButton

          return (
            <Card
              key={`${cardTitle}-${i}`}
              className={cn(
                "group rounded-2xl transition-colors duration-200",
                isThirdCard ? "bg-background" : "bg-black/5",
                isSecondCard ? "border-[6px] border-solid border-background" : "border-none",
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 bg-foreground rounded-[16px] p-3">
                  <div className="bg-chart-5 p-2 rounded-[6px] w-fit">
                    <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_3_3489)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.0131 0.416016C13.7015 0.416016 14.2719 0.920367 14.3738 1.57916C14.3738 1.57041 14.374 1.58788 14.3738 1.57916L14.3901 4.45046C14.3901 4.45922 14.3898 4.44174 14.3897 4.45046C14.3897 5.20842 15.0052 5.81415 15.7643 5.81415L27.9674 5.62599C28.0267 5.62599 28.0843 5.63351 28.1392 5.64762C28.1502 5.65044 28.1611 5.65352 28.1718 5.65686C28.4408 5.74041 28.6389 5.98451 28.6538 6.2769C28.6544 6.28859 28.6547 6.30036 28.6547 6.3122V27.9849C28.6547 28.3639 28.347 28.6711 27.9674 28.6711L15.6302 28.8593V28.8583C14.8698 28.8583 14.2533 28.2427 14.2533 27.4834L14.2524 24.6514C14.2524 23.8934 13.637 23.279 12.8779 23.279H0.664202C0.284649 23.279 -0.0230408 22.9717 -0.0230408 22.5927V1.10222C-0.0230408 1.09038 -0.0227389 1.07862 -0.0221458 1.06693C-0.00730984 0.774532 0.190831 0.530435 0.45982 0.446887C0.470582 0.443544 0.481456 0.440459 0.492437 0.437637C0.541855 0.424941 0.593422 0.417579 0.646486 0.416238C0.652373 0.416089 0.658279 0.416016 0.664202 0.416016H13.0131ZM7.47402 5.81415C6.71357 5.81415 6.0971 6.42969 6.0971 7.18899V16.506C6.0971 17.2653 6.71357 17.8808 7.47401 17.8808L12.6666 17.9005H13.0131C13.7736 17.9005 14.3901 18.516 14.3901 19.2753L14.3898 21.9065C14.39 21.8978 14.3898 21.9153 14.3898 21.9065C14.3898 22.6645 15.0052 23.279 15.7643 23.279H21.1682C21.9286 23.279 22.5451 22.6634 22.5451 21.9041V12.5871C22.5451 11.8278 21.9286 11.2123 21.1682 11.2123H15.9494L15.6302 11.2076C14.8698 11.2076 14.2533 10.592 14.2533 9.83273V9.36155H14.2524V7.18656C14.2524 6.4286 13.637 5.81415 12.8779 5.81415H7.47402Z" fill="#DBC5E8" />
                      </g>
                      <defs>
                        <clipPath id="clip0_3_3489">
                          <rect width="28.6726" height="29.2548" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="bg-accent p-2 rounded-[6px] w-fit">
                    <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_3_3491)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.0131 0.416016C13.7015 0.416016 14.2719 0.920367 14.3738 1.57916C14.3738 1.57041 14.374 1.58788 14.3738 1.57916L14.3901 4.45046C14.3901 4.45922 14.3898 4.44174 14.3897 4.45046C14.3897 5.20842 15.0052 5.81415 15.7643 5.81415L27.9674 5.62599C28.0267 5.62599 28.0843 5.63351 28.1392 5.64762C28.1502 5.65044 28.1611 5.65352 28.1718 5.65686C28.4408 5.74041 28.6389 5.98451 28.6538 6.2769C28.6544 6.28859 28.6547 6.30036 28.6547 6.3122V27.9849C28.6547 28.3639 28.347 28.6711 27.9674 28.6711L15.6302 28.8593V28.8583C14.8698 28.8583 14.2533 28.2427 14.2533 27.4834L14.2524 24.6514C14.2524 23.8934 13.637 23.279 12.8779 23.279H0.664202C0.284649 23.279 -0.0230408 22.9717 -0.0230408 22.5927V1.10222C-0.0230408 1.09038 -0.0227389 1.07862 -0.0221458 1.06693C-0.00730984 0.774532 0.190831 0.530435 0.45982 0.446887C0.470582 0.443544 0.481456 0.440459 0.492437 0.437637C0.541855 0.424941 0.593422 0.417579 0.646486 0.416238C0.652373 0.416089 0.658279 0.416016 0.664202 0.416016H13.0131ZM7.47402 5.81415C6.71357 5.81415 6.0971 6.42969 6.0971 7.18899V16.506C6.0971 17.2653 6.71357 17.8808 7.47401 17.8808L12.6666 17.9005H13.0131C13.7736 17.9005 14.3901 18.516 14.3901 19.2753L14.3898 21.9065C14.39 21.8978 14.3898 21.9153 14.3898 21.9065C14.3898 22.6645 15.0052 23.279 15.7643 23.279H21.1682C21.9286 23.279 22.5451 22.6634 22.5451 21.9041V12.5871C22.5451 11.8278 21.9286 11.2123 21.1682 11.2123H15.9494L15.6302 11.2076C14.8698 11.2076 14.2533 10.592 14.2533 9.83273V9.36155H14.2524V7.18656C14.2524 6.4286 13.637 5.81415 12.8779 5.81415H7.47402Z" fill="#E2DDB3" />
                      </g>
                      <defs>
                        <clipPath id="clip0_3_3491">
                          <rect width="28.6726" height="29.2548" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="bg-chart-2 p-2 rounded-[6px] w-fit">
                    <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_3_3493)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.0131 0.416016C13.7015 0.416016 14.2719 0.920367 14.3738 1.57916C14.3738 1.57041 14.374 1.58788 14.3738 1.57916L14.3901 4.45046C14.3901 4.45922 14.3898 4.44174 14.3897 4.45046C14.3897 5.20842 15.0052 5.81415 15.7643 5.81415L27.9674 5.62599C28.0267 5.62599 28.0843 5.63351 28.1392 5.64762C28.1502 5.65044 28.1611 5.65352 28.1718 5.65686C28.4408 5.74041 28.6389 5.98451 28.6538 6.2769C28.6544 6.28859 28.6547 6.30036 28.6547 6.3122V27.9849C28.6547 28.3639 28.347 28.6711 27.9674 28.6711L15.6302 28.8593V28.8583C14.8698 28.8583 14.2533 28.2427 14.2533 27.4834L14.2524 24.6514C14.2524 23.8934 13.637 23.279 12.8779 23.279H0.664202C0.284649 23.279 -0.0230408 22.9717 -0.0230408 22.5927V1.10222C-0.0230408 1.09038 -0.0227389 1.07862 -0.0221458 1.06693C-0.00730984 0.774532 0.190831 0.530435 0.45982 0.446887C0.470582 0.443544 0.481456 0.440459 0.492437 0.437637C0.541855 0.424941 0.593422 0.417579 0.646486 0.416238C0.652373 0.416089 0.658279 0.416016 0.664202 0.416016H13.0131ZM7.47402 5.81415C6.71357 5.81415 6.0971 6.42969 6.0971 7.18899V16.506C6.0971 17.2653 6.71357 17.8808 7.47401 17.8808L12.6666 17.9005H13.0131C13.7736 17.9005 14.3901 18.516 14.3901 19.2753L14.3898 21.9065C14.39 21.8978 14.3898 21.9153 14.3898 21.9065C14.3898 22.6645 15.0052 23.279 15.7643 23.279H21.1682C21.9286 23.279 22.5451 22.6634 22.5451 21.9041V12.5871C22.5451 11.8278 21.9286 11.2123 21.1682 11.2123H15.9494L15.6302 11.2076C14.8698 11.2076 14.2533 10.592 14.2533 9.83273V9.36155H14.2524V7.18656C14.2524 6.4286 13.637 5.81415 12.8779 5.81415H7.47402Z" fill="#B2C8D9" />
                      </g>
                      <defs>
                        <clipPath id="clip0_3_3493">
                          <rect width="28.6726" height="29.2548" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className={cn("text-2xl font-bold", cardTextClass)}>
                    +
                  </span>
                  <div className="bg-primary p-2 rounded-[6px] w-fit">
                    <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_3_3524)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.0131 0.416016C13.7015 0.416016 14.2719 0.920367 14.3738 1.57916C14.3738 1.57041 14.374 1.58788 14.3738 1.57916L14.3901 4.45046C14.3901 4.45922 14.3898 4.44174 14.3897 4.45046C14.3897 5.20842 15.0052 5.81415 15.7643 5.81415L27.9674 5.62599C28.0267 5.62599 28.0843 5.63351 28.1392 5.64762C28.1502 5.65044 28.1611 5.65352 28.1718 5.65686C28.4408 5.74041 28.6389 5.98451 28.6538 6.2769C28.6544 6.28859 28.6547 6.30036 28.6547 6.3122V27.9849C28.6547 28.3639 28.347 28.6711 27.9674 28.6711L15.6302 28.8593V28.8583C14.8698 28.8583 14.2533 28.2427 14.2533 27.4834L14.2524 24.6514C14.2524 23.8934 13.637 23.279 12.8779 23.279H0.664202C0.284649 23.279 -0.0230408 22.9717 -0.0230408 22.5927V1.10222C-0.0230408 1.09038 -0.0227389 1.07862 -0.0221458 1.06693C-0.00730984 0.774532 0.190831 0.530435 0.45982 0.446887C0.470582 0.443544 0.481456 0.440459 0.492437 0.437637C0.541855 0.424941 0.593422 0.417579 0.646486 0.416238C0.652373 0.416089 0.658279 0.416016 0.664202 0.416016H13.0131ZM7.47402 5.81415C6.71357 5.81415 6.0971 6.42969 6.0971 7.18899V16.506C6.0971 17.2653 6.71357 17.8808 7.47401 17.8808L12.6666 17.9005H13.0131C13.7736 17.9005 14.3901 18.516 14.3901 19.2753L14.3898 21.9065C14.39 21.8978 14.3898 21.9153 14.3898 21.9065C14.3898 22.6645 15.0052 23.279 15.7643 23.279H21.1682C21.9286 23.279 22.5451 22.6634 22.5451 21.9041V12.5871C22.5451 11.8278 21.9286 11.2123 21.1682 11.2123H15.9494L15.6302 11.2076C14.8698 11.2076 14.2533 10.592 14.2533 9.83273V9.36155H14.2524V7.18656C14.2524 6.4286 13.637 5.81415 12.8779 5.81415H7.47402Z" fill="#FFB7A4" />
                      </g>
                      <defs>
                        <clipPath id="clip0_3_3524">
                          <rect width="28.6726" height="29.2548" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className={cn("text-[10px] max-w-5xl transition-colors duration-200", cardTextClass)}>
                    POS + Pay incluidos gratis en todos los planes.
                  </span>
                </div>
                {/* {
                  pathname === "/" && (
                    <div className="flex items-center gap-2 mb-6">
                      <div className="bg-[#754390] w-10 h-[7px] rounded-full"></div>
                      <div className="bg-primary w-10 h-[7px] rounded-full"></div>
                      <div className="bg-accent w-10 h-[7px] rounded-full"></div>
                      <div className="bg-secondary w-10 h-[7px] rounded-full"></div>
                    </div>
                  )
                } */}
                <CardTitle
                  className={cn("text-[56px] transition-colors duration-200", cardTextClass)}
                >
                  {cardTitle}
                </CardTitle>
                <p
                  className={cn(
                    "mt-3 text-7xl font-bold tracking-tight transition-colors duration-200",
                    cardTextClass,
                  )}
                >
                  {card.price}
                </p>
                <p
                  className={cn(
                    "text-md mt-1 font-bold transition-colors duration-200",
                    cardTextClass,
                  )}
                >
                  {t({ es: "usd/mes", en: "usd/month" })}
                </p>
                <p className={cn("mt-4 text-sm transition-colors duration-200", cardTextClass)}>
                  {cardShops}
                </p>
                <p
                  className={cn(
                    "mt-4 inline-flex w-full items-center justify-center rounded-[14px] border px-3 py-3 text-center text-sm transition-colors duration-200",
                    savingsClass,
                  )}
                >
                  {t({ es: "Ahorras", en: "Save" })} {card.savings}
                </p>
                {pathname?.startsWith("/club") ? (
                  <ul
                    className={cn(
                      "mt-6 space-y-2 pt-4 transition-colors duration-200 group-hover:border-foreground/40",
                      cardTextClass,
                    )}
                  >
                    {card.features.map((feature, index) => {
                      const featureText = t(feature)
                      return (
                        <li
                          key={`${featureText}-${index}`}
                          className={cn(
                            "group-hover:border-foreground flex items-center gap-2 border-b pb-2 text-lg transition-colors duration-200",
                            isThirdCard ? "border-foreground/15" : "border-background",
                            cardTextClass,
                          )}
                        >
                          <CircleCheck
                            className={cn("size-4 transition-colors duration-200", cardTextClass)}
                          />
                          <span className={cn("transition-colors duration-200", cardTextClass)}>
                            {featureText}
                          </span>
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
        <p className={`mt-16 text-center text-lg ${pricingStyles.cardText}`}>{bottomMessageText}</p>
      ) : null}
    </SectionWrapper>
  )
}
