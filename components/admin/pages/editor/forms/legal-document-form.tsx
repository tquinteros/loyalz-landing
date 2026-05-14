"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { BlogEditor } from "@/components/admin/blogs/blog-editor"
import { LocalizedField } from "./localized-field"
import type { LegalDocumentSectionProps } from "@/lib/types/Pages"
import type { TipTapDocument } from "@/lib/types/content"

type Props = {
  value: LegalDocumentSectionProps
  onChange: (next: LegalDocumentSectionProps) => void
}

export function LegalDocumentForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<LegalDocumentSectionProps>(() => ({
    ...value,
    body: { ...value.body },
  }))

  useEffect(() => {
    setLocal({ ...value, body: { ...value.body } })
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  function patch(next: LegalDocumentSectionProps) {
    setLocal(next)
    debouncedOnChange(next)
  }

  function setBodyLocale(locale: "es" | "en", doc: TipTapDocument) {
    const nextBody = { ...local.body, [locale]: doc }
    patch({ ...local, body: nextBody })
  }

  return (
    <div className="space-y-6">
      <LocalizedField
        label="Título"
        idPrefix="legal-title"
        value={local.title}
        onChange={(next) => patch({ ...local, title: next ?? {} })}
        placeholderEs="Términos y condiciones"
        placeholderEn="Terms and conditions"
      />

      <LocalizedField
        label="Descripción / introducción"
        idPrefix="legal-desc"
        multiline
        rows={3}
        value={local.description}
        onChange={(next) => patch({ ...local, description: next ?? {} })}
        placeholderEs="Texto breve bajo el título."
        placeholderEn="Short text below the title."
      />

      <div className="space-y-2">
        <Label className="text-xs">Cuerpo (ES)</Label>
        <BlogEditor
          value={local.body.es ?? null}
          onChange={(doc) => setBodyLocale("es", doc)}
          className="bg-card"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Cuerpo (EN)</Label>
        <BlogEditor
          value={local.body.en ?? null}
          onChange={(doc) => setBodyLocale("en", doc)}
          className="bg-card"
        />
      </div>
    </div>
  )
}
