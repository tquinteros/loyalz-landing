"use client"

import Image from "next/image"
import type { PosSeparatorSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"
import { SectionWrapper } from "./section-wrapper"
import { cn } from "@/lib/utils"

type Props = PosSeparatorSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

const DEFAULT_PANEL_BG = "#E85D33"

export default function PosSeparatorSection({
  label,
  title,
  description,
  image,
  backgroundColor,
  backgroundImage,
  className,
}: Props) {
  const t = useT()

  const panelBg = backgroundColor?.trim() || DEFAULT_PANEL_BG
  const labelText = t(label)
  const titleText = t(title)
  const descriptionText = t(description)
  const imageSrc = image?.trim()

  if (!labelText && !titleText && !descriptionText && !imageSrc) return null

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={cn("bg-foreground py-12 sm:py-16 lg:py-20", className)}
    >
      <div className="grid grid-cols-12 items-stretch">
        <div
          className="col-span-12 flex min-h-[320px] flex-col justify-between rounded-[28px] p-8 text-foreground sm:min-h-[400px] sm:rounded-[32px] sm:p-10 lg:col-span-6 lg:min-h-[600px] lg:p-12"
          style={{ backgroundColor: panelBg }}
        >
          <div className="flex items-center gap-3">
            <svg width="43" height="44" viewBox="0 0 43 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="42.6592" height="43.2414" rx="5.59465" fill="#FFB7A4" />
              <g clipPath="url(#clip0_272_3614)">
                <path fillRule="evenodd" clipRule="evenodd" d="M20.0064 7.41028C20.6948 7.41028 21.2651 7.91463 21.3671 8.57343C21.3671 8.56467 21.3673 8.58214 21.3671 8.57343L21.3833 11.4447C21.3833 11.4535 21.3831 11.436 21.3829 11.4447C21.3829 12.2027 21.9984 12.8084 22.7576 12.8084L34.9607 12.6203C35.02 12.6203 35.0776 12.6278 35.1325 12.6419C35.1434 12.6447 35.1543 12.6478 35.1651 12.6511C35.4341 12.7347 35.6322 12.9788 35.647 13.2712C35.6476 13.2829 35.6479 13.2946 35.6479 13.3065V34.9792C35.6479 35.3582 35.3402 35.6654 34.9607 35.6654L22.6235 35.8536V35.8525C21.863 35.8525 21.2465 35.237 21.2465 34.4777L21.2456 31.6456C21.2456 30.8877 20.6302 30.2732 19.8711 30.2732H7.65746C7.2779 30.2732 6.97021 29.966 6.97021 29.587V8.09648C6.97021 8.08465 6.97052 8.07288 6.97111 8.06119C6.98595 7.7688 7.18409 7.5247 7.45308 7.44115C7.46384 7.43781 7.47471 7.43472 7.48569 7.4319C7.53511 7.4192 7.58668 7.41184 7.63974 7.4105C7.64563 7.41035 7.65153 7.41028 7.65746 7.41028H20.0064ZM14.4673 12.8084C13.7068 12.8084 13.0904 13.4239 13.0904 14.1833V23.5002C13.0904 24.2595 13.7068 24.8751 14.4673 24.8751L19.6599 24.8947H20.0064C20.7669 24.8947 21.3833 25.5103 21.3833 26.2696L21.3831 28.9008C21.3831 28.9096 21.3832 28.8921 21.3831 28.9008C21.3831 29.6588 21.9984 30.2732 22.7576 30.2732H28.1614C28.9219 30.2732 29.5383 29.6577 29.5383 28.8984V19.5814C29.5383 18.8221 28.9219 18.2066 28.1614 18.2066H22.9426L22.6235 18.2018C21.863 18.2018 21.2465 17.5863 21.2465 16.827V16.3558H21.2456V14.1808C21.2456 13.4229 20.6302 12.8084 19.8711 12.8084H14.4673Z" fill="#EC491E" />
              </g>
              <defs>
                <clipPath id="clip0_272_3614">
                  <rect width="28.6726" height="29.2548" fill="white" transform="translate(6.99316 6.99329)" />
                </clipPath>
              </defs>
            </svg>
            {labelText ? (
              <span className="text-xl font-bold tracking-tight sm:text-2xl">
                {labelText}
              </span>
            ) : null}
          </div>

          <div className="mt-10 space-y-4 lg:mt-0">
            {titleText ? (
              <h2 className="max-w-md text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-[56px]">
                {titleText}
              </h2>
            ) : null}
            {descriptionText ? (
              <p className="max-w-md text-base leading-snug text-foreground/80 sm:text-lg">
                {descriptionText}
              </p>
            ) : null}
          </div>
        </div>

        <div className="relative col-span-12 min-h-[280px] overflow-hidden rounded-[28px] sm:min-h-[360px] sm:rounded-[32px] lg:col-span-6 lg:min-h-[480px]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={titleText || labelText || ""}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  )
}
