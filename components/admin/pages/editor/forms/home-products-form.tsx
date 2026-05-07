"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { HomeProductsSectionProps } from "@/lib/types/Pages"
import { ItemsField } from "../items-field"

type Props = {
  value: HomeProductsSectionProps
  onChange: (next: HomeProductsSectionProps) => void
}

type Product = HomeProductsSectionProps["products"][number]

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
      <div className="space-y-1.5">
        <Label htmlFor="home-products-label">Label</Label>
        <Input
          id="home-products-label"
          value={local.label ?? ""}
          onChange={(e) => set("label", e.target.value || undefined)}
          placeholder="Productos"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="home-products-title">Título *</Label>
        <Input
          id="home-products-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Todo lo que necesitás para vender más"
        />
      </div>

      <div className="space-y-2">
        <Label>Productos</Label>
        <ItemsField<Product>
          items={local.products ?? []}
          onChange={(products) => set("products", products)}
          createItem={() => ({
            title: "Nuevo producto",
            subtitle: "Subtítulo",
            description: "Descripción del producto.",
            color: "#754390",
            image: "",
          })}
          addLabel="Añadir producto"
          itemLabel={(it, i) => it.title || `Producto ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Título *</Label>
                <Input
                  value={item.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Loyalz Club"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Subtítulo *</Label>
                <Input
                  value={item.subtitle}
                  onChange={(e) => update({ subtitle: e.target.value })}
                  placeholder="Fidelización"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Descripción *</Label>
                <Textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="Explicá cómo ayuda este producto."
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
                    value={item.color}
                    onChange={(e) => update({ color: e.target.value })}
                    placeholder="#754390"
                  />
                </div>
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
