"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type {
  TestimonialsSectionProps,
  LocalizedString,
} from "@/lib/types/Pages"

type Props = {
  value: TestimonialsSectionProps
  onChange: (next: TestimonialsSectionProps) => void
}

type TestimonialItem = TestimonialsSectionProps["items"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function TestimonialsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<TestimonialsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof TestimonialsSectionProps>(
    key: K,
    next: TestimonialsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título"
        idPrefix="test-title"
        value={local.title}
        onChange={(next) => set("title", next)}
      />

      <LocalizedField
        label="Subtítulo"
        idPrefix="test-subtitle"
        multiline
        rows={2}
        value={local.subtitle}
        onChange={(next) => set("subtitle", next)}
      />

      <div className="space-y-2">
        <Label>Testimonios</Label>
        <ItemsField<TestimonialItem>
          items={local.items ?? []}
          onChange={(items) => set("items", items)}
          createItem={() => ({
            logo: "",
            backgroundImage: "",
            summary: { es: "", en: "" },
            author: "",
            place: { es: "", en: "" },
            avatar: "",
          })}
          addLabel="Añadir testimonio"
          itemLabel={(it, i) => it.author || `Testimonio ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Logo</Label>
                <ImagePicker
                  aspect="square"
                  value={item.logo?.trim() ? item.logo : null}
                  onChange={(url) => update({ logo: url ?? "" })}
                />
                <p className="text-[11px] text-muted-foreground">
                  Sube o elige una imagen del mismo almacén que el resto del sitio.
                </p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Imagen de fondo</Label>
                <ImagePicker
                  value={item.backgroundImage || null}
                  onChange={(url) => update({ backgroundImage: url ?? "" })}
                />
                <p className="text-[11px] text-muted-foreground">
                  Se muestra detrás del contenido de la tarjeta con una capa
                  oscura para que el texto siga siendo legible.
                </p>
              </div>

              <LocalizedField
                label="Resumen"
                required
                multiline
                rows={3}
                value={
                  typeof item.summary === "string"
                    ? { es: item.summary, en: "" }
                    : (item.summary as LocalizedString | undefined) ??
                      (typeof item.quote === "string"
                        ? { es: item.quote, en: "" }
                        : (item.quote as LocalizedString | undefined))
                }
                onChange={(next) =>
                  update({ summary: next ?? EMPTY_LOCALIZED })
                }
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Autor *</Label>
                  <Input
                    value={item.author}
                    onChange={(e) => update({ author: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Avatar (URL)</Label>
                  <Input
                    value={item.avatar ?? ""}
                    onChange={(e) =>
                      update({ avatar: e.target.value || undefined })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <LocalizedField
                label="Lugar"
                value={
                  typeof item.place === "string"
                    ? { es: item.place, en: "" }
                    : (item.place as LocalizedString | undefined) ??
                      (typeof item.role === "string"
                        ? { es: item.role, en: "" }
                        : (item.role as LocalizedString | undefined))
                }
                onChange={(next) => update({ place: next })}
                placeholderEs="Marley Coffee"
                placeholderEn="Marley Coffee"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
