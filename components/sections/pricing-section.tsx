import { Check } from "lucide-react"
import type { PricingSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"

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
  return (
    <SectionWrapper backgroundImage={backgroundImage} className={`${className} bg-[#F8F5EF]`}>
      {(label || title || description) && (
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {label ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black">
              {label}
            </p>
          ) : null}
          {title ? (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          ) : null}
          {description ? (
            <p className="mt-3 text-black">{description}</p>
          ) : null}
        </div>
      )}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, i) => (
          <article key={`${card.title}-${i}`} className="rounded-2xl border bg-card p-6">
            <h3 className="text-2xl font-semibold">{card.title}</h3>
            <p className="mt-3 text-4xl font-bold tracking-tight">{card.price}</p>
            <p className="mt-1 text-sm text-black">{card.shops}</p>
            <p className="mt-4 inline-flex rounded-md border px-3 py-1 text-sm">
              Ahorras {card.savings}
            </p>
            <ul className="mt-6 space-y-2 border-t pt-4">
              {card.features.map((feature, index) => (
                <li key={`${feature}-${index}`} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {bottomMessage ? (
        <p className="mt-10 text-center text-xs text-black">{bottomMessage}</p>
      ) : null}
    </SectionWrapper>
  )
}
