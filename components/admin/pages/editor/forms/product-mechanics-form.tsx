"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"
import { PRODUCT_MECHANICS_MOBILE_SCREEN } from "@/lib/products/mobile-screens"
import type {
  LocalizedString,
  ProductMechanicsProduct,
  ProductMechanicsSectionProps,
  ProductMechanicsStatItem,
} from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: ProductMechanicsSectionProps
  onChange: (next: ProductMechanicsSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

const PRODUCT_OPTIONS: Array<{ value: ProductMechanicsProduct; label: string }> = [
  { value: "club", label: "Club" },
  { value: "reviews", label: "Reviews" },
  { value: "ai", label: "AI" },
]

export function ProductMechanicsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ProductMechanicsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ProductMechanicsSectionProps>(
    key: K,
    next: ProductMechanicsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  const product = local.product ?? "club"
  const screenPath = PRODUCT_MECHANICS_MOBILE_SCREEN[product]

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="product-mechanics-product">Producto (pantalla)</Label>
        <Select
          value={product}
          onValueChange={(v) => set("product", v as ProductMechanicsProduct)}
        >
          <SelectTrigger id="product-mechanics-product" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Pantalla: <code className="text-xs">{screenPath}</code> +{" "}
          <code className="text-xs">/mobile-case.png</code>
        </p>
      </div>

      <HexColorField
        label="Color de fondo (sección)"
        value={local.backgroundColor ?? ""}
        onChange={(hex) => set("backgroundColor", hex || undefined)}
        placeholder="#F8F5EF"
      />

      <HexColorField
        label="Color del banner inferior"
        value={local.bottomLabelBackground ?? ""}
        onChange={(hex) => set("bottomLabelBackground", hex || undefined)}
        placeholder="#FFFFFF"
      />

      <LocalizedField
        label="Título (banner inferior) *"
        idPrefix="product-mechanics-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={2}
        placeholderEs={
          "Implementación en menos de 15 minutos.\nSin interrupciones en tu operación."
        }
        placeholderEn={
          "Setup in under 15 minutes.\nNo disruption to your operations."
        }
      />

      <div className="space-y-2">
        <Label>Stats flotantes</Label>
        <ItemsField<ProductMechanicsStatItem>
          items={local.stats ?? []}
          onChange={(stats) => set("stats", stats)}
          createItem={() => ({
            title: { es: "Título del stat", en: "Stat title" },
            stat: { es: "0", en: "0" },
            label: { es: "", en: "" },
          })}
          addLabel="Añadir stat"
          emptyLabel="Sin stats."
          itemLabel={(it, i) =>
            translate(it.title) || translate(it.stat) || `Stat ${i + 1}`
          }
          renderItem={(item, update) => (
            <div className="space-y-3">
              <LocalizedField
                label="Título"
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Clientes fidelizados"
                placeholderEn="Loyal customers"
              />
              <LocalizedField
                label="Stat *"
                required
                value={item.stat}
                onChange={(next) => update({ stat: next ?? EMPTY_LOCALIZED })}
                placeholderEs="158"
                placeholderEn="158"
              />
              <LocalizedField
                label="Label"
                value={item.label}
                onChange={(next) => update({ label: next })}
                placeholderEs="109 beneficios activos"
                placeholderEn="109 active benefits"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
