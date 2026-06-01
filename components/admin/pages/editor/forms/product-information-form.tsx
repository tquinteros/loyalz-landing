"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import type {
  LocalizedString,
  ProductInformationSectionProps,
} from "@/lib/types/Pages"
import { LocalizedField } from "./localized-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"

type Props = {
  value: ProductInformationSectionProps
  onChange: (next: ProductInformationSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function ProductInformationForm({
  value,
  onChange,
}: Props) {
  const [local, setLocal] = useState<ProductInformationSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ProductInformationSectionProps>(
    key: K,
    next: ProductInformationSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <HexColorField
        label="Color del panel (panelBg)"
        value={local.backgroundColor ?? ""}
        onChange={(hex) => set("backgroundColor", hex)}
        placeholder="#E5E0EF"
      />

      <LocalizedField
        label="Título *"
        idPrefix="product-information-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={2}
      />

      <LocalizedField
        label="Descripción"
        idPrefix="product-information-description"
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
