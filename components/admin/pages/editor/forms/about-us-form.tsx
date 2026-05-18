"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { AboutUsSectionProps, LocalizedString } from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: AboutUsSectionProps
  onChange: (next: AboutUsSectionProps) => void
}

type ImageItem = { url: string }

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

function toImageItems(images: string[]): ImageItem[] {
  return (images ?? []).map((url) => ({ url }))
}
function fromImageItems(items: ImageItem[]): string[] {
  return items.map((it) => it.url)
}

export function AboutUsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<AboutUsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof AboutUsSectionProps>(
    key: K,
    next: AboutUsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="about-us-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="¿Quiénes somos?"
        placeholderEn="Who are we?"
      />

      <LocalizedField
        label="Descripción"
        idPrefix="about-us-description"
        value={local.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Una breve descripción..."
        placeholderEn="A brief description..."
        multiline
        rows={3}
      />

      <div className="space-y-2">
        <Label>Artículos</Label>
        <ItemsField<LocalizedString>
          items={local.articles ?? []}
          onChange={(articles) => set("articles", articles)}
          createItem={() => ({ es: "", en: "" })}
          addLabel="Añadir artículo"
          emptyLabel="Sin artículos."
          itemLabel={(it, i) => translate(it) || `Artículo ${i + 1}`}
          renderItem={(item, update) => (
            <LocalizedField
              label="Texto"
              value={item}
              onChange={(next) => {
                if (next) update(next)
              }}
              placeholderEs="Texto en español..."
              placeholderEn="Text in English..."
              multiline
              rows={2}
            />
          )}
        />
      </div>

      <LocalizedField
        label="Pie de sección"
        idPrefix="about-us-bottom-label"
        value={local.bottomLabel}
        onChange={(next) => set("bottomLabel", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Pie de sección"
        placeholderEn="Section footer"
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
