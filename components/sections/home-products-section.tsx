"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import type { HomeProductsSectionProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "./section-wrapper"

type Props = HomeProductsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function HomeProductsSection({
  label,
  title,
  products,
  backgroundImage,
  className,
}: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!products.length) {
    return (
      <SectionWrapper backgroundImage={backgroundImage} className={className}>
        {title ? <h2 className="text-2xl font-bold sm:text-4xl">{title}</h2> : null}
      </SectionWrapper>
    )
  }

  const activeIndex = hoveredIndex ?? 0
  const active = products[Math.min(activeIndex, products.length - 1)]

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={cn(className, "")}>
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex min-w-0 flex-col">
          {(label || title) && (
            <div className="mb-8 space-y-3">
              {label ? (
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
              ) : null}
              {title ? (
                <h2 className="max-w-md text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                  {title}
                </h2>
              ) : null}
            </div>
          )}

          <ol className="space-y-3" onMouseLeave={() => setHoveredIndex(null)}>
            {products.map((product, index) => {
              const isActive = hoveredIndex === index
              return (
                <li key={`${product.title}-${index}`}>
                  <button
                    type="button"
                    className={cn(
                      "group relative flex w-full items-stretch overflow-hidden rounded-2xl text-left transition-all duration-300 ease-out",
                      "focus-visible:outline-none",
                      isActive
                        ? "bg-card shadow-xl shadow-black/10"
                        : "bg-transparent shadow-none",
                    )}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={(e) => {
                      const next = e.relatedTarget as Node | null
                      if (next && e.currentTarget.closest("ol")?.contains(next)) return
                      setHoveredIndex(null)
                    }}
                  >
                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.div
                          key="icon"
                          aria-hidden="true"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "7rem", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="relative flex h-28 shrink-0 items-center justify-center"
                          style={{ backgroundColor: product.color }}
                        >
                          <Image
                            src="/logo.svg"
                            alt=""
                            width={48}
                            height={48}
                            className="filter-[brightness(0)_invert(1)]"
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                    
                    <div className="flex h-28 min-w-0 flex-1 flex-col justify-center gap-1.5 px-5">
                      
                      <h3 className="text-lg font-bold text-background sm:text-xl">
                        {(() => {
                          const words = product.title.split(/\s+/).filter(Boolean)
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
                      <span
                        className="inline-flex w-fit font-bold"
                        style={{ color: product.color }}
                      >
                        {product.subtitle}
                      </span>
                      <p className="text-sm leading-relaxed text-background sm:text-base">
                        {product.description}
                      </p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
        <div className="relative min-h-[260px] min-w-0 overflow-hidden rounded-[24px] lg:min-h-[420px]">
          <AnimatePresence mode="sync" initial={false}>
            {active?.image ? (
              <motion.div
                key={activeIndex}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              >
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={activeIndex === 0}
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
                No hay imagen disponible.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  )
}
