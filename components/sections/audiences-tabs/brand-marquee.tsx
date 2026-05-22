"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { MARQUEE_COPIES } from "./utils"

type Props = {
  brands: Array<{ name?: string; logo: string }> | undefined
  title?: string
}

export function AudienceBrandMarquee({ brands, title }: Props) {
  const items = (brands ?? []).filter((b) => b?.logo?.trim())
  if (items.length === 0) return null

  const loop = Array.from({ length: MARQUEE_COPIES }, () => items).flat()
  const duration = Math.max(20, items.length * 4)

  return (
    <div className="overflow-hidden">
      {title ? (
        <p className="mb-12 text-center text-lg font-bold text-background sm:text-[32px]">
          {title}
        </p>
      ) : null}
      <div className="relative w-full overflow-hidden">
        <motion.ul
          className="flex w-max items-center"
          animate={{ x: ["0%", `-${100 / MARQUEE_COPIES}%`] }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        >
          {loop.map((brand, i) => (
            <li
              key={`${brand.logo}-${i}`}
              className="relative flex h-10 shrink-0 items-center justify-center pr-10 sm:h-24 sm:pr-14"
              aria-hidden={i >= items.length ? true : undefined}
            >
              <Image
                src={brand.logo}
                alt={brand.name ?? ""}
                width={160}
                height={48}
                className="h-full w-auto object-contain"
              />
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}
