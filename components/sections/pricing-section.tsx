"use client"
import { CircleCheck } from "lucide-react"
import type { PricingSectionProps } from "@/lib/types/Pages"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { SectionWrapper } from "./section-wrapper"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
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

  const pricingStyles = useMemo(() => {
    if (pathname?.startsWith("/club")) {
      return {
        cardBackground: "bg-[#DBC5E8]",
        cardHover: "hover:bg-chart-5 hover:text-foreground",
        cardText: "text-chart-5",
        savingsButton: "bg-chart-5 text-white border-chart-5",
      }
    }

    return {
      cardBackground: "bg-black/5",
      cardHover: "hover:bg-background hover:text-foreground",
      cardText: "text-background",
      savingsButton: "bg-background text-foreground",
    }
  }, [pathname])

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={`${className} bg-foreground`}>
      {(label || title || description) && (
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {label ? (
            <p className={`mb-3 text-xs ${pricingStyles.cardText} font-semibold uppercase tracking-widest `}>
              {label}
            </p>
          ) : null}
          {title ? (
            <h2 className={`text-4xl ${pricingStyles.cardText} font-bold tracking-tight sm:text-6xl max-w-2xl mx-auto`}>{title}</h2>
          ) : null}
          {description ? (
            <p className={`mt-3 ${pricingStyles.cardText}`}>{description}</p>
          ) : null}
        </div>
      )}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, i) => (
          <Card
            key={`${card.title}-${i}`}
            className={`group border-none rounded-2xl transition-colors duration-200 ${pricingStyles.cardHover} ${pricingStyles.cardBackground}`}
          >
            <CardContent className="p-6">
              {
                pathname === "/" && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-[#754390] w-10 h-[7px] rounded-full"></div>
                    <div className="bg-primary w-10 h-[7px] rounded-full"></div>
                    <div className="bg-accent w-10 h-[7px] rounded-full"></div>
                    <div className="bg-secondary w-10 h-[7px] rounded-full"></div>
                  </div>
                )
              }
              <CardTitle className={`text-2xl transition-colors duration-200 group-hover:text-foreground ${pricingStyles.cardText}`}>
                {card.title}
              </CardTitle>
              <p className={`mt-3 text-7xl font-bold tracking-tight transition-colors duration-200 group-hover:text-foreground ${pricingStyles.cardText}`}>
                {card.price}
              </p>
              <p className={`text-md mt-1 transition-colors font-bold duration-200 group-hover:text-foreground ${pricingStyles.cardText}`}>
                usd/mes
              </p>
              <p className={`mt-4 text-sm transition-colors duration-200 group-hover:text-foreground ${pricingStyles.cardText}`}>
                {card.shops}
              </p>
              <p className={`mt-4 inline-flex w-full items-center justify-center rounded-[14px] border px-3 py-3 text-center text-sm transition-colors duration-200 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground ${pricingStyles.savingsButton}`}>
                Ahorras {card.savings}
              </p>
              <ul className={`mt-6 space-y-2 pt-4 transition-colors duration-200 group-hover:border-foreground/40 ${pricingStyles.cardText}`}>
                {card.features.map((feature, index) => (
                  <li
                    key={`${feature}-${index}`}
                    className={`flex items-center border-b pb-2 border-background group-hover:border-foreground gap-2 text-lg transition-colors duration-200 group-hover:text-foreground ${pricingStyles.cardText}`}
                  >
                    <CircleCheck className={`size-4 transition-colors duration-200 group-hover:text-foreground ${pricingStyles.cardText}`} />
                    <span className={`transition-colors duration-200 group-hover:text-foreground ${pricingStyles.cardText}`}>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {bottomMessage ? (
        <p className={`mt-16 text-center text-md ${pricingStyles.cardText}`}>{bottomMessage}</p>
      ) : null}
    </SectionWrapper>
  )
}
