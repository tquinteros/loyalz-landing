"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import type { LocalizedString, PosImageSeparatorSectionProps } from "@/lib/types/Pages"
import { LocalizedField } from "./localized-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"

type Props = {
  value: PosImageSeparatorSectionProps
  onChange: (next: PosImageSeparatorSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function PosImageSeparatorForm({
  value,
  onChange,
}: Props) {
  const [local, setLocal] = useState<PosImageSeparatorSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof PosImageSeparatorSectionProps>(
    key: K,
    next: PosImageSeparatorSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Configurá la imagen de fondo en <strong>Opciones avanzadas</strong>{" "}
        (background image) de la sección.
      </p>

      <LocalizedField
        label="Label"
        idPrefix="pos-image-separator-label"
        value={local.label}
        onChange={(next) => set("label", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Pay"
        placeholderEn="Pay"
      />

      <LocalizedField
        label="Título *"
        idPrefix="pos-image-separator-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={2}
        placeholderEs={"No es solo cobrar.\nEs vender mejor."}
        placeholderEn={"It's not just charging.\nIt's selling better."}
      />

      <HexColorField
        label="Color de texto (título y label)"
        value={local.titleColor ?? ""}
        onChange={(hex) => set("titleColor", hex)}
        placeholder="#E9967A"
      />
    </div>
  )
}
