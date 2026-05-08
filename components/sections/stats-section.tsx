"use client"

import { SectionWrapper } from "./section-wrapper"
import type { StatsSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"

type Props = StatsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function StatsSection({
  title,
  subtitle,
  items,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const subtitleText = t(subtitle)

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={className}
      innerClassName="max-w-5xl"
    >
      {(titleText || subtitleText) && (
        <div className="mx-auto mb-10 max-w-2xl text-center">
          {titleText ? (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {titleText}
            </h2>
          ) : null}
          {subtitleText ? (
            <p className="mt-3 text-muted-foreground">{subtitleText}</p>
          ) : null}
        </div>
      )}

      <dl className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
        {items.map((item, i) => {
          const labelText = t(item.label)
          return (
            <div key={`${labelText}-${i}`}>
              <dt className="sr-only">{labelText}</dt>
              <dd className="text-4xl font-bold tracking-tight sm:text-5xl">
                {item.value}
              </dd>
              <p className="mt-2 text-sm text-muted-foreground">{labelText}</p>
            </div>
          )
        })}
      </dl>
    </SectionWrapper>
  )
}
