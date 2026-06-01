"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import type {
  LocalizedString,
  ProductAiInformationSectionProps,
} from "@/lib/types/Pages"
import { LocalizedField } from "./localized-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"

type Props = {
  value: ProductAiInformationSectionProps
  onChange: (next: ProductAiInformationSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function ProductAiInformationForm({
  value,
  onChange,
}: Props) {
  const [local, setLocal] = useState<ProductAiInformationSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ProductAiInformationSectionProps>(
    key: K,
    next: ProductAiInformationSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <HexColorField
        label="Color de fondo de la sección"
        value={local.backgroundColor ?? ""}
        onChange={(hex) => set("backgroundColor", hex)}
        placeholder="#B2C8D9"
      />

      <HexColorField
        label="Color de texto (títulos, label, bordes)"
        value={local.textColor ?? ""}
        onChange={(hex) => set("textColor", hex)}
        placeholder="#013662"
      />

      <LocalizedField
        label="Label"
        idPrefix="product-ai-information-label"
        value={local.label}
        onChange={(next) => set("label", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Encargado 24/7"
        placeholderEn="On call 24/7"
      />

      <LocalizedField
        label="Título *"
        idPrefix="product-ai-information-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={2}
        placeholderEs="Un agente que suena real."
        placeholderEn="An agent that sounds real."
      />

      <LocalizedField
        label="Descripción"
        idPrefix="product-ai-information-description"
        value={local.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={3}
      />

      <LocalizedField
        label="Descripción inferior"
        idPrefix="product-ai-information-bottom-description"
        value={local.bottomDescription}
        onChange={(next) => set("bottomDescription", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={2}
        placeholderEs="Tu cliente llama y la AI atiende con voz natural. A cualquier hora. En cualquier idioma."
        placeholderEn="Your customer calls and AI answers with a natural voice. Any time. In any language."
      />

      <div className="space-y-1">
        <Label>Imagen (columna derecha, ~620×576)</Label>
        <ImagePicker
          value={local.image?.trim() ? local.image : null}
          onChange={(url) => set("image", url ?? "")}
        />
      </div>
    </div>
  )
}
