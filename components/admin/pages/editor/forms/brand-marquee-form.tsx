"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BrandMarqueeSectionProps } from "@/lib/types/Pages"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"

type Props = {
  value: BrandMarqueeSectionProps
  onChange: (next: BrandMarqueeSectionProps) => void
}

type Brand = BrandMarqueeSectionProps["brands"][number]

export function BrandMarqueeForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<BrandMarqueeSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof BrandMarqueeSectionProps>(
    key: K,
    next: BrandMarqueeSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título"
        idPrefix="brand-marquee-title"
        value={local.title}
        onChange={(next) => set("title", next)}
        placeholderEs="Marcas que confían en nosotros"
        placeholderEn="Brands that trust us"
      />

      <div className="space-y-2">
        <Label>Marcas</Label>
        <p className="text-xs text-muted-foreground">
          Se muestran en una cinta infinita. El nombre es opcional y se usa
          como texto alternativo (alt) de la imagen.
        </p>
        <ItemsField<Brand>
          items={local.brands ?? []}
          onChange={(brands) => set("brands", brands)}
          createItem={() => ({ name: "", logo: "" })}
          addLabel="Añadir marca"
          emptyLabel="Sin marcas. Añadí al menos una desde la biblioteca."
          itemLabel={(it, i) =>
            (it.name && it.name.trim()) || `Marca ${i + 1}`
          }
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Nombre</Label>
                <Input
                  value={item.name ?? ""}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Acme"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Logo *</Label>
                <ImagePicker
                  value={item.logo || null}
                  onChange={(url) => update({ logo: url ?? "" })}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
