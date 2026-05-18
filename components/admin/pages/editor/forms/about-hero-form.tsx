"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { AboutHeroSectionProps, LocalizedString } from "@/lib/types/Pages"

type Props = {
  value: AboutHeroSectionProps
  onChange: (next: AboutHeroSectionProps) => void
}

type ImageItem = { url: string }

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

function toImageItems(images: string[]): ImageItem[] {
  return (images ?? []).map((url) => ({ url }))
}
function fromImageItems(items: ImageItem[]): string[] {
  return items.map((it) => it.url)
}

export function AboutHeroForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<AboutHeroSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof AboutHeroSectionProps>(
    key: K,
    next: AboutHeroSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="about-hero-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Sobre nosotros"
        placeholderEn="About us"
      />

      <LocalizedField
        label="Descripción"
        idPrefix="about-hero-description"
        value={local.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Conocé quiénes somos..."
        placeholderEn="Learn who we are..."
        multiline
        rows={3}
      />

      <div className="space-y-2">
        <Label>Imágenes</Label>
        <ItemsField<ImageItem>
          items={toImageItems(local.images)}
          onChange={(items) => set("images", fromImageItems(items))}
          createItem={() => ({ url: "" })}
          addLabel="Añadir imagen"
          emptyLabel="Sin imágenes."
          itemLabel={(_, i) => `Imagen ${i + 1}`}
          renderItem={(item, update) => (
            <ImagePicker
              value={item.url || null}
              onChange={(url) => update({ url: url ?? "" })}
            />
          )}
        />
      </div>
    </div>
  )
}
