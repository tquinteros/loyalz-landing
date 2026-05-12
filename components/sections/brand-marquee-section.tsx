"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import type { BrandMarqueeSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"

type Props = BrandMarqueeSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

/**
 * Number of copies of the brand list rendered in the strip.
 * Higher = guarantees the strip is wider than any viewport, even with very
 * few brands. The animation translates by exactly `100 / COPIES`%, which
 * equals the width of one copy and produces a seamless wrap.
 */
const COPIES = 4

export default function BrandMarqueeSection({
  title,
  brands,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)

  const items = (brands ?? []).filter((b) => b && b.logo?.trim())
  // Repeat N times so each "cell" (item + its right padding) has identical
  // width, which makes the -1/COPIES translate land exactly on the start of
  // the next copy — no half-gap, no blank space.
  const loop =
    items.length > 0
      ? Array.from({ length: COPIES }, () => items).flat()
      : []
  const duration = Math.max(20, items.length * 4)

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn("overflow-hidden", className)}
      innerClassName="px-0! lg:px-0!"
    >
      {titleText ? (
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="text-2xl font-bold tracking-tight text-background sm:text-3xl lg:text-[32px]">
            {titleText}
          </h2>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="relative w-full overflow-hidden">
          <motion.ul
            className="flex w-max items-center"
            animate={{ x: ["0%", `-${100 / COPIES}%`] }}
            transition={{
              duration,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {loop.map((brand, i) => (
              <li
                key={`${brand.logo}-${i}`}
                className="relative flex h-12 shrink-0 items-center justify-center pr-12 sm:h-16 sm:pr-16 lg:pr-20"
                aria-hidden={i >= items.length ? true : undefined}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name ?? ""}
                  width={180}
                  height={64}
                  className="h-full w-auto object-contain"
                />
              </li>
            ))}
          </motion.ul>
        </div>
      ) : null}
    </SectionWrapper>
  )
}
