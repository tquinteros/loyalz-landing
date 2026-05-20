"use client"

import Image from "next/image"
import { useMemo } from "react"
import { motion } from "framer-motion"
import type { AudiencesTabsSectionProps, AudienceTabItem, AudienceProblemProps } from "@/lib/types/Pages"
import { cn } from "@/lib/utils"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

type Props = AudiencesTabsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const MARQUEE_COPIES = 4

function defaultCenterIndex(total: number) {
  if (total <= 0) return 0
  return Math.floor((total - 1) / 2)
}

export default function AudiencesTabsSection({
  title,
  tabs,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const validTabs = (tabs ?? []).filter((tab) => tab.key)
  const defaultTab = validTabs[0]?.key ?? ""

  if (validTabs.length === 0) {
    return (
      <SectionWrapper backgroundImage={backgroundImage} className={className}>
        {titleText ? (
          <motion.div className="mb-12 text-center">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-background sm:text-5xl lg:text-[64px] lg:leading-[1.05]">
              {titleText}
            </h1>
          </motion.div>
        ) : null}
      </SectionWrapper>
    )
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <SectionWrapper backgroundImage={backgroundImage} className={className}>
        {titleText ? (
          <motion.div className="mb-12 text-center">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-background sm:text-5xl lg:text-[64px] lg:leading-[1.05]">
              {titleText}
            </h1>
          </motion.div>
        ) : null}

        <TabsList
          className="mb-0 grid! h-auto! w-full grid-cols-3 gap-0 rounded-none bg-transparent p-0"
          style={{
            gridTemplateColumns: `repeat(${validTabs.length}, minmax(0, 1fr))`,
          }}
        >
          {validTabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className={cn(
                "flex-none! h-auto! max-h-none! w-full min-w-0 cursor-pointer flex-col items-center justify-start gap-[32px] rounded-none border-0 bg-transparent px-4 py-0",
                "text-center text-[32px] font-medium leading-none text-background shadow-none! transition-none",
                "after:hidden hover:text-background",
                "data-[state=active]:bg-transparent data-[state=active]:text-background data-[state=active]:shadow-none",
                "data-[state=active]:**:data-tab-indicator:bg-chart-5",
              )}
            >
              <span className="w-full text-center">{t(tab.tabLabel)}</span>
              <span
                data-tab-indicator
                aria-hidden
                className="h-1 w-full shrink-0 bg-transparent"
              />
            </TabsTrigger>
          ))}
        </TabsList>
      </SectionWrapper>

      {validTabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key} className="mt-0 outline-none">
          <TabBody tab={tab} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

function TabBody({ tab }: { tab: AudienceTabItem }) {
  const t = useT()
  const validImages = (tab.images ?? []).filter(Boolean)
  const separatorText = t(tab.separatorText)
  const labelText = t(tab.label)
  const titleText = t(tab.title)

  return (
    <>
      <AudienceTabCarousel images={validImages} alt={titleText} />

      <SectionWrapper className="pt-16">
        <div className="space-y-16">
          {separatorText ? (
            <div className="flex flex-col bg-background gap-4 rounded-[28px] sm:rounded-[32px] p-8 lg:p-15">
              <div className="flex items-center gap-2">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="10" height="10" rx="2" fill="#F8F5EF" />
                </svg>
                <span className="text-foreground">{labelText}</span>
              </div>
              <p className="text-xl sm:text-[60px] font-bold text-foreground">
                {separatorText}
              </p>
            </div>
          ) : null}

          {/* {(labelText || titleText) ? (
            <div className="text-center">
              {labelText ? (
                <span className="mb-3 inline-block rounded-full bg-background/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-background/70">
                  {labelText}
                </span>
              ) : null}
              {titleText ? (
                <h2 className="text-balance text-2xl font-bold tracking-tight text-background sm:text-4xl lg:text-[48px] lg:leading-[1.1]">
                  {titleText}
                </h2>
              ) : null}
            </div>
          ) : null} */}

          <InlineBrandMarquee
            brands={tab.brands}
            title={t(tab.brandMarqueeTitle)}
          />

          <AudienceProblemBlock data={tab.audienceProblem} />
        </div>
      </SectionWrapper>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Full-bleed image carousel (outside SectionWrapper)                  */
/* ------------------------------------------------------------------ */

type AudienceTabCarouselProps = {
  images: string[]
  alt?: string
}

/** Every slide uses the same footprint; viewport shows ~80% center + ~10% peek per side. */
const SLIDE_BASIS = "basis-[80%]"

function AudienceTabCarousel({ images, alt }: AudienceTabCarouselProps) {
  const urls = useMemo(
    () => images.map((s) => String(s).trim()).filter(Boolean),
    [images],
  )
  const n = urls.length

  if (n === 0) return null

  const startIndex = defaultCenterIndex(n)
  const loop = n > 1
  const slideBasis = n === 1 ? "basis-full" : SLIDE_BASIS

  return (
    <div className="relative w-full overflow-hidden bg-foreground pb-8 sm:pb-12">
      <Carousel
        opts={{
          align: "center",
          loop,
          containScroll: false,
          startIndex,
          duration: 28,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 items-stretch">
          {urls.map((src, i) => (
            <CarouselItem
              key={`${src}-${i}`}
              className={cn(slideBasis, "pl-4")}
            >
              <div className="relative aspect-4/3 w-full max-h-[80dvh] overflow-hidden rounded-2xl bg-background/20">
                <Image
                  src={src}
                  alt={alt || `Imagen ${i + 1}`}
                  fill
                  priority={i === startIndex}
                  sizes="80vw"
                  className="h-full w-full object-cover"
                />
                <div className="absolute flex gap-4 items-center rounded-[14px] p-4 px-8 bottom-16 right-16 bg-foreground text-background">
                  <Image src="/qr.svg" alt="Loyalz" width={62} height={62} />
                  <div className="flex flex-col gap-2">
                    <span className="text-[14px]">Powered by</span>
                    <Image src="/loyalz_small.svg" alt="Loyalz" width={151} height={100} />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Inline Brand Marquee                                                */
/* ------------------------------------------------------------------ */

type InlineMarqueeProps = {
  brands: Array<{ name?: string; logo: string }> | undefined
  title?: string
}

function InlineBrandMarquee({ brands, title }: InlineMarqueeProps) {
  const items = (brands ?? []).filter((b) => b?.logo?.trim())
  if (items.length === 0) return null

  const loop = Array.from({ length: MARQUEE_COPIES }, () => items).flat()
  const duration = Math.max(20, items.length * 4)

  return (
    <div className="overflow-hidden">
      {title ? (
        <p className="mb-12 text-center text-lg sm:text-[32px] font-bold  text-background">
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

type AudienceProblemBlockProps = {
  data: AudienceProblemProps | undefined
}

function AudienceProblemBlock({ data }: AudienceProblemBlockProps) {
  const t = useT()
  if (!data) return null

  const labelText = t(data.label)
  const titleText = t(data.title)
  const descriptionText = t(data.description)
  const solutions = data.solutions ?? []

  return (
    <div className="space-y-10">
      <div className={cn("max-w-2xl", solutions.length > 0 ? "" : "mx-auto text-center")}>
        {labelText ? (
          <span className="mb-3 inline-block rounded-full bg-background/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-background/70">
            {labelText}
          </span>
        ) : null}
        {titleText ? (
          <h3 className="text-balance text-xl font-bold tracking-tight text-background sm:text-3xl">
            {titleText}
          </h3>
        ) : null}
        {descriptionText ? (
          <p className="mt-3 text-base text-background/70 sm:text-[17px] sm:leading-relaxed">
            {descriptionText}
          </p>
        ) : null}
      </div>

      {solutions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((sol, i) => {
            const solLabel = t(sol.label)
            const solTitle = t(sol.title)
            const solDesc = t(sol.description)
            const cardBg = sol.backgroundColor?.trim() || "#F8F5EF"

            return (
              <div
                key={i}
                className="row-span-3 grid grid-rows-subgrid gap-2 rounded-4xl p-8 text-foreground"
                style={{ backgroundColor: cardBg }}
              >
                <span
                  className={cn(
                    "text-xs font-semibold mb-3 sm:text-2xl text-foreground/60",
                    !solLabel && "invisible",
                  )}
                >
                  {solLabel || "\u00A0"}
                </span>
                <h4
                  className={cn(
                    "text-base font-bold leading-[1.1] sm:text-[32px]",
                    !solTitle && "invisible",
                  )}
                >
                  {solTitle || "\u00A0"}
                </h4>
                <p
                  className={cn(
                    "text-sm leading-relaxed text-foreground sm:text-[16px]",
                    !solDesc && "invisible",
                  )}
                >
                  {solDesc || "\u00A0"}
                </p>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
