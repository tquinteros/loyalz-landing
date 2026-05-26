"use client"

import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import type { HomeProductsSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"
import { useT } from "@/providers/language-provider"

type Props = HomeProductsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

type Product = HomeProductsSectionProps["products"][number]

/** Copies so `translate(-100/COPIES%)` equals exactly one copy length. */
const COPIES = 4

function toInternalHref(href?: string | null): string | null {
  const trimmed = href?.trim()
  if (!trimmed) return null
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

function ProductLoopCard({
  product,
  index,
  isActive,
  orientation,
  onActivate,
  t,
}: {
  product: Product
  index: number
  isActive: boolean
  orientation: "vertical" | "horizontal"
  onActivate: (index: number) => void
  t: ReturnType<typeof useT>
}) {
  const productTitle = t(product.title)
  const productSubtitle = t(product.subtitle)
  const productDescription = t(product.description)
  const productHref = toInternalHref(product.href)

  const cardClassName = cn(
    "group block w-full overflow-hidden rounded-2xl text-left transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/40",
    isActive ? "bg-card shadow-xl shadow-black/10" : "bg-background/10",
    orientation === "horizontal" && "h-full",
  )

  const handlers = {
    onMouseEnter: () => onActivate(index),
    onFocus: () => onActivate(index),
  }

  const content = (
    <div
      className={cn(
        "flex gap-4 p-5 sm:p-6",
        orientation === "vertical" ? "flex-col" : "h-full min-h-36 flex-col sm:min-h-40",
      )}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14"
        style={{ backgroundColor: product.color }}
      >
        <Image
          src="/logo.svg"
          alt=""
          width={28}
          height={28}
          className="filter-[brightness(0)_invert(1)]"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <h3 className="text-lg font-bold leading-snug text-background sm:text-xl">
          {(() => {
            const words = productTitle.split(/\s+/).filter(Boolean)
            return words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                style={i === 1 ? { color: product.color } : undefined}
              >
                {i > 0 ? " " : ""}
                {word}
              </span>
            ))
          })()}
        </h3>
        {productSubtitle ? (
          <span className="inline-flex font-bold" style={{ color: product.color }}>
            {productSubtitle}
          </span>
        ) : null}
        {productDescription ? (
          <p className="text-sm leading-relaxed text-background/90 sm:text-base">
            {productDescription}
          </p>
        ) : null}
      </div>
    </div>
  )

  if (productHref) {
    return (
      <Link href={productHref} className={cardClassName} {...handlers}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={cardClassName} {...handlers}>
      {content}
    </button>
  )
}

export default function HomeProductsSection({
  label,
  title,
  products,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const labelText = t(label)
  const titleText = t(title)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const items = products.filter(
    (p) =>
      p &&
      (t(p.title).trim() ||
        t(p.subtitle).trim() ||
        t(p.description).trim() ||
        p.image?.trim()),
  )

  if (!items.length) {
    return (
      <SectionWrapper backgroundImage={backgroundImage} className={className}>
        {titleText ? <h2 className="text-2xl font-bold sm:text-4xl">{titleText}</h2> : null}
      </SectionWrapper>
    )
  }

  const activeIndex = hoveredIndex ?? 0
  const active = items[Math.min(activeIndex, items.length - 1)]
  const activeTitle = t(active?.title)
  const loop = Array.from({ length: COPIES }, () => items).flat()
  const duration = Math.max(28, items.length * 9)

  const activate = (index: number) => setHoveredIndex(index % items.length)

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn(className, "overflow-hidden")}
      innerClassName="relative px-0"
    >
      {/* Desktop — vertical loop outside padded container, full section height */}
      <div className="pointer-events-none absolute -top-16 -bottom-16 right-0 hidden w-[min(100%,26rem)] overflow-hidden sm:-top-24 sm:-bottom-24 md:pointer-events-auto md:block lg:w-[42%] xl:w-[38%]">
        <motion.div
          className="flex w-full flex-col will-change-transform"
          animate={{ y: ["0%", `-${100 / COPIES}%`] }}
          transition={{
            duration,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {loop.map((product, i) => (
            <div
              key={`products-marquee-y-${i}`}
              className="mb-4 w-full shrink-0 px-4 lg:px-6 xl:pr-16"
              aria-hidden={i >= items.length ? true : undefined}
            >
              <ProductLoopCard
                product={product}
                index={i % items.length}
                isActive={(i % items.length) === activeIndex}
                orientation="vertical"
                onActivate={activate}
                t={t}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative">
        <div className="relative z-10 px-5 lg:max-w-[58%] lg:pl-16 lg:pr-10 xl:max-w-[55%]">
          {(labelText || titleText) && (
            <div className="mb-8 space-y-3">
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
                    <rect width="10" height="10" rx="2" fill="black" />
                  </svg>
                  <p className="text-xs tracking-widest text-muted-foreground sm:text-[14px]">
                    {labelText}
                  </p>
                </div>
              ) : null}
              {titleText ? (
                <h2 className="max-w-5xl text-2xl font-bold tracking-tight sm:text-3xl lg:text-[56px]">
                  {titleText}
                </h2>
              ) : null}
            </div>
          )}

          <div className="relative w-full max-h-[80dvh] overflow-hidden rounded-[24px]">
            <AnimatePresence mode="sync" initial={false}>
              {active?.image ? (
                <motion.div
                  key={activeIndex}
                  className="relative w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Image
                    src={active.image}
                    alt={activeTitle}
                    width={1024}
                    height={1024}
                    className="h-auto max-h-[80dvh] w-full object-cover"
                    priority={activeIndex === 0}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="flex min-h-48 items-center justify-center p-8 text-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  {t({ es: "No hay imagen disponible.", en: "No image available." })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile — horizontal loop on x-axis, bleeds past horizontal padding */}
        <div className="relative -mx-5 mt-8 w-[calc(100%+2.5rem)] overflow-hidden px-5 md:hidden">
          <motion.div
            className="flex w-max flex-row will-change-transform"
            animate={{ x: ["0%", `-${100 / COPIES}%`] }}
            transition={{
              duration,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {loop.map((product, i) => (
              <div
                key={`products-marquee-x-${i}`}
                className="mr-4 w-[min(85vw,20rem)] shrink-0"
                aria-hidden={i >= items.length ? true : undefined}
              >
                <ProductLoopCard
                  product={product}
                  index={i % items.length}
                  isActive={(i % items.length) === activeIndex}
                  orientation="horizontal"
                  onActivate={activate}
                  t={t}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
