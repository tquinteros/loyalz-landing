import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionWrapper } from "./section-wrapper"
import type { FAQSectionProps } from "@/lib/types/Pages"

type Props = FAQSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function FAQSection({
  title,
  subtitle,
  items,
  backgroundImage,
  className,
}: Props) {
  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={className}
      innerClassName="max-w-3xl"
    >
      {(title || subtitle) && (
        <div className="mb-10 text-center">
          {title ? (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-3 text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      )}

      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={`${item.question}-${i}`} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionWrapper>
  )
}
