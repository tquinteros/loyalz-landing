"use client"

import Image from "next/image"
import type { ProductMechanicsSectionProps } from "@/lib/types/Pages"
import {
  MOBILE_CASE_ASPECT,
  MOBILE_CASE_SRC,
  MOBILE_SCREEN_INSET,
  mobileScreenForProduct,
} from "@/lib/products/mobile-screens"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"

type Props = ProductMechanicsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const STAT_SLOT_CLASS = [
  "top-[24%] right-[45%] mr-3 sm:mr-8 lg:mr-10",
  "top-[20%] left-[45%] ml-3 sm:ml-8 lg:ml-10",
  "bottom-[32%] right-full mr-3 sm:mr-6",
  "bottom-[28%] left-full ml-3 sm:ml-6",
] as const

const STAT_CARD_CLASS =
  "box-border flex h-[96px] w-full flex-col justify-center rounded-2xl border border-white/70 bg-white/70 p-4 shadow-[0_8px_32px_rgba(15,15,15,0.08)] backdrop-blur-[10px] backdrop-saturate-150 sm:h-[112px]"

export default function ProductMechanicsSection({
  product,
  title,
  backgroundColor,
  bottomLabelBackground,
  stats,
  className,
}: Props) {
  const t = useT()

  const titleText = t(title)
  const visibleStats = (stats ?? []).filter(
    (item) => t(item.title) || t(item.stat) || t(item.label),
  )
  const screenSrc = mobileScreenForProduct(product ?? "club")

  if (!titleText && visibleStats.length === 0) return null

  return (
    <section
      className={cn(
        "relative overflow-x-clip py-12 sm:overflow-visible sm:py-16 lg:py-20",
        className,
      )}
      style={backgroundColor?.trim() ? { backgroundColor } : undefined}
    >
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-16">
        <div className="relative mx-auto flex min-h-[360px] w-full max-w-5xl justify-center overflow-visible sm:min-h-[400px]">
          <div
            className="relative w-[min(78vw,300px)] max-w-[320px] shrink-0 overflow-visible"
            style={{ aspectRatio: MOBILE_CASE_ASPECT }}
          >
            {visibleStats.map((item, index) => {
              const statTitle = t(item.title)
              const statValue = t(item.stat)
              const statLabel = t(item.label)

              return (
                <div
                  key={`${statTitle}-${statValue}-${index}`}
                  className={cn(
                    "absolute z-30 w-[min(72vw,260px)] sm:w-[304px]",
                    STAT_SLOT_CLASS[index] ??
                      STAT_SLOT_CLASS[index % STAT_SLOT_CLASS.length],
                  )}
                >
                  <div className={STAT_CARD_CLASS}>
                    {statTitle ? (
                      <p className="text-xs leading-none text-background sm:text-base">
                        {statTitle}
                      </p>
                    ) : null}
                    {statValue ? (
                      <p className="mt-1 text-3xl leading-none text-background sm:text-[44px]">
                        {statValue}
                      </p>
                    ) : null}
                    {statLabel ? (
                      <span className="mt-2 inline-block w-fit rounded-full border border-background/10 bg-foreground/55 px-2.5 py-1 text-[11px] leading-none text-background">
                        {statLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              )
            })}

            <div
              className="absolute top-[-3%] z-0 overflow-hidden rounded-[1.35rem] lg:top-[-10%]"
              style={{
                left: MOBILE_SCREEN_INSET.left,
                right: MOBILE_SCREEN_INSET.right,
                bottom: MOBILE_SCREEN_INSET.bottom,
              }}
            >
              <Image
                src={screenSrc}
                alt=""
                fill
                className="object-contain object-center"
                sizes="(max-width: 640px) 78vw, 320px"
                priority
              />
            </div>
            <Image
              src={MOBILE_CASE_SRC}
              alt=""
              fill
              className="pointer-events-none z-10 object-fill"
              sizes="(max-width: 640px) 78vw, 320px"
              priority
            />
          </div>
        </div>
      </div>

      {titleText ? (
        <div
          className="relative z-30 -mt-6 w-full rounded-[32px] p-15 sm:-mt-10 lg:-mt-24"
          style={
            bottomLabelBackground?.trim()
              ? { backgroundColor: bottomLabelBackground }
              : undefined
          }
        >
          <p className="text-center whitespace-pre-line text-lg font-semibold leading-none text-foreground sm:text-2xl lg:text-[56px]">
            {titleText}
          </p>
        </div>
      ) : null}
    </section>
  )
}
