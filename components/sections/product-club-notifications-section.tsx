"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ProductClubNotificationsSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"

type Props = ProductClubNotificationsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const ACCENT = "#754390"

const NOTIF_BRANDS = ["AIR COFFEE", "INNAMORATO", "COFI JAUS"] as const

/** Up to 3 badges; positions relative to the phone wrapper div */
const BADGE_POSITIONS = [
  "top-[6%] -right-[20%] z-[2] w-[75%]",
  "-left-[42%] top-[44%] z-[2] w-[75%]",
  "-left-[38%] top-[66%] z-[2] w-[75%]",
] as const

function NotifBadge({
  brand,
  text,
  nowLabel,
  positionClass,
}: {
  brand: string
  text: string
  nowLabel: string
  positionClass: string
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-2xl border border-foreground/20 px-3.5 py-3 shadow-xl backdrop-blur-md",
        positionClass,
      )}
      style={{ background: "#75439066" }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex size-4 shrink-0 items-center justify-center rounded-lg bg-background sm:size-6">
            <Image
              src="/logo.svg"
              alt=""
              width={12}
              height={12}
              className="size-4 brightness-0 invert sm:size-[12px]"
              aria-hidden
            />
          </div>
          <span className="truncate text-[11px] font-bold uppercase tracking-wide text-foreground sm:text-xs">
            {brand}
          </span>
        </div>
        <span className="shrink-0 text-[10px] text-foreground/90 sm:text-[11px]">
          {nowLabel}
        </span>
      </div>
      <p className="mt-2 text-[13px] font-medium leading-snug text-foreground sm:text-sm">
        {text}
      </p>
    </div>
  )
}

export default function ProductClubNotificationsSection({
  label,
  title,
  description,
  notifications,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const labelText = t(label)
  const titleText = t(title)
  const descriptionText = t(description)
  const visibleNotifs = (notifications ?? []).slice(0, 3)
  const nowLabel = t({ es: "ahora", en: "now" })

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn(
        "product-club-notifications relative z-0 overflow-x-clip lg:pb-0",
        className,
      )}
    >
      <div className="grid grid-cols-1 items-end gap-12 lg:min-h-[640px] lg:grid-cols-2 lg:gap-16">
        <div className="relative z-10 flex min-w-0 flex-col gap-5 self-center">
          {labelText ? (
            <div
              className="flex w-fit items-center gap-2 rounded-[4px] px-3 py-2"
              style={{ backgroundColor: ACCENT }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect width="10" height="10" rx="2" fill="#F8F5EF" />
              </svg>
              <p className="text-xs tracking-widest text-foreground sm:text-[13px]">
                {labelText}
              </p>
            </div>
          ) : null}

          {titleText ? (
            <h2
              className="text-[36px] font-bold leading-none tracking-tight sm:text-[48px] lg:text-[56px]"
              style={{ color: ACCENT }}
            >
              {titleText}
            </h2>
          ) : null}

          {descriptionText ? (
            <p className="max-w-2xl text-base leading-snug text-background sm:text-lg">
              {descriptionText}
            </p>
          ) : null}
        </div>

        <div className="relative z-0 hidden justify-center self-end overflow-visible lg:flex lg:justify-end">
          <div
            className="relative z-0 shrink-0 -mb-16 -translate-x-[10%] sm:-mb-20 sm:-translate-x-[15%] lg:-mb-24 lg:-translate-x-[20%]"
            style={{ width: "clamp(330px, 63vw, 480px)" }}
          >
            <div
              className="absolute z-0 overflow-hidden rounded-[12%]"
              style={{ inset: "3.5% 3.5% 3% 3.5%" }}
            >
              <Image
                src="/club/club-notifications.png"
                alt=""
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 63vw, 480px"
                priority
              />
            </div>

            <Image
              src="/products/case-products.png"
              alt=""
              width={560}
              height={1140}
              className="pointer-events-none relative z-[1] h-auto w-full select-none"
              sizes="(max-width: 1024px) 63vw, 480px"
              priority
            />

            {visibleNotifs.map((notif, i) => {
              const text = t(notif)
              if (!text) return null
              return (
                <NotifBadge
                  key={i}
                  brand={NOTIF_BRANDS[i % NOTIF_BRANDS.length]}
                  text={text}
                  nowLabel={nowLabel}
                  positionClass={BADGE_POSITIONS[i % BADGE_POSITIONS.length]}
                />
              )
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
