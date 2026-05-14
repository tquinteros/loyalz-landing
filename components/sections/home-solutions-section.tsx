"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { HomeSolutionsSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"

type Props = HomeSolutionsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function HomeSolutionsSection({
  label,
  title,
  images,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const labelText = t(label)
  const titleText = t(title)
  const primaryLabel = t(primaryCtaLabel)
  const secondaryLabel = t(secondaryCtaLabel)
  const fallbackAlt = t({ es: "Solución", en: "Solution" })

  const tiles = (images ?? []).filter((tile) => tile && tile.url?.trim())

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={cn(className, "")}>
      {(labelText || titleText) && (
        <div className="mb-10 space-y-4 sm:mb-14">
          {labelText ? (
            <div className="flex w-fit items-center gap-3 rounded border border-black/10 p-2 px-3">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="10" height="10" rx="2" fill="currentColor" />
              </svg>
              <p className="text-xs tracking-widest text-background/80">
                {labelText}
              </p>
            </div>
          ) : null}
          {titleText ? (
            <h2 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-background sm:text-4xl lg:text-[56px]">
              {titleText}
            </h2>
          ) : null}
        </div>
      )}

      {tiles.length > 0 && (
        <div className="mx-auto grid w-full max-w-[90%] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-20">
          {tiles.map((tile, i) => {
            const captionText = t(tile.caption)
            return (
              <motion.div
                key={`${tile.url}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.08,
                }}
                className="group relative aspect-3/4 w-full overflow-hidden rounded-[24px] bg-black/20"
              >
                <Image
                  src={tile.url}
                  alt={captionText || titleText || fallbackAlt}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {captionText ? (
                  <>
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/70 via-black/40 to-transparent"
                    />
                    <p className="absolute inset-x-0 bottom-0 px-5 pb-5 text-left text-lg font-bold leading-snug text-foreground sm:px-6 sm:pb-6 sm:text-xl">
                      {captionText}
                    </p>
                  </>
                ) : null}
              </motion.div>
            )
          })}
        </div>
      )}

      {(primaryLabel || secondaryLabel) && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-14 sm:gap-4">
          {primaryLabel && primaryCtaHref ? (
            <Button
              asChild
              size="lg"
              className="h-12 rounded-[12px] border-0 bg-background px-8 text-base font-semibold text-foreground shadow-none hover:bg-background/90"
            >
              <Link href={primaryCtaHref}>{primaryLabel}</Link>
            </Button>
          ) : null}
          {secondaryLabel && secondaryCtaHref ? (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-[12px] border-2 border-background bg-transparent px-8 text-base font-semibold text-background shadow-none hover:bg-background/10 hover:text-background"
            >
              <Link href={secondaryCtaHref}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      )}
    </SectionWrapper>
  )
}
