"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { ClubCardsSectionProps, LocalizedString } from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: ClubCardsSectionProps
  onChange: (next: ClubCardsSectionProps) => void
}

type ClubCard = ClubCardsSectionProps["cards"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function ClubCardsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ClubCardsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ClubCardsSectionProps>(
    key: K,
    next: ClubCardsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label"
        idPrefix="club-cards-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Loyalz Club"
        placeholderEn="Loyalz Club"
      />

      <LocalizedField
        label="Title"
        idPrefix="club-cards-title"
        value={local.title}
        onChange={(next) => set("title", next)}
        placeholderEs="No es solo una tarjeta con puntos..."
        placeholderEn="It's not just a card with points..."
      />

      <LocalizedField
        label="Subtitle"
        idPrefix="club-cards-subtitle"
        multiline
        rows={3}
        value={local.subtitle}
        onChange={(next) => set("subtitle", next)}
        placeholderEs="6 formas de hacer que vuelvan."
        placeholderEn="6 ways to make them come back."
      />

      <div className="space-y-2">
        <Label>Cards</Label>
        <ItemsField<ClubCard>
          items={local.cards ?? []}
          onChange={(cards) => set("cards", cards)}
          createItem={() => ({
            title: { es: "Título de tarjeta", en: "Card title" },
            description: { es: "Descripción", en: "Description" },
          })}
          addLabel="Add card"
          itemLabel={(it, i) => translate(it.title) || `Card ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <LocalizedField
                label="Title"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Estampas"
                placeholderEn="Stamps"
              />

              <LocalizedField
                label="Description"
                multiline
                rows={2}
                value={item.description}
                onChange={(next) => update({ description: next })}
                placeholderEs="Descripción de la tarjeta."
                placeholderEn="Description for this card."
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
