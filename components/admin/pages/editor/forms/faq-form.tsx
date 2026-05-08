"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { FAQSectionProps, LocalizedString } from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: FAQSectionProps
  onChange: (next: FAQSectionProps) => void
}

type FAQItem = FAQSectionProps["items"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function FAQForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<FAQSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof FAQSectionProps>(
    key: K,
    next: FAQSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título"
        idPrefix="faq-title"
        value={local.title}
        onChange={(next) => set("title", next)}
      />

      <LocalizedField
        label="Subtítulo"
        idPrefix="faq-subtitle"
        multiline
        rows={2}
        value={local.subtitle}
        onChange={(next) => set("subtitle", next)}
      />

      <div className="space-y-1.5">
        <Label>Imagen</Label>
        <ImagePicker
          value={local.image || null}
          onChange={(url) => set("image", url ?? "")}
          aspect="video"
        />
      </div>

      <div className="space-y-2">
        <Label>Preguntas</Label>
        <ItemsField<FAQItem>
          items={local.items ?? []}
          onChange={(items) => set("items", items)}
          createItem={() => ({
            question: { es: "", en: "" },
            answer: { es: "", en: "" },
          })}
          addLabel="Añadir pregunta"
          itemLabel={(it, i) => translate(it.question) || `Pregunta ${i + 1}`}
          renderItem={(item, update) => (
            <div className="space-y-3">
              <LocalizedField
                label="Pregunta"
                required
                value={item.question}
                onChange={(next) =>
                  update({ question: next ?? EMPTY_LOCALIZED })
                }
              />
              <LocalizedField
                label="Respuesta"
                required
                multiline
                rows={3}
                value={item.answer}
                onChange={(next) => update({ answer: next ?? EMPTY_LOCALIZED })}
              />
            </div>
          )}
        />
      </div>

      <LocalizedField
        label="Título bloque de ayuda"
        idPrefix="faq-help-title"
        value={local.helpTitle}
        onChange={(next) => set("helpTitle", next)}
      />

      <LocalizedField
        label="Descripción bloque de ayuda"
        idPrefix="faq-help-description"
        multiline
        rows={2}
        value={local.helpDescription}
        onChange={(next) => set("helpDescription", next)}
      />

      <LocalizedField
        label="Texto botón ayuda"
        idPrefix="faq-help-cta-label"
        value={local.helpCtaLabel}
        onChange={(next) => set("helpCtaLabel", next)}
      />

      <div className="space-y-1.5">
        <Label htmlFor="faq-help-cta-href">Enlace botón ayuda</Label>
        <Input
          id="faq-help-cta-href"
          value={local.helpCtaHref ?? ""}
          onChange={(e) => set("helpCtaHref", e.target.value || undefined)}
          placeholder="/contact"
        />
      </div>
    </div>
  )
}
