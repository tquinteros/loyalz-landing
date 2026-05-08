"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { LocalizedField } from "./localized-field"
import type { ContactFormSectionProps } from "@/lib/types/Pages"

type Props = {
  value: ContactFormSectionProps
  onChange: (next: ContactFormSectionProps) => void
}

export function ContactFormForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ContactFormSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ContactFormSectionProps>(
    key: K,
    next: ContactFormSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título"
        idPrefix="cf-title"
        value={local.title}
        onChange={(next) => set("title", next)}
      />

      <LocalizedField
        label="Subtítulo"
        idPrefix="cf-subtitle"
        multiline
        rows={2}
        value={local.subtitle}
        onChange={(next) => set("subtitle", next)}
      />

      <LocalizedField
        label="Texto del botón"
        idPrefix="cf-submit"
        value={local.submitLabel}
        onChange={(next) => set("submitLabel", next)}
        placeholderEs="Enviar"
        placeholderEn="Send"
      />
    </div>
  )
}
