"use client"

import Image from "next/image"
import type { AudienceInformationProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"

type Props = {
  data: AudienceInformationProps | undefined
}

export function AudienceInformationBlock({ data }: Props) {
  const t = useT()
  if (!data) return null

  const panelBg = data.backgroundColor?.trim() || "#E5E0EF"
  const titleText = t(data.title)
  const descriptionText = t(data.description)
  const imageSrc = data.image?.trim()

  if (!titleText && !descriptionText && !imageSrc) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-0">
      <div
        className="flex min-h-[280px] flex-col justify-end rounded-[28px] p-8 sm:min-h-[360px] sm:rounded-[32px] sm:p-10 lg:col-span-7 lg:min-h-[600px] lg:p-12"
        style={{ backgroundColor: panelBg }}
      >
        <div className="space-y-4">
          {titleText ? (
            <h2
              className="max-w-xl text-2xl font-bold text-background leading-tight tracking-tight sm:text-3xl lg:text-[56px] lg:leading-[1.08]"
            >
              {titleText}
            </h2>
          ) : null}
          {descriptionText ? (
            <p
              className="max-w-lg text-lg text-background leading-relaxed"
            >
              {descriptionText}
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative min-h-[240px] overflow-hidden rounded-[28px] sm:min-h-[360px] sm:rounded-[32px] lg:col-span-5 lg:min-h-[420px]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={titleText || ""}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
        ) : null}
      </div>
    </div>
  )
}
