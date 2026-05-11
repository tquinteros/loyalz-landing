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
      innerClassName=""
    >
      <div className="grid gap-8 md:grid-cols-2 md:gap-10 md:items-stretch">
        <div className="flex h-full min-h-[768px] flex-col justify-between gap-8">
          {(titleText || subtitleText) ? (
            <div className="text-left">
              {titleText ? (
                <h2 className="text-3xl font-bold tracking-tight text-background sm:text-5xl">
                  {titleText}
                </h2>
              ) : null}
              {subtitleText ? (
                <p className="mt-4 text-background">{subtitleText}</p>
              ) : null}
            </div>
          ) : (
            <div aria-hidden />
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

          {(helpTitleText || helpDescriptionText || helpCtaLabelText) ? (
            <div className="space-y-4">
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
          ) : (
            <div aria-hidden />
          )}
        </div>

        {image ? (
          <Image
            src={image}
            alt={titleText || fallbackImageAlt}
            className="object-cover w-full h-[768px] rounded-[32px]"
            width={500}
            height={500}
          />
        ) : null}
      </div>
    </SectionWrapper>
  )
}
