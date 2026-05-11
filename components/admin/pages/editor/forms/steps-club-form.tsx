"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { StepsClubSectionProps, LocalizedString } from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: StepsClubSectionProps
  onChange: (next: StepsClubSectionProps) => void
}

type Step = StepsClubSectionProps["steps"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function StepsClubForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<StepsClubSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof StepsClubSectionProps>(
    key: K,
    next: StepsClubSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="steps-club-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Cómo funciona"
        placeholderEn="How it works"
      />

      <div className="space-y-2">
        <Label>Pasos</Label>
        <ItemsField<Step>
          items={local.steps ?? []}
          onChange={(steps) => set("steps", steps)}
          createItem={() => ({
            title: { es: "Nuevo paso", en: "New step" },
            description: { es: "", en: "" },
            image: "",
          })}
          addLabel="Añadir paso"
          itemLabel={(it, i) => translate(it.title) || `Paso ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <LocalizedField
                label="Título"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Título del paso"
                placeholderEn="Step title"
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
                placeholderEs="Texto del paso"
                placeholderEn="Step copy"
              />

              <div className="space-y-1">
                <Label className="text-xs">Imagen</Label>
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
