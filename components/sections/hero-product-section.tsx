"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { HeroProductSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"

type Props = HeroProductSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const COPIES = 4

export default function HeroProductSection({
  label,
  title,
  description,
  image,
  primaryCta,
  secondaryCta,
  titleColor,
  brandMarqueeTitle,
  brands,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const labelText = t(label)
  const titleText = t(title)
  const descriptionText = t(description)
  const primaryCtaLabel = t(primaryCta?.label)
  const secondaryCtaLabel = t(secondaryCta?.label)
  const marqueeTitle = t(brandMarqueeTitle)

  const items = (brands ?? []).filter((b) => b && b.logo?.trim())
  const loop =
    items.length > 0
      ? Array.from({ length: COPIES }, () => items).flat()
      : []
  const duration = Math.max(20, items.length * 4)

  return (
    <section
      className={cn("relative w-full bg-background py-8 sm:py-12", className)}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {backgroundImage && (
        <div aria-hidden className="absolute inset-0 bg-black/60" />
      )}

      <div className="relative px-5 lg:px-16">
        <div className="grid min-h-[480px] grid-cols-12 overflow-hidden lg:min-h-[700px]">
          <div className="col-span-12 flex flex-col justify-between rounded-[32px] gap-10 bg-foreground p-8 lg:col-span-8 lg:p-14">
            <div className="flex flex-col gap-4">
              {labelText ? (
                <p className="text-[28px] font-bold leading-none text-background lg:text-[40px]">
                  {labelText}
                </p>
              ) : null}

              {titleText ? (
                <h1
                  className="text-[36px] max-w-4xl font-bold leading-none lg:text-[56px]"
                  style={titleColor ? { color: titleColor } : undefined}
                >
                  {titleText}
                </h1>
              ) : null}
            </div>

            <div className="flex flex-col gap-6">
              {descriptionText ? (
                <p
                  className="text-[20px] max-w-4xl leading-none lg:text-[32px]"
                  style={{ color: "#0000004D" }}
                >
                  {descriptionText}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                {primaryCta?.href && primaryCtaLabel ? (
                  <Button
                    asChild
                    size="lg"
                    className="h-12 bg-background text-foreground hover:bg-background/90"
                  >
                    <Link href={primaryCta.href}>{primaryCtaLabel}</Link>
                  </Button>
                ) : null}
                {secondaryCta?.href && secondaryCtaLabel ? (
                  <Button asChild size="lg" variant="outline" className="h-12">
                    <Link href={secondaryCta.href}>{secondaryCtaLabel}</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="relative rounded-[32px] col-span-12 min-h-[320px] sm:min-h-[420px] lg:col-span-4 lg:min-h-0">
            {image ? (
              <Image
                src={image}
                alt={titleText}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover rounded-[32px]"
              />
            ) : (
              <div className="h-full rounded-[32px] bg-foreground/10" />
            )}
          </div>
        </div>

        {items.length > 0 ? (
          <div className="mt-8 sm:mt-12">
            {marqueeTitle ? (
              <div className="mb-5 text-center">
                <p className="text-sm font-semibold text-background/70 sm:text-base">
                  {marqueeTitle}
                </p>
              </div>
            ) : null}
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
                    className="relative flex h-10 shrink-0 items-center justify-center pr-12 sm:h-16 sm:pr-16 lg:pr-20"
                    aria-hidden={i >= items.length ? true : undefined}
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name ?? ""}
                      width={200}
                      height={48}
                      className="h-full w-auto object-contain"
                    />
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
