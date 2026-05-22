"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type {
  AudienceEcosystemDetailItem,
  AudienceEcosystemProps,
} from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"
import { MARQUEE_COPIES } from "./utils"

type Props = {
  data: AudienceEcosystemProps | undefined
}

function EcosystemDetailCard({
  detail,
  label,
  title,
  description,
}: {
  detail: AudienceEcosystemDetailItem
  label: string
  title: string
  description: string
}) {
  const accent = detail.backgroundColor?.trim() || "#E85A4F"

  return (
    <article
      className="flex h-full w-full flex-col gap-3 rounded-[24px] border-[3px] border-solid bg-foreground p-6 sm:gap-4 sm:rounded-[28px] sm:p-8"
      style={{
        borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
      }}
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-xl sm:size-14"
        style={{ backgroundColor: accent }}
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
      <div>
        {title ? (
          <h3
            className="text-[30px] font-bold leading-[1.1] tracking-tight"
            style={{ color: accent }}
          >
            {title}
          </h3>
        ) : null}
        {label ? (
          <p
            className="text-sm font-medium leading-snug text-background/50 -mt-1 sm:text-base"
            style={{ opacity: 0.55 }}
          >
            {label}
          </p>
        ) : null}
      </div>
      {description ? (
        <p
          className="text-lg leading-relaxed"
          style={{ color: accent }}
        >
          {description}
        </p>
      ) : null}
    </article>
  )
}

export function AudienceEcosystemBlock({ data }: Props) {
  const t = useT()
  if (!data) return null

  const labelText = t(data.label)
  const titleText = t(data.title)
  const descriptionText = t(data.description)
  const bottomLabelText = t(data.bottomLabel)
  const ctaLabel = t(data.bottomCtaLabel)
  const details = (data.details ?? []).filter(
    (d) => t(d.title) || t(d.description) || t(d.label),
  )

  const hasHeader = labelText || titleText || descriptionText
  const hasFooter = bottomLabelText || (ctaLabel && data.bottomCtaHref)

  if (!hasHeader && details.length === 0 && !hasFooter) return null

  const loop =
    details.length > 0
      ? Array.from({ length: MARQUEE_COPIES }, () => details).flat()
      : []
  const marqueeDuration = Math.max(48, details.length * 14)

  return (
    <section className="mt-16 w-full overflow-hidden bg-background py-12 text-foreground sm:py-16 lg:py-20">
      {hasHeader ? (
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-5 text-center lg:px-16">
          {labelText ? (
            <div className="flex w-fit items-center gap-3 rounded border border-foreground px-3 py-2">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="text-foreground"
              >
                <rect width="10" height="10" rx="2" fill="currentColor" />
              </svg>
              <p className="text-sm tracking-widest text-foreground/90">
                {labelText}
              </p>
            </div>
          ) : null}
          {titleText ? (
            <h2 className="max-w-4xl text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[56px] lg:leading-[1.05]">
              {titleText}
            </h2>
          ) : null}
          {descriptionText ? (
            <p className="max-w-3xl text-lg leading-relaxed text-foreground/90">
              {descriptionText}
            </p>
          ) : null}
        </div>
      ) : null}

      {details.length > 0 ? (
        <div
          className={cn(
            "relative w-full overflow-hidden",
            hasHeader && "mt-12 sm:mt-16",
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
            {loop.map((detail, i) => {
              const sourceIndex = i % details.length
              return (
                <li
                  key={`${detail.backgroundColor}-${sourceIndex}-${i}`}
                  className="w-[min(100vw-3rem,300px)] shrink-0 pr-5 sm:w-[340px] sm:pr-6 lg:w-[380px]"
                  aria-hidden={i >= details.length ? true : undefined}
                >
                  <EcosystemDetailCard
                    detail={detail}
                    label={t(detail.label)}
                    title={t(detail.title)}
                    description={t(detail.description)}
                  />
                </li>
              )
            })}
          </motion.ul>
        </div>
      ) : null}

      {hasFooter ? (
        <div
          className={cn(
            "flex flex-col items-center gap-8 px-5 text-center lg:px-16",
            (hasHeader || details.length > 0) && "mt-12 sm:mt-16",
          )}
        >
          {bottomLabelText ? (
            <div className="flex w-full items-center justify-center gap-3 rounded-[10px] bg-foreground px-6 py-4 text-background sm:px-10 sm:py-5">
              <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.26499 22.4004L2.76762 19.1571L5.57848 15.3084L7.78392 12.757L4.49738 12.0218L0 10.5515L1.68652 5.31901L6.27038 6.78931L9.29746 8.08663L8.99475 4.80008V0H14.53V4.75684L14.2273 8.08663L17.2544 6.78931L21.8382 5.31901L23.5247 10.5515L19.0274 12.0218L15.7408 12.757L17.903 15.2651L20.7571 19.1571L16.2597 22.4004L13.4489 18.5517L11.7624 15.6976L10.0759 18.5084L7.26499 22.4004Z" fill="#FFB7A4" />
              </svg>
              <p className="text-base font-medium leading-snug sm:text-lg">
                {bottomLabelText}
              </p>
            </div>
          ) : null}

          {details.length > 0 ? (
            <div
              className="flex items-center justify-center gap-2"
              aria-hidden
            >
              {details.map((detail, i) => (
                <span
                  key={`indicator-${i}`}
                  className="h-1 w-10 rounded-full sm:w-12"
                  style={{
                    backgroundColor:
                      detail.backgroundColor?.trim() || "#E85A4F",
                  }}
                />
              ))}
            </div>
          ) : null}

          {ctaLabel && data.bottomCtaHref ? (
            <Button
              asChild
              size="lg"
              className="h-12 rounded-[10px] border-0 bg-foreground px-6 text-base font-semibold text-background shadow-none hover:bg-foreground/90"
            >
              <Link href={data.bottomCtaHref}>{ctaLabel}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
