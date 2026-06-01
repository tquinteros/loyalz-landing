"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { ProductStepsSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"

type Props = ProductStepsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function ProductStepsSection({
  title,
  steps,
  primaryCta,
  secondaryCta,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const primaryCtaLabel = t(primaryCta?.label)
  const secondaryCtaLabel = t(secondaryCta?.label)
  const fallbackAlt = t({ es: "Paso", en: "Step" })

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const validSteps = (steps ?? []).filter(
    (step) => t(step.title) || t(step.description) || step.image?.trim(),
  )

  const accent = validSteps[0]?.backgroundColor?.trim() || "#754390"
  const sectionSurface = `${accent}33`

  const previewIndex = hoveredIndex ?? 0
  const previewStep = validSteps[Math.min(previewIndex, Math.max(validSteps.length - 1, 0))]
  const previewSrc = previewStep?.image?.trim()
  const previewAlt = previewStep ? t(previewStep.title) : fallbackAlt

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      surfaceColor={sectionSurface}
      innerClassName="px-5!"
      className={cn("py-5!", className)}
    >
      <div className="overflow-hidden rounded-[24px] bg-foreground p-6 lg:p-12 sm:rounded-[24px]">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left — step image preview */}
          <div className="relative min-h-[240px] min-w-0 overflow-hidden rounded-[24px] bg-background sm:min-h-[320px] lg:min-h-[720px]">
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

          {/* Right — title + steps */}
          <div className="flex min-w-0 flex-col justify-center">
            {titleText ? (
              <h2 className="mb-8 lg:pl-12 max-w-xl text-2xl font-bold leading-none tracking-tight text-background sm:text-3xl lg:mb-16 lg:text-4xl">
                {titleText}
              </h2>
            ) : null}

            {validSteps.length > 0 ? (
              <ol className="space-y-4 lg:space-y-6" onMouseLeave={() => setHoveredIndex(null)}>
                {validSteps.map((step, index) => {
                  const isActive = hoveredIndex === index
                  const stepTitle = t(step.title)
                  const stepDesc = t(step.description)
                  const accent = step.backgroundColor?.trim() || "#754390"

                  return (
                    <li key={`${stepTitle}-${index}`}>
                      <button
                        type="button"
                        className={cn(
                          "group w-full border-l-4 py-5 lg:pl-6 pr-2 text-left transition-colors",
                          "border-transparent focus-visible:outline-none",
                        )}
                        style={{
                          borderLeftColor: isActive ? accent : "transparent",
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
                        <div className="flex flex-col gap-2 pl-4 sm:flex-row sm:items-start sm:gap-10 lg:gap-16">
                          <span
                            className={cn(
                              "shrink-0 font-semibold tabular-nums text-3xl leading-none tracking-tight transition-colors sm:text-4xl",
                              "underline decoration-2 underline-offset-4",
                              !isActive && "text-background decoration-background/30",
                            )}
                            style={
                              isActive
                                ? { color: accent, textDecorationColor: `${accent}66` }
                                : undefined
                            }
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            {stepTitle ? (
                              <h3
                                className={cn(
                                  "text-lg font-bold leading-none transition-colors sm:text-2xl",
                                  !isActive && "text-background",
                                )}
                                style={isActive ? { color: accent } : undefined}
                              >
                                {stepTitle}
                              </h3>
                            ) : null}
                            {stepDesc ? (
                              <p
                                className={cn(
                                  "text-sm leading-snug transition-colors sm:text-lg sm:leading-none",
                                  !isActive && "text-background",
                                )}
                                style={isActive ? { color: accent } : undefined}
                              >
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

        {(primaryCta?.href && primaryCtaLabel) ||
        (secondaryCta?.href && secondaryCtaLabel) ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-16 sm:mb-8 sm:gap-4">
            {primaryCta?.href && primaryCtaLabel ? (
              <Button
                asChild
                size="lg"
                className="h-12 rounded-[12px] border-0 bg-background px-8 text-base font-semibold text-foreground shadow-none hover:bg-background/90"
              >
                <Link href={primaryCta.href}>{primaryCtaLabel}</Link>
              </Button>
            ) : null}
            {secondaryCta?.href && secondaryCtaLabel ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-[12px] border-2 border-background bg-transparent px-8 text-base font-semibold text-background shadow-none hover:bg-transparent hover:text-background hover:opacity-75 duration-300 transition-all"
              >
                <Link href={secondaryCta.href}>{secondaryCtaLabel}</Link>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </SectionWrapper>
  )
}
