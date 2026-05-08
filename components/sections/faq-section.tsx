"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image"
import Link from "next/link"
import { SectionWrapper } from "./section-wrapper"
import type { FAQSectionProps } from "@/lib/types/Pages"
import { useT } from "@/providers/language-provider"

type Props = FAQSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function FAQSection({
  title,
  subtitle,
  image,
  helpTitle,
  helpDescription,
  helpCtaLabel,
  helpCtaHref,
  items,
  backgroundImage,
  className,
}: Props) {
  const t = useT()
  const titleText = t(title)
  const subtitleText = t(subtitle)
  const helpTitleText = t(helpTitle)
  const helpDescriptionText = t(helpDescription)
  const helpCtaLabelText = t(helpCtaLabel)
  const fallbackImageAlt = t({ es: "Imagen de FAQ", en: "FAQ image" })

  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={className}
      innerClassName="max-w-6xl mx-auto"
    >
      <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:items-start">
        <div>
          {(titleText || subtitleText) && (
            <div className="mb-8 text-left">
              {titleText ? (
                <h2 className="text-3xl font-bold tracking-tight text-background sm:text-5xl">
                  {titleText}
                </h2>
              ) : null}
              {subtitleText ? (
                <p className="mt-4 text-background">{subtitleText}</p>
              ) : null}
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => {
              const question = t(item.question)
              const answer = t(item.answer)
              return (
                <AccordionItem key={`${question}-${i}`} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base text-background">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-background">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          {(helpTitleText || helpDescriptionText || helpCtaLabelText) && (
            <div className="mt-12 space-y-4">
              {helpTitleText ? (
                <h3 className="text-2xl font-bold tracking-tight text-background sm:text-3xl">
                  {helpTitleText}
                </h3>
              ) : null}
              {helpDescriptionText ? (
                <p className="text-background">{helpDescriptionText}</p>
              ) : null}
              {helpCtaLabelText ? (
                <Link
                  href={helpCtaHref || "#"}
                  className="inline-flex min-h-11 items-center justify-center rounded-sm border border-background px-6 py-2 text-base font-semibold text-background transition-colors hover:bg-background hover:text-foreground"
                >
                  {helpCtaLabelText}
                </Link>
              ) : null}
            </div>
          )}
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted md:aspect-5/6">
          {image ? (
            <Image
              src={image}
              alt={titleText || fallbackImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  )
}
