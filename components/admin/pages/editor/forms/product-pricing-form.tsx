"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { ProductPricingSectionProps } from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: ProductPricingSectionProps
  onChange: (next: ProductPricingSectionProps) => void
}

type ProductPricingCard = ProductPricingSectionProps["cards"][number]

export function ProductPricingForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ProductPricingSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ProductPricingSectionProps>(
    key: K,
    next: ProductPricingSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label"
        idPrefix="product-pricing-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Nuestros productos"
        placeholderEn="Our products"
      />

      <LocalizedField
        label="Title"
        idPrefix="product-pricing-title"
        value={local.title}
        onChange={(next) => set("title", next)}
        placeholderEs="Los precios claros. Como todo en Loyalz."
        placeholderEn="Clear pricing. Just like everything at Loyalz."
      />

      <LocalizedField
        label="Description"
        idPrefix="product-pricing-description"
        multiline
        rows={2}
        value={local.description}
        onChange={(next) => set("description", next)}
        placeholderEs="Empeza con lo que necesitas hoy. Escala cuando quieras."
        placeholderEn="Start with what you need today. Scale whenever you want."
      />

      <div className="space-y-2">
        <Label>Cards</Label>
        <ItemsField<ProductPricingCard>
          items={local.cards ?? []}
          onChange={(cards) => set("cards", cards)}
          createItem={() => ({
            price: 0,
            title: { es: "Loyalz product", en: "Loyalz product" },
            description: {
              es: "Descripcion del producto.",
              en: "Product description.",
            },
            href: "/",
            ctaLabel: { es: "Explorar", en: "Explore" },
            color: "#754390",
          })}
          addLabel="Add card"
          itemLabel={(it, i) => translate(it.title) || `Card ${i + 1}`}
          renderItem={(item, update) => (
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Price *</Label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    value={item.price ?? 0}
                    onChange={(e) =>
                      update({
                        price: Number.isNaN(Number(e.target.value))
                          ? 0
                          : Number(e.target.value),
                      })
                    }
                    placeholder="19"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Color (hex) *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={item.color || "#754390"}
                      onChange={(e) => update({ color: e.target.value })}
                      className="h-9 w-14 p-1"
                    />
                    <Input
                      value={item.color ?? ""}
                      onChange={(e) => update({ color: e.target.value })}
                      placeholder="#754390"
                    />
                  </div>
                </div>
              </div>

              <LocalizedField
                label="Title"
                required
                value={item.title}
                onChange={(next) =>
                  update({ title: next ?? { es: "", en: "" } })
                }
                placeholderEs="Loyalz Club"
                placeholderEn="Loyalz Club"
              />

              <LocalizedField
                label="Description"
                required
                multiline
                rows={3}
                value={item.description}
                onChange={(next) =>
                  update({ description: next ?? { es: "", en: "" } })
                }
                placeholderEs="Mantené más visitas de tus clientes."
                placeholderEn="Keep your customers coming back."
              />

              <div className="space-y-1">
                <Label className="text-xs">Href *</Label>
                <Input
                  value={item.href ?? ""}
                  onChange={(e) => update({ href: e.target.value })}
                  placeholder="/club"
                />
              </div>

              <LocalizedField
                label="CTA label"
                required
                value={item.ctaLabel}
                onChange={(next) =>
                  update({ ctaLabel: next ?? { es: "", en: "" } })
                }
                placeholderEs="Explorar Club"
                placeholderEn="Explore Club"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
