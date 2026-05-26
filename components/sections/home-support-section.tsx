"use client"

import { motion } from "framer-motion"
import type { HomeSupportSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"

type Props = HomeSupportSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

/** Copies of the support list so one translate step equals exactly one copy. */
const COPIES = 4

export default function HomeSupportSection({
  title,
  subtitle,
  supports,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const subtitleText = t(subtitle)

  const items = (supports ?? []).filter(
    (s) => s && (t(s.title).trim() || t(s.description).trim()),
  )
  const loop =
    items.length > 0
      ? Array.from({ length: COPIES }, () => items).flat()
      : []
  const duration = Math.max(28, items.length * 9)
  const mobileDuration = Math.max(24, items.length * 7)

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      backgroundOverlayClassName="bg-black/30"
      className={cn(className, "overflow-hidden md:h-[80dvh]")}
      innerClassName="static"
    >
      <div className="relative z-10 mx-auto grid w-full items-center gap-10 md:min-h-[calc(80dvh-12rem)] md:w-[80%] md:grid-cols-[minmax(0,1fr)_minmax(18rem,28vw)] md:gap-12 lg:gap-16">
        <div className="flex min-h-[min(60vh,22rem)] flex-col justify-center md:min-h-0">
          {(titleText || subtitleText) ? (
            <div className="max-w-2xl space-y-0">
              {titleText ? (
                <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-4xl">
                  {titleText}
                </h2>
              ) : null}
              {subtitleText ? (
                <p className="text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-4xl">
                  {subtitleText}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className="-mx-5 overflow-hidden py-2 md:hidden">
            <motion.div
              className="flex w-max will-change-transform"
              animate={{ x: ["0%", `-${100 / COPIES}%`] }}
              transition={{
                duration: mobileDuration,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {loop.map((item, i) => {
                const cardTitle = t(item.title)
                const cardDescription = t(item.description)
                return (
                  <div
                    key={`support-mobile-marquee-${i}`}
                    className="mr-4 w-[82vw] max-w-sm shrink-0 pl-5 first:pl-5"
                    aria-hidden={i >= items.length ? true : undefined}
                  >
                    <div className="h-full rounded-[24px] bg-foreground p-6 text-background shadow-sm sm:rounded-[28px] sm:p-7">
                      {cardTitle ? (
                        <h3 className="text-lg font-bold leading-snug sm:text-2xl">
                          {cardTitle}
                        </h3>
                      ) : null}
                      {cardDescription ? (
                        <p className="mt-3 text-sm leading-relaxed text-background sm:text-base">
                          {cardDescription}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        ) : null}
      </div>

      {items.length > 0 ? (
        <div className="pointer-events-none absolute inset-y-0 right-[15%] z-10 hidden w-[min(32vw,34rem)] overflow-hidden md:block">
          <motion.div
            className="flex w-full flex-col items-end will-change-transform"
            animate={{ y: ["0%", `-${100 / COPIES}%`] }}
            transition={{
              duration,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {loop.map((item, i) => {
              const cardTitle = t(item.title)
              const cardDescription = t(item.description)
              return (
                <div
                  key={`support-desktop-marquee-${i}`}
                  className="mb-4 w-[min(36vw,450px)] shrink-0"
                  aria-hidden={i >= items.length ? true : undefined}
                >
                  <div className="rounded-[24px] bg-foreground p-6 text-background shadow-sm sm:rounded-[28px] sm:p-7 md:min-h-46 md:p-8">
                    {cardTitle ? (
                      <h3 className="text-lg font-bold leading-snug sm:text-2xl">
                        {cardTitle}
                      </h3>
                    ) : null}
                    {cardDescription ? (
                      <p className="mt-3 text-sm leading-relaxed text-background sm:text-base">
                        {cardDescription}
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      ) : null}
    </SectionWrapper>
  )
}
