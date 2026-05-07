"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import type { FAQSectionProps } from "@/lib/types/Pages"

type Props = {
  value: FAQSectionProps
  onChange: (next: FAQSectionProps) => void
}

type FAQItem = FAQSectionProps["items"][number]

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
      <div className="space-y-1.5">
        <Label htmlFor="faq-title">Título</Label>
        <Input
          id="faq-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="faq-subtitle">Subtítulo</Label>
        <Textarea
          id="faq-subtitle"
          rows={2}
          value={local.subtitle ?? ""}
          onChange={(e) => set("subtitle", e.target.value || undefined)}
        />
      </div>

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
          createItem={() => ({ question: "", answer: "" })}
          addLabel="Añadir pregunta"
          itemLabel={(it, i) => it.question || `Pregunta ${i + 1}`}
          renderItem={(item, update) => (
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs">Pregunta *</Label>
                <Input
                  value={item.question}
                  onChange={(e) => update({ question: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Respuesta *</Label>
                <Textarea
                  rows={3}
                  value={item.answer}
                  onChange={(e) => update({ answer: e.target.value })}
                />
              </div>
            </div>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="faq-help-title">Título bloque de ayuda</Label>
        <Input
          id="faq-help-title"
          value={local.helpTitle ?? ""}
          onChange={(e) => set("helpTitle", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="faq-help-description">Descripción bloque de ayuda</Label>
        <Textarea
          id="faq-help-description"
          rows={2}
          value={local.helpDescription ?? ""}
          onChange={(e) => set("helpDescription", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="faq-help-cta-label">Texto botón ayuda</Label>
        <Input
          id="faq-help-cta-label"
          value={local.helpCtaLabel ?? ""}
          onChange={(e) => set("helpCtaLabel", e.target.value || undefined)}
        />
      </div>

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
