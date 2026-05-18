"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { AboutStatsSectionProps, LocalizedString } from "@/lib/types/Pages"

type Props = {
  value: AboutStatsSectionProps
  onChange: (next: AboutStatsSectionProps) => void
}

type StatItem = AboutStatsSectionProps["stats"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function AboutStatsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<AboutStatsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof AboutStatsSectionProps>(
    key: K,
    next: AboutStatsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="about-stats-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Nuestros números"
        placeholderEn="Our numbers"
      />

      <LocalizedField
        label="Descripción"
        idPrefix="about-stats-description"
        value={local.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Lo que hemos logrado juntos."
        placeholderEn="What we have achieved together."
        multiline
        rows={3}
      />

      <div className="space-y-1">
        <Label htmlFor="about-stats-image" className="text-xs">
          Imagen
        </Label>
        <ImagePicker
          value={local.image || null}
          onChange={(url) => set("image", url ?? "")}
          aspect="square"
        />
      </div>

      <div className="space-y-2">
        <Label>Stats</Label>
        <ItemsField<StatItem>
          items={local.stats ?? []}
          onChange={(stats) => set("stats", stats)}
          createItem={() => ({ stat: "", statLabel: { es: "", en: "" } })}
          addLabel="Añadir stat"
          emptyLabel="Sin stats."
          itemLabel={(it, i) => it.stat || `Stat ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Valor *</Label>
                <Input
                  value={item.stat ?? ""}
                  onChange={(e) => update({ stat: e.target.value })}
                  placeholder="+100k"
                />
              </div>
              <LocalizedField
                label="Etiqueta *"
                value={item.statLabel}
                onChange={(next) =>
                  update({ statLabel: next ?? EMPTY_LOCALIZED })
                }
                placeholderEs="Usuarios"
                placeholderEn="Users"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
