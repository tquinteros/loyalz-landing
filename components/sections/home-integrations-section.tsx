"use client"

import Image from "next/image"
import type { HomeIntegrationsSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"

type Props = HomeIntegrationsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

function FeatureCard({
  title,
  description,
  backgroundColor,
}: {
  title: string
  description: string
  backgroundColor: string
}) {

  const opacityBorderColor = `color-mix(in srgb, ${backgroundColor} 40%, transparent)`

  return (
    <article
      className="flex h-full flex-col gap-4 rounded-4xl border-4 bg-foreground p-6 sm:p-8"
      style={{ borderColor: opacityBorderColor }}
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-[6px]"
        style={{ backgroundColor }}
      >
        <Image
          src="/logo.svg"
          alt=""
          width={22}
          height={22}
          className="filter-[brightness(0)_invert(1)]"
        />
      </div>

      {title ? (
        <h3
          className="text-xl text-left font-bold leading-tight sm:text-[32px]"
          style={{ color: backgroundColor }}
        >
          {title}
        </h3>
      ) : null}

      {description ? (
        <p
          className="text-sm text-left leading-relaxed sm:text-lg"
          style={{ color: backgroundColor }}
        >
          {description}
        </p>
      ) : null}
    </article>
  )
}

export default function HomeIntegrationsSection({
  label,
  title,
  description,
  image,
  infoFeatures,
  features,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const labelText = t(label)
  const titleText = t(title)
  const descriptionText = t(description)
  const infoFeaturesText = t(infoFeatures)
  const fallbackAlt = t({ es: "Integración Loyalz", en: "Loyalz integration" })

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn(className, "bg-background text-foreground")}
    >
      <div className="flex w-full flex-col items-center px-16 text-center">
        {(labelText || titleText || descriptionText) && (
          <div className="flex w-full flex-col items-center space-y-4">
            {labelText ? (
              <div className="flex w-fit items-center gap-3 rounded border border-foreground p-2 px-3">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect width="10" height="10" rx="2" fill="#F8F5EF" />
                </svg>
                <p className="text-xs tracking-widest text-foreground">{labelText}</p>
              </div>
            ) : null}

            {titleText ? (
              <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-4xl lg:text-[56px]">
                {titleText}
              </h2>
            ) : null}

            {descriptionText ? (
              <p className="max-w-2xl text-sm leading-relaxed text-foreground sm:text-lg">
                {descriptionText}
              </p>
            ) : null}
          </div>
        )}

        {image ? (
          <div
            className="relative mt-10 w-full overflow-hidden rounded-3xl sm:mt-12"
            style={{ aspectRatio: "1152 / 526" }}
          >
            <Image
              src={image}
              alt={titleText || fallbackAlt}
              fill
              className="object-cover scale-[1.3]"
              sizes="(max-width: 1024px) calc(100vw - 2.5rem), calc(100vw - 8rem)"
              priority
            />
          </div>
        ) : null}

        {infoFeaturesText ? (
          <h3 className="mt-16 max-w-3xl text-xl font-bold leading-tight tracking-tight sm:text-2xl lg:text-[32px]">
            {infoFeaturesText}
          </h3>
        ) : null}

        {features?.length > 0 ? (
          <ul className="mt-16 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {features.map((feature, index) => {
              const featureTitle = t(feature.title)
              const featureDescription = t(feature.description)

              return (
                <li key={`${featureTitle}-${index}`} className="list-none">
                  <FeatureCard
                    title={featureTitle}
                    description={featureDescription}
                    backgroundColor={feature.backgroundColor || "#754390"}
                  />
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </SectionWrapper>
  )
}
