"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { LocalizedField } from "./localized-field"
import type { CTASectionProps } from "@/lib/types/Pages"

type Props = {
  value: CTASectionProps
  onChange: (next: CTASectionProps) => void
}

export function CtaForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<CTASectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof CTASectionProps>(key: K, next: CTASectionProps[K]) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Title"
        idPrefix="cta-title"
        value={local.title}
        onChange={(next) => set("title", next)}
        placeholderEs="¿Listo para empezar?"
        placeholderEn="Ready to get started?"
      />

      <LocalizedField
        label="Label"
        idPrefix="cta-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Contactanos"
        placeholderEn="Contact us"
      />
    </div>
  )
}
