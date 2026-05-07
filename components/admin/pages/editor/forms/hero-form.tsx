"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import type { HeroSectionProps } from "@/lib/types/Pages"

type Props = {
  value: HeroSectionProps
  onChange: (next: HeroSectionProps) => void
}

type ImageRow = { url: string }

export function HeroForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HeroSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HeroSectionProps>(key: K, next: HeroSectionProps[K]) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  const imageRows: ImageRow[] = (local.images ?? []).map((url) => ({ url }))
  const setImagesFromRows = (rows: ImageRow[]) => {
    set(
      "images",
      rows.map((r) => r.url),
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="hero-title">Título *</Label>
        <Input
          id="hero-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="El sistema all-in-one para hacer crecer tu negocio."
        />
      </div>

      <div className="space-y-2">
        <Label>Imágenes del carrusel</Label>
        <p className="text-xs text-muted-foreground">
          Se muestran cinco a la vez; la del centro se destaca. Podés agregar más de cinco y rotar con las flechas en la página.
        </p>
        <ItemsField<ImageRow>
          items={imageRows}
          onChange={setImagesFromRows}
          createItem={() => ({ url: "" })}
          addLabel="Añadir imagen"
          emptyLabel="Sin imágenes. Añadí al menos una imagen desde la biblioteca."
          itemLabel={(_, i) => `Imagen ${i + 1}`}
          renderItem={(item, update) => (
            <ImagePicker
              value={item.url || null}
              onChange={(url) => update({ url: url ?? "" })}
            />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-cta-label">Texto del CTA *</Label>
        <Input
          id="hero-cta-label"
          value={local.ctaLabel ?? ""}
          onChange={(e) => set("ctaLabel", e.target.value)}
          placeholder="Demo Gratis"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-cta-href">Enlace del CTA *</Label>
        <Input
          id="hero-cta-href"
          value={local.ctaHref ?? ""}
          onChange={(e) => set("ctaHref", e.target.value)}
          placeholder="/contacto"
        />
      </div>
    </div>
  )
}
