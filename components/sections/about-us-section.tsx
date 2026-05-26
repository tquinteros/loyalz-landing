"use client"

import Image from "next/image"
import type { AboutUsSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"

type Props = AboutUsSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

function ArticleBullet() {
  return (
    <span
      aria-hidden
      className="mt-1.5 size-2.5 shrink-0 rounded-[4px] bg-background"
    />
  )
}

export default function AboutUsSection({
  title,
  description,
  articles,
  bottomLabel,
  images,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const descriptionText = t(description)
  const bottomLabelText = t(bottomLabel)
  const validImages = (images ?? []).filter(Boolean)
  const articleItems = (articles ?? [])
    .map((article) => t(article))
    .filter(Boolean)

  return (
    <SectionWrapper backgroundImage={backgroundImage} className={className}>
      <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <div className="flex flex-col gap-8 lg:gap-10">
          {titleText ? (
            <h2 className="text-3xl font-bold tracking-tight text-background sm:text-4xl lg:text-[56px] lg:leading-[1.05]">
              {titleText}
            </h2>
          ) : null}

          {validImages.length > 0 ? (
            <div className="w-full max-w-[490px]">
              {validImages.map((src, i) => (
                <div key={`${src}-${i}`} className="relative w-full">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-2 opacity-90"
                    style={{
                      borderRadius: "32px 28px 30px 26px",
                      transform: "rotate(-1.5deg)",
                    }}
                  />
                  <div
                    className="relative aspect-square overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
                    style={{ borderRadius: "32px 28px 30px 26px" }}
                  >
                    <Image
                      src={src}
                      alt={titleText || "About us"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 490px) 100vw, 490px"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col justify-end gap-10 lg:min-h-full">
          {descriptionText ? (
            <p className="text-pretty text-base leading-relaxed text-background sm:text-[18px]">
              {descriptionText}
            </p>
          ) : null}

          {articleItems.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8">
              {articleItems.map((text, i) => (
                <li key={i} className="flex flex-col gap-3">
                  <ArticleBullet />
                  <p className="text-pretty text-base leading-relaxed text-background sm:text-[16px]">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}

          {bottomLabelText ? (
            <p className="text-pretty text-lg font-bold leading-snug text-background sm:text-xl lg:text-[18px]">
              {bottomLabelText}
            </p>
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  )
}
