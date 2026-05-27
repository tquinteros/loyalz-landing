"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProductDetailSectionProps } from "@/lib/types/Pages"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"

type Props = {
  value: ProductDetailSectionProps
  onChange: (next: ProductDetailSectionProps) => void
}

type DetailItem = ProductDetailSectionProps["details"][number]

export function ProductDetailForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ProductDetailSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ProductDetailSectionProps>(
    key: K,
    next: ProductDetailSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label"
        idPrefix="product-detail-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Resultados"
        placeholderEn="Results"
      />

      <LocalizedField
        label="Título *"
        idPrefix="product-detail-title"
        value={local.title}
        onChange={(next) => set("title", next ?? { es: "", en: "" })}
        placeholderEs="Por qué elegir este producto"
        placeholderEn="Why choose this product"
      />

      <HexColorField
        label="Color de fondo (hex)"
        value={local.backgroundColor ?? ""}
        onChange={(hex) => set("backgroundColor", hex)}
        placeholder="#754390"
      />

      <div className="space-y-2">
        <Label>Estadísticas</Label>
        <p className="text-xs text-muted-foreground">
          Cada elemento muestra un dato destacado y una descripción breve.
        </p>
        <ItemsField<DetailItem>
          items={local.details ?? []}
          onChange={(details) => set("details", details)}
          createItem={() => ({ stat: "", description: { es: "", en: "" } })}
          addLabel="Añadir estadística"
          emptyLabel="Sin estadísticas. Añadí al menos una."
          itemLabel={(it, i) => it.stat || `Dato ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Valor / Stat *</Label>
                <Input
                  value={item.stat ?? ""}
                  onChange={(e) => update({ stat: e.target.value })}
                  placeholder="+4x"
                />
              </div>
              <LocalizedField
                label="Descripción *"
                idPrefix={`product-detail-desc-${item.stat}`}
                value={item.description}
                onChange={(next) => update({ description: next ?? { es: "", en: "" } })}
                placeholderEs="Frecuencia de visitas"
                placeholderEn="Visit frequency"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
