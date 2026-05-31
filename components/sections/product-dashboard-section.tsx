"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { ProductDashboardFeatureItem, ProductDashboardSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"

const MARQUEE_COPIES = 4

type Props = ProductDashboardSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

function FeatureCard({
  item,
  color,
  title,
  description,
}: {
  item: ProductDashboardFeatureItem
  color: string
  title: string
  description: string
}) {
  return (
    <article
      className="flex h-full w-full flex-col gap-3 rounded-[24px] border-[3px] border-solid bg-foreground p-6 sm:gap-4 sm:rounded-[28px] sm:p-8"
      style={{
        borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
      }}
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-xl sm:size-14"
        style={{ backgroundColor: color }}
        aria-hidden
      >
        <Image
          src="/logo.svg"
          alt=""
          width={28}
          height={28}
          className="size-7 object-contain brightness-0 invert sm:size-8"
        />
      </span>

      {title ? (
        <h3
          className="text-xl font-bold leading-none sm:text-[32px]"
          style={{ color }}
        >
          {title}
        </h3>
      ) : null}

      {description ? (
        <p
          className="text-sm leading-none text-background sm:text-lg"
          style={{ color }}
        >
          {description}
        </p>
      ) : null}
    </article>
  )
}

export default function ProductDashboardSection({
  label,
  title,
  image,
  subtitle,
  features,
  color,
  primaryCta,
  secondaryCta,
}: Props) {
  const t = useT()

  const labelText = t(label)
  const titleText = t(title)
  const subtitleText = t(subtitle)
  const primaryCtaLabel = t(primaryCta?.label)
  const secondaryCtaLabel = t(secondaryCta?.label)

  const accent = color?.trim() || "#754390"
  const useCarousel = features.length > 3

  const loop = useCarousel
    ? Array.from({ length: MARQUEE_COPIES }, () => features).flat()
    : features

  const marqueeDuration = Math.max(48, features.length * 14)

  return (
    <section className="w-full overflow-hidden bg-background py-16 text-foreground sm:py-24">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 px-5 text-center lg:px-16">
        {labelText ? (
          <div className="flex w-fit items-center gap-3 rounded border border-foreground px-3 py-2">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="10" height="10" rx="2" fill="currentColor" />
            </svg>
            <p className="text-sm tracking-widest text-foreground">{labelText}</p>
          </div>
        ) : null}

        {titleText ? (
          <h2 className="max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {titleText}
          </h2>
        ) : null}
      </div>

      {/* Image */}
      {image ? (
        <div className="relative mx-auto mt-10 w-full max-w-4xl px-5 lg:px-16">
          <Image
            src={image}
            alt={titleText || "Dashboard"}
            width={1200}
            height={750}
            className="w-full rounded-2xl object-cover shadow-2xl"
          />
        </div>
      ) : null}

      {/* Subtitle */}
      {subtitleText ? (
        <p className="mt-16 px-5 text-center text-lg font-semibold text-foreground sm:text-[32px] lg:px-16">
          {subtitleText}
        </p>
      ) : null}

      {/* Features */}
      {features.length > 0 ? (
        <div className={`relative w-full overflow-hidden ${subtitleText || image ? "mt-16" : "mt-16"}`}>
          {useCarousel ? (
            <motion.ul
              className="flex w-max items-stretch"
              animate={{ x: ["0%", `-${100 / MARQUEE_COPIES}%`] }}
              transition={{
                duration: marqueeDuration,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {loop.map((feature, i) => {
                const sourceIndex = i % features.length
                const featureTitle = t(feature.title)
                const featureDescription = t(feature.description)
                return (
                  <li
                    key={`${sourceIndex}-${i}`}
                    className="w-[min(100vw-3rem,280px)] shrink-0 pr-5 sm:w-[320px] sm:pr-6 lg:w-[360px]"
                    aria-hidden={i >= features.length ? true : undefined}
                  >
                    <FeatureCard
                      item={feature}
                      color={accent}
                      title={featureTitle}
                      description={featureDescription}
                    />
                  </li>
                )
              })}
            </motion.ul>
          ) : (
            <ul className="grid grid-cols-1 gap-5 px-5 sm:grid-cols-3 lg:px-16">
              {features.map((feature, i) => {
                const featureTitle = t(feature.title)
                const featureDescription = t(feature.description)
                return (
                  <li key={i}>
                    <FeatureCard
                      item={feature}
                      color={accent}
                      title={featureTitle}
                      description={featureDescription}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : null}

      {/* CTAs */}
      {(primaryCtaLabel && primaryCta?.href) || (secondaryCtaLabel && secondaryCta?.href) ? (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 px-5 lg:px-16">
          {primaryCtaLabel && primaryCta?.href ? (
            <Button
              asChild
              size="lg"
              className="h-12 rounded-[10px] border-0 bg-foreground px-6 text-base font-semibold text-background shadow-none hover:bg-foreground"
            >
              <Link href={primaryCta.href}>{primaryCtaLabel}</Link>
            </Button>
          ) : null}

          {secondaryCtaLabel && secondaryCta?.href ? (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-[10px] border-foreground px-6 text-base font-semibold text-foreground shadow-none"
            >
              <Link href={secondaryCta.href}>{secondaryCtaLabel}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
