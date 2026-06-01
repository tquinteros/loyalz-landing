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
import { SectionWrapper } from "./section-wrapper"

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

const GOLD_BOTTOM_LABEL = "#8C7F1F"

function normalizeHex(hex?: string) {
  return hex?.trim().replace(/^#/, "").toUpperCase()
}

export default function ProductMechanicsSection({
  product,
  label,
  mainTitle,
  title,
  backgroundColor,
  bottomLabelBackground,
  stats,
  backgroundImage,
  className,
}: Props) {
  const t = useT()

  const labelText = t(label)
  const mainTitleText = t(mainTitle)
  const titleText = t(title)
  const visibleStats = (stats ?? []).filter(
    (item) => t(item.title) || t(item.stat) || t(item.label),
  )
  const screenSrc = mobileScreenForProduct(product ?? "club")
  const useGoldStatText =
    normalizeHex(bottomLabelBackground) === normalizeHex(GOLD_BOTTOM_LABEL)

  if (!titleText && visibleStats.length === 0) return null

  return (
    <SectionWrapper
      surfaceColor={backgroundColor ?? null}
      backgroundImage={backgroundImage ?? null}
      className={cn("overflow-x-clip sm:overflow-visible pt-16!", className)}
      innerClassName="px-4 sm:px-6 lg:px-16"
    >
      <div className="relative mx-auto w-full max-w-5xl">
        {(labelText || mainTitleText) ? (
          <div className="mb-10 flex flex-col items-center gap-4 text-center sm:mb-20">
            {labelText ? (
              <div className="flex items-center gap-2 rounded border border-black/10 px-3 py-2 w-fit">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect width="10" height="10" rx="2" fill="black" />
                </svg>
                <p className="text-xs text-background sm:text-[14px]">
                  {labelText}
                </p>
              </div>
            ) : null}
            {mainTitleText ? (
              <h2 className="max-w-5xl text-balance text-[28px] font-bold leading-none text-background sm:text-[36px] lg:text-[56px]">
                {mainTitleText}
              </h2>
            ) : null}
          </div>
        ) : null}

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
                      <p
                        className={cn(
                          "text-xs leading-none sm:text-base",
                          !useGoldStatText && "text-background",
                        )}
                        style={
                          useGoldStatText
                            ? { color: GOLD_BOTTOM_LABEL }
                            : undefined
                        }
                      >
                        {statTitle}
                      </p>
                    ) : null}
                    {statValue ? (
                      <p
                        className={cn(
                          "mt-1 text-3xl leading-none sm:text-[44px]",
                          !useGoldStatText && "text-background",
                        )}
                        style={
                          useGoldStatText
                            ? { color: GOLD_BOTTOM_LABEL }
                            : undefined
                        }
                      >
                        {statValue}
                      </p>
                    ) : null}
                    {statLabel ? (
                      <span
                        className={cn(
                          "mt-2 inline-block w-fit rounded-full border px-2.5 py-1 text-[11px] leading-none",
                          useGoldStatText
                            ? "border-[#8C7F1F]/20 bg-[#8C7F1F]/10"
                            : "border-background/10 bg-foreground/55 text-background",
                        )}
                        style={
                          useGoldStatText
                            ? { color: GOLD_BOTTOM_LABEL }
                            : undefined
                        }
                      >
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
          className="relative z-30  rounded-[32px] p-15 sm:-mt-10 lg:-mt-24"
          style={
            bottomLabelBackground?.trim()
              ? { backgroundColor: bottomLabelBackground }
              : undefined
          }
        >
          <p className="whitespace-pre-line text-center text-lg font-semibold leading-none text-foreground sm:text-2xl lg:text-[56px]">
            {titleText}
          </p>
        </div>
      ) : null}
    </SectionWrapper>
  )
}
