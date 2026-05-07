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
  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={className}
      innerClassName="max-w-6xl mx-auto"
    >
      <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:items-start">
        <div>
          {(title || subtitle) && (
            <div className="mb-8 text-left">
              {title ? (
                <h2 className="text-3xl font-bold tracking-tight text-background sm:text-5xl">
                  {title}
                </h2>
              ) : null}
              {subtitle ? (
                <p className="mt-4 text-background">{subtitle}</p>
              ) : null}
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => (
              <AccordionItem key={`${item.question}-${i}`} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base text-background">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-background">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {(helpTitle || helpDescription || helpCtaLabel) && (
            <div className="mt-12 space-y-5">
              {helpTitle ? (
                <h3 className="text-3xl font-bold tracking-tight text-background sm:text-5xl">
                  {helpTitle}
                </h3>
              ) : null}
              {helpDescription ? (
                <p className="text-background">{helpDescription}</p>
              ) : null}
              {helpCtaLabel ? (
                <Link
                  href={helpCtaHref || "#"}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-background px-7 py-2 text-base font-semibold text-background transition-colors hover:bg-background hover:text-foreground"
                >
                  {helpCtaLabel}
                </Link>
              ) : null}
            </div>
          )}
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted md:aspect-5/6">
          {image ? (
            <Image
              src={image}
              alt={title || "FAQ image"}
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
