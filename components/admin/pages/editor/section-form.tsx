"use client"

import { memo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SECTION_REGISTRY } from "@/components/sections/component-map"
import type {
  AnyPageSection,
  PageSection,
} from "@/lib/types/Pages"
import { CommonSectionFields } from "./common-fields"
import { HeroForm } from "./forms/hero-form"
import { FeatureLinksForm } from "./forms/feature-links-form"
import { StatsForm } from "./forms/stats-form"
import { TestimonialsForm } from "./forms/testimonials-form"
import { FAQForm } from "./forms/faq-form"
import { ContactFormForm } from "./forms/contact-form-form"

type Props = {
  section: AnyPageSection
  onPatch: (patch: Partial<AnyPageSection>) => void
  onPropsChange: (nextProps: PageSection["props"]) => void
}

/**
 * Dispatches to the correct form component based on the section's discriminator.
 * Unknown section types get a read-only fallback so the editor never crashes
 * on legacy data.
 */
export const SectionForm = memo(function SectionForm({
  section,
  onPatch,
  onPropsChange,
}: Props) {
  const entry =
    section.type in SECTION_REGISTRY
      ? SECTION_REGISTRY[section.type as PageSection["type"]]
      : null

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
        <header className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {entry?.label ?? section.type}
          </p>
          <p className="text-sm text-muted-foreground">
            {entry?.description ?? "Sección desconocida."}
          </p>
        </header>

        <div className="flex items-center justify-between rounded-md border bg-card px-4 py-3">
          <div>
            <Label htmlFor="sec-enabled" className="text-sm font-medium">
              Visible en la página
            </Label>
            <p className="text-xs text-muted-foreground">
              Cuando está apagado, se omite al renderizar.
            </p>
          </div>
          <Checkbox
            id="sec-enabled"
            checked={section.enabled}
            onCheckedChange={(checked) =>
              onPatch({ enabled: checked === true })
            }
          />
        </div>

        {entry ? (
          <TypedSectionBody
            section={section as PageSection}
            onPropsChange={onPropsChange}
          />
        ) : (
          <p className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            Esta sección usa un tipo que esta versión del editor no conoce
            (&quot;{section.type}&quot;). Puedes moverla, activarla o
            eliminarla, pero no editar sus propiedades.
          </p>
        )}

        <Accordion
          type="single"
          collapsible
          className="w-full rounded-md border px-4"
        >
          <AccordionItem value="advanced" className="border-0">
            <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:no-underline data-[state=open]:text-foreground">
              Opciones avanzadas
            </AccordionTrigger>
            <AccordionContent>
              <CommonSectionFields section={section} onPatch={onPatch} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  )
})

function TypedSectionBody({
  section,
  onPropsChange,
}: {
  section: PageSection
  onPropsChange: (nextProps: PageSection["props"]) => void
}) {
  switch (section.type) {
    case "hero":
      return <HeroForm value={section.props} onChange={onPropsChange} />
    case "feature_links":
      return (
        <FeatureLinksForm value={section.props} onChange={onPropsChange} />
      )
    case "stats":
      return <StatsForm value={section.props} onChange={onPropsChange} />
    case "testimonials":
      return (
        <TestimonialsForm value={section.props} onChange={onPropsChange} />
      )
    case "faq":
      return <FAQForm value={section.props} onChange={onPropsChange} />
    case "contact_form":
      return (
        <ContactFormForm value={section.props} onChange={onPropsChange} />
      )
    default: {
      const _exhaustive: never = section
      return _exhaustive
    }
  }
}
