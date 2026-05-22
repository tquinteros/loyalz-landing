"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { AudienceDemoProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"
import { MARQUEE_COPIES } from "./utils"

type Props = {
  data: AudienceDemoProps | undefined
}

function borderMuted(bg: string, opacity: number) {
  return `color-mix(in srgb, ${bg} ${opacity}%, transparent)`
}

function DemoFeatureCard({
  title,
  description,
  sectionBg,
}: {
  title: string
  description: string
  sectionBg: string
}) {
  return (
    <article
      className="flex h-full w-full flex-col gap-3 rounded-[24px] border-4 border-solid bg-foreground p-6 sm:gap-4 sm:rounded-[28px] sm:p-8"
      style={{
        borderColor: borderMuted(sectionBg, 20),
        color: sectionBg,
      }}
    >
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="49" height="49" rx="11.5" fill="#F8F5EF" />
        <rect x="0.5" y="0.5" width="49" height="49" rx="11.5" stroke="#DBC5E8" />
        <mask id="mask0_218_5810" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="10" y="10" width="30" height="30">
          <rect x="10" y="10" width="30" height="30" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_218_5810)">
          <path d="M25 38.75C22.6667 38.75 20.5208 38.2188 18.5625 37.1562C16.6042 36.0938 15 34.6771 13.75 32.9062V36.25H11.25V28.75H18.75V31.25H15.6562C16.6562 32.75 17.974 33.9583 19.6094 34.875C21.2448 35.7917 23.0417 36.25 25 36.25C26.5625 36.25 28.026 35.9531 29.3906 35.3594C30.7552 34.7656 31.9427 33.9635 32.9531 32.9531C33.9635 31.9427 34.7656 30.7552 35.3594 29.3906C35.9531 28.026 36.25 26.5625 36.25 25H38.75C38.75 26.8958 38.3906 28.6771 37.6719 30.3438C36.9531 32.0104 35.9688 33.4688 34.7188 34.7188C33.4688 35.9688 32.0104 36.9531 30.3438 37.6719C28.6771 38.3906 26.8958 38.75 25 38.75ZM23.875 33.75V32.125C22.8958 31.8958 22.099 31.474 21.4844 30.8594C20.8698 30.2448 20.4167 29.4375 20.125 28.4375L22.1875 27.625C22.4375 28.4792 22.8281 29.1198 23.3594 29.5469C23.8906 29.974 24.5 30.1875 25.1875 30.1875C25.875 30.1875 26.4635 30.026 26.9531 29.7031C27.4427 29.3802 27.6875 28.875 27.6875 28.1875C27.6875 27.5833 27.4323 27.0938 26.9219 26.7188C26.4115 26.3438 25.5 25.9167 24.1875 25.4375C22.9583 25 22.0573 24.4792 21.4844 23.875C20.9115 23.2708 20.625 22.4792 20.625 21.5C20.625 20.6458 20.9219 19.8698 21.5156 19.1719C22.1094 18.474 22.9167 18.0208 23.9375 17.8125V16.25H26.125V17.8125C26.875 17.875 27.5573 18.1771 28.1719 18.7188C28.7865 19.2604 29.2083 19.8958 29.4375 20.625L27.4375 21.4375C27.2708 20.9583 27 20.5573 26.625 20.2344C26.25 19.9115 25.7292 19.75 25.0625 19.75C24.3333 19.75 23.776 19.9062 23.3906 20.2188C23.0052 20.5312 22.8125 20.9583 22.8125 21.5C22.8125 22.0417 23.0521 22.4688 23.5312 22.7812C24.0104 23.0938 24.875 23.4583 26.125 23.875C27.625 24.4167 28.625 25.0521 29.125 25.7812C29.625 26.5104 29.875 27.3125 29.875 28.1875C29.875 28.7917 29.7708 29.3229 29.5625 29.7812C29.3542 30.2396 29.0781 30.6302 28.7344 30.9531C28.3906 31.276 27.9896 31.5365 27.5312 31.7344C27.0729 31.9323 26.5833 32.0833 26.0625 32.1875V33.75H23.875ZM11.25 25C11.25 23.1042 11.6094 21.3229 12.3281 19.6562C13.0469 17.9896 14.0313 16.5312 15.2812 15.2812C16.5312 14.0313 17.9896 13.0469 19.6562 12.3281C21.3229 11.6094 23.1042 11.25 25 11.25C27.3333 11.25 29.4792 11.7812 31.4375 12.8438C33.3958 13.9062 35 15.3229 36.25 17.0938V13.75H38.75V21.25H31.25V18.75H34.3438C33.3438 17.25 32.026 16.0417 30.3906 15.125C28.7552 14.2083 26.9583 13.75 25 13.75C23.4375 13.75 21.974 14.0469 20.6094 14.6406C19.2448 15.2344 18.0573 16.0365 17.0469 17.0469C16.0365 18.0573 15.2344 19.2448 14.6406 20.6094C14.0469 21.974 13.75 23.4375 13.75 25H11.25Z" fill="#754390" />
        </g>
      </svg>
      {title ? (
        <h3 className="text-xl font-bold leading-tight sm:text-3xl">{title}</h3>
      ) : null}
      {description ? (
        <p className="text-base leading-6 opacity-90 sm:text-lg">
          {description}
        </p>
      ) : null}
    </article>
  )
}

