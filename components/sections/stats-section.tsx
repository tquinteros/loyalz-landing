import { SectionWrapper } from "./section-wrapper"
import type { StatsSectionProps } from "@/lib/types/Pages"

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
  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={className}
      innerClassName="max-w-5xl"
    >
      {(title || subtitle) && (
        <div className="mx-auto mb-10 max-w-2xl text-center">
          {title ? (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-3 text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      )}

      <dl className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
        {items.map((item, i) => (
          <div key={`${item.label}-${i}`}>
            <dt className="sr-only">{item.label}</dt>
            <dd className="text-4xl font-bold tracking-tight sm:text-5xl">
              {item.value}
            </dd>
            <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </dl>
    </SectionWrapper>
  )
}
