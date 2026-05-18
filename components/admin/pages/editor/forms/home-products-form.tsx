"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { HomeProductsSectionProps, LocalizedString } from "@/lib/types/Pages"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { t as translate } from "@/lib/utils"

type Props = {
  value: HomeProductsSectionProps
  onChange: (next: HomeProductsSectionProps) => void
}

type Product = HomeProductsSectionProps["products"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function HomeProductsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HomeProductsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HomeProductsSectionProps>(
    key: K,
    next: HomeProductsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label"
        idPrefix="home-products-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Productos"
        placeholderEn="Products"
      />

      <LocalizedField
        label="Título *"
        idPrefix="home-products-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Todo lo que necesitás para vender más"
        placeholderEn="Everything you need to sell more"
      />

      <div className="space-y-2">
        <Label>Productos</Label>
        <ItemsField<Product>
          items={local.products ?? []}
          onChange={(products) => set("products", products)}
          createItem={() => ({
            title: { es: "Nuevo producto", en: "New product" },
            subtitle: { es: "Subtítulo", en: "Subtitle" },
            description: {
              es: "Descripción del producto.",
              en: "Product description.",
            },
            color: "#754390",
            image: "",
            href: "",
          })}
          addLabel="Añadir producto"
          itemLabel={(it, i) => translate(it.title) || `Producto ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <LocalizedField
                label="Título"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Loyalz Club"
                placeholderEn="Loyalz Club"
              />

              <LocalizedField
                label="Subtítulo"
                required
                value={item.subtitle}
                onChange={(next) =>
                  update({ subtitle: next ?? EMPTY_LOCALIZED })
                }
                placeholderEs="Fidelización"
                placeholderEn="Loyalty"
              />
              <LocalizedField
                label="Descripción"
                required
                multiline
                rows={3}
                value={item.description}
                onChange={(next) =>
                  update({ description: next ?? EMPTY_LOCALIZED })
                }
                placeholderEs="Explicá cómo ayuda este producto."
                placeholderEn="Explain how this product helps."
              />

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
                    value={item.color}
                    onChange={(e) => update({ color: e.target.value })}
                    placeholder="#754390"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Enlace interno</Label>
                <Input
                  value={item.href ?? ""}
                  onChange={(e) => update({ href: e.target.value })}
                  placeholder="club"
                />
                <p className="text-xs text-muted-foreground">
                  Ruta interna sin dominio (ej. club → /club).
                </p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Imagen *</Label>
                <ImagePicker
                  value={item.image || null}
                  onChange={(url) => update({ image: url ?? "" })}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
