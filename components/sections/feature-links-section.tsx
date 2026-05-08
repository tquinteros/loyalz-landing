"use client"

import Link from "next/link"
import {
  ArrowRight,
  BarChart,
  Gift,
  Mail,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { SectionWrapper } from "./section-wrapper"
import type { FeatureLinksSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"

/**
 * Icons are referenced from the DB as strings (e.g. "users") and resolved
 * here. Extend this map when new icons are added.
 */
const ICONS: Record<string, LucideIcon> = {
  users: Users,
  gift: Gift,
  mail: Mail,
  "bar-chart": BarChart,
  sparkles: Sparkles,
  zap: Zap,
}

type Props = FeatureLinksSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function FeatureLinksSection({
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
    <SectionWrapper backgroundImage={backgroundImage} className={className}>
      {(titleText || subtitleText) && (
        <div className="mx-auto mb-12 container text-center">
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = item.icon ? ICONS[item.icon] : undefined
          const itemTitle = t(item.title)
          const itemDescription = t(item.description)
          const content = (
            <>
              {Icon ? (
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
              ) : null}
              <h3 className="text-base font-semibold">{itemTitle}</h3>
              {itemDescription ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {itemDescription}
                </p>
              ) : null}
              {item.href ? (
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t({ es: "Saber más", en: "Learn more" })}
                  <ArrowRight className="size-4" />
                </span>
              ) : null}
            </>
          )

          const className =
            "group block h-full rounded-xl border bg-card p-6 text-left transition-colors hover:border-primary/50 hover:bg-accent"

          return item.href ? (
            <Link
              key={`${itemTitle}-${i}`}
              href={item.href}
              className={className}
            >
              {content}
            </Link>
          ) : (
            <div key={`${itemTitle}-${i}`} className={className}>
              {content}
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
