"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import type { StepsClubSectionProps } from "@/lib/types/Pages"
import { SectionWrapper } from "./section-wrapper"
import { cn } from "@/lib/utils"

type Props = StepsClubSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function StepsClubSection({
  title,
  steps,
  backgroundImage,
  className,
}: Props) {
  /** `null` = not hovering any step (preview shows first step; no chart-5 highlight). */
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!steps.length) {
    return (
      <SectionWrapper backgroundImage={backgroundImage} className={className}>
        {title ? (
          <h2 className="text-2xl font-bold whitespace-pre-line sm:text-4xl">
            {title}
          </h2>
        ) : null}
      </SectionWrapper>
    )
  }

  const previewIndex = hoveredIndex ?? 0
  const previewStep = steps[Math.min(previewIndex, steps.length - 1)]
  const previewSrc = previewStep?.image

  return (
    <div className="bg-red-500 p-6">
      <SectionWrapper backgroundImage={backgroundImage} className={`${className} rounded-2xl`}>
        <div className="overflow-hidden rounded-[24px] bg-foreground p-5 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-0">
            {/* Left: preview image — 50% width on lg */}
            <div className="relative min-h-[240px] min-w-0 overflow-hidden rounded-[24px] lg:min-h-[420px]">
              <AnimatePresence mode="sync" initial={false}>
                {previewSrc ? (
                  <motion.div
                    key={previewIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <Image
                      src={previewSrc}
                      alt={previewStep.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={previewIndex === 0}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    Elegí un paso para ver la imagen
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: title + steps — 50% width on lg; border = column divider */}
            <div className="flex min-w-0 flex-col pt-8 lg:pt-0 lg:pl-8 xl:pl-10">
              {title ? (
                <h2 className="mb-8 text-2xl max-w-md font-bold leading-tight tracking-tight whitespace-pre-line sm:text-3xl lg:text-4xl">
                  {title}
                </h2>
              ) : null}

              <ol
                className="space-y-0"
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {steps.map((step, index) => {
                  const isActive = hoveredIndex === index
                  return (
                    <li key={`${step.title}-${index}`}>
                      <button
                        type="button"
                        className={cn(
                          "group w-full border-l-4 py-5 pr-2 text-left transition-colors",
                          "border-transparent focus-visible:border-chart-5 focus-visible:outline-none",
                          isActive && "border-chart-5",
                        )}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onFocus={() => setHoveredIndex(index)}
                        onBlur={(e) => {
                          const next = e.relatedTarget as Node | null
                          if (next && e.currentTarget.closest("ol")?.contains(next))
                            return
                          setHoveredIndex(null)
                        }}
                      >
                        <div className="flex flex-col gap-2 pl-4 sm:flex-row sm:items-center sm:gap-16">
                          <span
                            className={cn(
                              "shrink-0 font-semibold tabular-nums text-3xl tracking-tight transition-colors",
                              "underline decoration-2 underline-offset-4",
                              isActive
                                ? "text-chart-5 decoration-chart-5/40"
                                : "text-background decoration-border",
                            )}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1 space-y-2">
                            <h3
                              className={cn(
                                "text-lg font-bold transition-colors sm:text-xl",
                                isActive ? "text-chart-5" : "text-background",
                              )}
                            >
                              {step.title}
                            </h3>
                            {step.description ? (
                              <p
                                className={cn(
                                  "text-sm leading-relaxed transition-colors sm:text-base",
                                  isActive
                                    ? "text-chart-5"
                                    : "text-background",
                                )}
                              >
                                {step.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}
