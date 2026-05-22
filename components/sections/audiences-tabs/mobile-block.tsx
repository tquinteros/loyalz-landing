"use client"

import Image from "next/image"
import type { AudienceMobileProps } from "@/lib/types/Pages"
import {
  MOBILE_CASE_ASPECT,
  MOBILE_CASE_SRC,
  MOBILE_SCREEN_INSET,
  mobileScreenForTab,
} from "@/lib/audiences/mobile-screens"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"

type Props = {
  tabKey: string
  data: AudienceMobileProps | undefined
}

/** Floating beside the phone — left / right of the frame. */
const STAT_SLOT_CLASS = [
  "top-[24%] right-[45%] mr-3 sm:mr-8 lg:mr-10",
  "top-[20%] left-[45%] ml-3 sm:ml-8 lg:ml-10",
  "bottom-[32%] right-full mr-3 sm:mr-6",
  "bottom-[28%] left-full ml-3 sm:ml-6",
] as const

const STAT_CARD_CLASS =
  "rounded-2xl border border-white/70 bg-white/70 p-4 shadow-[0_8px_32px_rgba(15,15,15,0.08)] backdrop-blur-[10px] backdrop-saturate-150 sm:p-5"

export function AudienceMobileBlock({ tabKey, data }: Props) {
  const t = useT()
  if (!data) return null

  const titleText = t(data.title)
  const stats = (data.stats ?? []).filter(
    (item) => t(item.title) || t(item.stat) || t(item.label),
  )
  const screenSrc = mobileScreenForTab(tabKey)

  if (!titleText && stats.length === 0) return null

  return (
    <section className="relative overflow-x-clip py-12 sm:overflow-visible sm:py-16 lg:py-20">
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        {/* Phone + floating stats on the sides */}
        <div className="relative mx-auto flex min-h-[360px] w-full max-w-5xl justify-center overflow-visible sm:min-h-[400px]">
          <div
            className="relative shrink-0 overflow-visible w-[min(78vw,300px)] max-w-[320px]"
            style={{ aspectRatio: MOBILE_CASE_ASPECT }}
          >
            {stats.map((item, index) => {
              const statTitle = t(item.title)
              const statValue = t(item.stat)
              const statLabel = t(item.label)

              return (
                <div
                  key={`${statTitle}-${statValue}-${index}`}
                  className={cn(
                    "absolute z-30 w-52 sm:w-64",
                    STAT_SLOT_CLASS[index] ??
                    STAT_SLOT_CLASS[index % STAT_SLOT_CLASS.length],
                  )}
                >
                  <div className={STAT_CARD_CLASS}>
                    {statTitle ? (
                      <p className="text-xs text-background sm:text-lg">
                        {statTitle}
                      </p>
                    ) : null}
                    {statValue ? (
                      <p className="mt-1 text-3xl text-background sm:text-[54px]">
                        {statValue}
                      </p>
                    ) : null}
                    {statLabel ? (
                      <span className="mt-2 inline-block rounded-full border border-background/10 bg-foreground/55 px-2.5 py-1 text-[11px] text-background sm:text-xs">
                        {statLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              )
            })}

            <div
              className="absolute z-0 overflow-hidden rounded-[1.35rem]"
              style={{
                top: MOBILE_SCREEN_INSET.top,
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

        {/* Bottom title banner */}
      </div>
      {titleText ? (
        <div className="relative bg-background z-30 w-full -mt-6 sm:-mt-10 lg:-mt-24 rounded-[32px] p-15">
          <p className="text-center whitespace-pre-line text-lg font-semibold leading-snug text-foreground sm:text-2xl lg:text-[56px] lg:leading-[1.2]">
            {titleText}
          </p>
        </div>
      ) : null}
    </section>
  )
}
