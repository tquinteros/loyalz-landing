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

/** Copies of the support list so `translateY(-100/COPIES%)` equals exactly one copy height. */
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

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      backgroundOverlayClassName="bg-black/30"
      className={cn(className, "")}
    >
      <div className="grid items-center lg:px-24 gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        <div className="flex min-h-[min(60vh,22rem)] flex-col justify-center md:min-h-112">
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
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] md:max-w-none md:rounded-[32px]">
            <div className="relative h-[min(70vh,32rem)] sm:h-[min(72vh,36rem)]">
              <motion.div
                className="flex w-full flex-col will-change-transform"
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
                      key={`support-marquee-${i}`}
                      className="mb-4 w-full lg:w-[450px]  shrink-0"
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
          </div>
        ) : null}
      </div>
    </SectionWrapper>
  )
}
