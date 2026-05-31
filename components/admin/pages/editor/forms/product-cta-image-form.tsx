"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LocalizedField } from "./localized-field"
import type { ProductCtaImageSectionProps, LocalizedString } from "@/lib/types/Pages"

type Props = {
  value: ProductCtaImageSectionProps
  onChange: (next: ProductCtaImageSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function ProductCtaImageForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ProductCtaImageSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ProductCtaImageSectionProps>(
    key: K,
    next: ProductCtaImageSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="product-cta-image-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Título de la sección"
        placeholderEn="Section title"
      />

      <LocalizedField
        label="Label"
        idPrefix="product-cta-image-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Etiqueta"
        placeholderEn="Label"
      />

      <div className="space-y-1.5">
        <Label htmlFor="product-cta-image-label-bg">Color de fondo del label (hex)</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            id="product-cta-image-label-bg-picker"
            value={local.labelBackgroundColor ?? "#DBC5E8"}
            onChange={(e) => set("labelBackgroundColor", e.target.value)}
            className="h-9 w-10 cursor-pointer rounded border border-input bg-transparent p-0.5"
          />
          <Input
            id="product-cta-image-label-bg"
            value={local.labelBackgroundColor ?? ""}
            onChange={(e) => set("labelBackgroundColor", e.target.value)}
            placeholder="#DBC5E8"
            className="font-mono"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Color de fondo de la insignia del label. Se ignora si el label está vacío.
        </p>
      </div>

      <p className="rounded-md bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        La imagen de fondo se configura en <strong>Opciones avanzadas → Imagen de fondo</strong>.
      </p>
    </div>
  )
}
