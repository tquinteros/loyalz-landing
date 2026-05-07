"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ItemsField } from "../items-field"
import type { ProductPricingSectionProps } from "@/lib/types/Pages"

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
      <div className="space-y-1.5">
        <Label htmlFor="product-pricing-label">Label</Label>
        <Input
          id="product-pricing-label"
          value={local.label ?? ""}
          onChange={(e) => set("label", e.target.value || undefined)}
          placeholder="Nuestros productos"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product-pricing-title">Title</Label>
        <Input
          id="product-pricing-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value || undefined)}
          placeholder="Los precios claros. Como todo en Loyalz."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product-pricing-description">Description</Label>
        <Textarea
          id="product-pricing-description"
          rows={2}
          value={local.description ?? ""}
          onChange={(e) => set("description", e.target.value || undefined)}
          placeholder="Empeza con lo que necesitas hoy. Escala cuando quieras."
        />
      </div>

      <div className="space-y-2">
        <Label>Cards</Label>
        <ItemsField<ProductPricingCard>
          items={local.cards ?? []}
          onChange={(cards) => set("cards", cards)}
          createItem={() => ({
            price: 0,
            title: "Loyalz product",
            description: "Descripcion del producto.",
            href: "/",
            ctaLabel: "Explorar",
            color: "#754390",
          })}
          addLabel="Add card"
          itemLabel={(it, i) => it.title || `Card ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Price *</Label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  value={item.price ?? 0}
                  onChange={(e) =>
                    update({ price: Number.isNaN(Number(e.target.value)) ? 0 : Number(e.target.value) })
                  }
                  placeholder="19"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Title *</Label>
                <Input
                  value={item.title ?? ""}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Loyalz Club"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Description *</Label>
                <Textarea
                  rows={3}
                  value={item.description ?? ""}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="Mantené más visitas de tus clientes."
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Href *</Label>
                <Input
                  value={item.href ?? ""}
                  onChange={(e) => update({ href: e.target.value })}
                  placeholder="/club"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">CTA label *</Label>
                <Input
                  value={item.ctaLabel ?? ""}
                  onChange={(e) => update({ ctaLabel: e.target.value })}
                  placeholder="Explorar Club"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
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
          )}
        />
      </div>
    </div>
  )
}
