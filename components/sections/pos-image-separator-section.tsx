"use client"

import type { CSSProperties } from "react"
import type { PosImageSeparatorSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"
import { cn } from "@/lib/utils"

type Props = PosImageSeparatorSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const DEFAULT_TITLE_COLOR = "#E9967A"

export default function PosImageSeparatorSection({
  label,
  title,
  titleColor,
  backgroundImage,
  className,
}: Props) {
  const t = useT()

  const labelText = t(label)
  const titleText = t(title)
  const titleFg = titleColor?.trim() || DEFAULT_TITLE_COLOR
  const hasBg = Boolean(backgroundImage?.trim())

  if (!hasBg && !labelText && !titleText) return null

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      backgroundOverlayClassName="bg-gradient-to-l from-transparent from-[35%] via-black/15 to-black/45"
      className={cn(
        "text-foreground",
        hasBg
          ? "min-h-[min(56vh,576px)] py-[3.2rem] sm:py-16 lg:py-[4.8rem]"
          : "bg-foreground py-12",
        className,
      )}
      innerClassName="relative flex min-h-[inherit] items-center"
    >
      <div className="flex w-full justify-end">
        <div className="flex w-full max-w-2xl flex-col items-end gap-6 text-right lg:w-1/2 lg:gap-8">
          {labelText ? (
            <div
              className="flex w-fit items-center gap-2 rounded border bg-black/10 px-3 py-2 backdrop-blur-sm"
              style={
                {
                  color: titleFg,
                  borderColor: titleFg,
                } as CSSProperties
              }
            >
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
              <p className="text-xs font-semibold tracking-wider sm:text-sm">
                {labelText}
              </p>
            </div>
          ) : null}

          {titleText ? (
            <h2
              className="w-full text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-[56px]"
              style={{ color: titleFg } as CSSProperties}
            >
              {titleText.split("\n").map((line, i, lines) => (
                <span key={`${line}-${i}`}>
                  {line}
                  {i < lines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h2>
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  )
}
