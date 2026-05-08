"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { LocalizedField } from "./localized-field"
import type { HeroClubSectionProps, LocalizedString } from "@/lib/types/Pages"

type Props = {
  value: HeroClubSectionProps
  onChange: (next: HeroClubSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function HeroClubForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HeroClubSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HeroClubSectionProps>(
    key: K,
    next: HeroClubSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="hero-club-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Convierte a cada cliente…"
        placeholderEn="Turn every customer…"
      />

      <LocalizedField
        label="Subtítulo"
        idPrefix="hero-club-subtitle"
        multiline
        rows={3}
        value={local.subtitle}
        onChange={(next) => set("subtitle", next ?? EMPTY_LOCALIZED)}
      />

      <div className="space-y-1.5">
        <Label>Imagen</Label>
        <ImagePicker
          value={local.image || null}
          onChange={(url) => set("image", url ?? "")}
        />
      </div>

      <div className="space-y-2 rounded-md border bg-muted/20 p-3">
        <Label>CTA principal</Label>
        <LocalizedField
          label="Texto del botón"
          value={local.primaryCta?.label}
          onChange={(next) =>
            set("primaryCta", {
              ...(local.primaryCta ?? { label: EMPTY_LOCALIZED, href: "" }),
              label: next ?? EMPTY_LOCALIZED,
            })
          }
        />
        <div className="space-y-1">
          <Label className="text-xs">Enlace</Label>
          <Input
            placeholder="/ruta"
            value={local.primaryCta?.href ?? ""}
            onChange={(e) =>
              set("primaryCta", {
                ...(local.primaryCta ?? { label: EMPTY_LOCALIZED, href: "" }),
                href: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
