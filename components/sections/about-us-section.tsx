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

const IMAGE_BORDER_RADIUS = "32px"

/** Back → front: offset + rotation only; shared border radius on every layer. */
const IMAGE_STACK_LAYERS = [
  {
    rotate: -9,
    inset: { top: "12%", right: "10%", bottom: "4%", left: "0%" },
    zIndex: 1,
  },
  {
    rotate: 7,
    inset: { top: "6%", right: "4%", bottom: "10%", left: "10%" },
    zIndex: 2,
  },
  {
    rotate: -5,
    inset: { top: "0%", right: "6%", bottom: "8%", left: "4%" },
    zIndex: 3,
  },
] as const

const MAX_STACK_IMAGES = IMAGE_STACK_LAYERS.length

function AboutUsImageStack({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const stack = images.slice(0, MAX_STACK_IMAGES)
  if (stack.length === 0) return null

  const layerConfigs =
    stack.length === 1
      ? [IMAGE_STACK_LAYERS[2]]
      : stack.length === 2
        ? [IMAGE_STACK_LAYERS[0], IMAGE_STACK_LAYERS[2]]
        : IMAGE_STACK_LAYERS

  return (
    <div className="relative aspect-square w-full max-w-[490px] shrink-0 self-start">
      {stack.map((src, i) => {
        const layer = layerConfigs[i]
        return (
          <div
            key={`${src}-${i}`}
            className="absolute overflow-hidden shadow-[0_10px_36px_rgba(0,0,0,0.14)]"
            style={{
              top: layer.inset.top,
              right: layer.inset.right,
              bottom: layer.inset.bottom,
              left: layer.inset.left,
              zIndex: layer.zIndex,
              borderRadius: IMAGE_BORDER_RADIUS,
              transform: `rotate(${layer.rotate}deg)`,
            }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 490px) 100vw, 490px"
            />
          </div>
        )
      })}
    </div>
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
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <div className="flex w-full flex-col items-start gap-8 lg:gap-10">
          {titleText ? (
            <h2 className="w-full text-3xl font-bold tracking-tight text-background sm:text-4xl lg:text-[56px] lg:leading-[1.05]">
              {titleText}
            </h2>
          ) : null}

          {validImages.length > 0 ? (
            <AboutUsImageStack
              images={validImages}
              alt={titleText || "About us"}
            />
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col justify-end gap-10 lg:min-h-full">
          {descriptionText ? (
            <p className="text-pretty text-base leading-none text-background sm:text-[18px]">
              {descriptionText}
            </p>
          ) : null}

          {articleItems.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8">
              {articleItems.map((text, i) => (
                <li key={i} className="flex flex-col gap-3">
                  <ArticleBullet />
                  <p className="text-pretty text-base leading-none text-background sm:text-[16px]">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}

          {bottomLabelText ? (
            <p className="text-pretty text-lg font-bold leading-none text-background sm:text-xl lg:text-[18px]">
              {bottomLabelText}
            </p>
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  )
}
