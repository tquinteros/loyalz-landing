"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import type { LocalizedString, PosSeparatorSectionProps } from "@/lib/types/Pages"
import { LocalizedField } from "./localized-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"

type Props = {
  value: PosSeparatorSectionProps
  onChange: (next: PosSeparatorSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function PosSeparatorForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<PosSeparatorSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof PosSeparatorSectionProps>(
    key: K,
    next: PosSeparatorSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <HexColorField
        label="Color del panel izquierdo"
        value={local.backgroundColor ?? ""}
        onChange={(hex) => set("backgroundColor", hex)}
        placeholder="#E85D33"
      />

      <LocalizedField
        label="Label (junto al logo)"
        idPrefix="pos-separator-label"
        value={local.label}
        onChange={(next) => set("label", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Loyalzpay"
        placeholderEn="Loyalzpay"
      />

      <LocalizedField
        label="Título *"
        idPrefix="pos-separator-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={2}
        placeholderEs="Pagos directos con Loyalz Pay"
        placeholderEn="Direct payments with Loyalz Pay"
      />

      <LocalizedField
        label="Descripción"
        idPrefix="pos-separator-description"
        value={local.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={3}
      />

      <div className="space-y-1">
        <Label>Imagen (columna derecha)</Label>
        <ImagePicker
          value={local.image?.trim() ? local.image : null}
          onChange={(url) => set("image", url ?? "")}
        />
      </div>
    </div>
  )
}