export function AudienceDemoBlock({ data }: Props) {
  const t = useT()
  if (!data) return null

  const sectionBg = data.backgroundColor?.trim() || "#6B4E9B"
  const labelText = t(data.label)
  const titleText = t(data.title)
  const descriptionText = t(data.description)
  const ctaLabel = t(data.ctaLabel)
  const imageSrc = data.image?.trim()
  const features = (data.features ?? []).filter(
    (f) => t(f.title) || t(f.description),
  )

  const hasHero =
    labelText ||
    titleText ||
    descriptionText ||
    (ctaLabel && data.ctaHref) ||
    imageSrc

  if (!hasHero && features.length === 0) return null

  const loop =
    features.length > 0
      ? Array.from({ length: MARQUEE_COPIES }, () => features).flat()
      : []
  const marqueeDuration = Math.max(48, features.length * 14)

  return (
    <section
      className="mt-16 w-full overflow-x-hidden py-12 text-foreground sm:py-16 lg:py-20"
      style={{ backgroundColor: sectionBg }}
    >
      {hasHero ? (
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-0">
          <div className="flex min-h-[280px] flex-col justify-between px-5 sm:min-h-[360px] lg:min-h-[520px] lg:px-16 lg:pr-8">
            {labelText ? (
              <p className="text-xl text-foreground/90 sm:text-[32px] max-w-md">
                {labelText}
              </p>
            ) : (
              <span aria-hidden className="block h-px" />
            )}
            <div className="mt-8 space-y-6 lg:mt-0">
              {titleText ? (
                <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[60px] lg:leading-[1.05]">
                  {titleText}
                </h2>
              ) : null}
              {descriptionText ? (
                <p className="max-w-lg text-lg leading-8 font-bold text-foreground/70 sm:text-[32px]">
                  {descriptionText}
                </p>
              ) : null}
              {ctaLabel && data.ctaHref ? (
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-md border-0 bg-foreground px-8 text-base font-semibold text-background shadow-none hover:bg-foreground/90"
                >
                  <Link href={data.ctaHref}>{ctaLabel}</Link>
                </Button>
              ) : null}
            </div>
          </div>

          {imageSrc ? (
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[520px]">
              <div
                className="absolute inset-y-0 left-5 right-0 overflow-hidden rounded-[20px] border-20 border-solid sm:left-8 lg:left-auto lg:-right-[20%] lg:w-[calc(100%+20%)]"
                style={{ borderColor: borderMuted(sectionBg, 20) }}
              >
                <Image
                  src={imageSrc}
                  alt={titleText || ""}
                  fill
                  className="object-cover rounded-20"
                  sizes="(max-width: 1024px) 90vw, 55vw"
                  priority
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {features.length > 0 ? (
        <div
          className={cn(
            "relative w-full overflow-hidden",
            hasHero && "mt-12 sm:mt-16 lg:mt-20",
          )}
        >
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
              return (
                <li
                  key={`demo-feature-${sourceIndex}-${i}`}
                  className="w-[min(100vw-3rem,280px)] shrink-0 pr-5 sm:w-[320px] sm:pr-2 lg:w-[360px]"
                  aria-hidden={i >= features.length ? true : undefined}
                >
                  <DemoFeatureCard
                    title={t(feature.title)}
                    description={t(feature.description)}
                    sectionBg={sectionBg}
                  />
                </li>
              )
            })}
          </motion.ul>
        </div>
      ) : null}
    </section>
  )
}
