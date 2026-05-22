"use client"

import Image from "next/image"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { AudienceStepsProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"

type Props = {
  data: AudienceStepsProps | undefined
}

export function AudienceStepsBlock({ data }: Props) {
  const t = useT()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!data) return null

  const titleText = t(data.title)
  const steps = (data.steps ?? []).filter(
    (step) => t(step.title) || t(step.description) || step.image?.trim(),
  )

  if (!titleText && steps.length === 0) return null

  const fallbackAlt = t({ es: "Paso", en: "Step" })
  const previewIndex = hoveredIndex ?? 0
  const previewStep = steps[Math.min(previewIndex, Math.max(steps.length - 1, 0))]
  const previewSrc = previewStep?.image?.trim()
  const previewAlt = previewStep ? t(previewStep.title) : fallbackAlt

  return (
    <div className="overflow-hidden rounded-[28px] p-8 sm:rounded-[32px] lg:p-12">
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative min-h-[240px] min-w-0 overflow-hidden rounded-[24px] bg-foreground/5 sm:min-h-[320px] lg:min-h-[420px]">
          <AnimatePresence mode="sync" initial={false}>
            {previewSrc ? (
              <motion.div
                key={previewIndex}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              >
                <Image
                  src={previewSrc}
                  alt={previewAlt || fallbackAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={previewIndex === 0}
                />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-background"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                {t({
                  es: "Pasá el cursor sobre un paso para ver la imagen.",
                  en: "Hover a step to preview its image.",
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex min-w-0 flex-col justify-center">
          {titleText ? (
            <h2 className="mb-8 max-w-xl text-2xl font-bold leading-tight tracking-tight text-background sm:text-3xl lg:mb-10 lg:text-4xl">
              {titleText}
            </h2>
          ) : null}

          {steps.length > 0 ? (
            <ol className="space-y-0" onMouseLeave={() => setHoveredIndex(null)}>
              {steps.map((step, index) => {
                const isActive = hoveredIndex === index
                const stepTitle = t(step.title)
                const stepDesc = t(step.description)
                const stepBg = step.backgroundColor?.trim() || "#F8F5EF"

                return (
                  <li key={`${stepTitle}-${index}`}>
                    <button
                      type="button"
                      className={cn(
                        "group w-full border-l-4 py-5 pr-2 text-left transition-colors",
                        "border-transparent focus-visible:outline-none",
                      )}
                      style={{
                        borderLeftColor: isActive ? stepBg : "transparent",
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onFocus={() => setHoveredIndex(index)}
                      onBlur={(e) => {
                        const next = e.relatedTarget as Node | null
                        if (next && e.currentTarget.closest("ol")?.contains(next))
                          return
                        setHoveredIndex(null)
                      }}
                    >
                      <div className="flex items-start gap-4 pl-4 sm:gap-5">
                        <span
                          className="flex size-[50px] shrink-0 items-center justify-center rounded-[10px]"
                          style={{ backgroundColor: stepBg }}
                          aria-hidden
                        >
                          <Image
                            src="/logo.svg"
                            alt=""
                            width={28}
                            height={28}
                            className="size-7 object-contain brightness-0 invert"
                          />
                        </span>
                        <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
                          {stepTitle ? (
                            <h3
                              className={cn(
                                "text-lg font-bold leading-snug transition-colors sm:text-xl",
                                !isActive && "text-background",
                              )}
                              style={isActive ? { color: stepBg } : undefined}
                            >
                              {stepTitle}
                            </h3>
                          ) : null}
                          {stepDesc ? (
                            <p className="text-sm leading-relaxed text-background sm:text-base">
                              {stepDesc}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ol>
          ) : null}
        </div>
      </div>
    </div>
  )
}
