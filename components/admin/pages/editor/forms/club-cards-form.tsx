"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ItemsField } from "../items-field"
import type { ClubCardsSectionProps } from "@/lib/types/Pages"

type Props = {
  value: ClubCardsSectionProps
  onChange: (next: ClubCardsSectionProps) => void
}

type ClubCard = ClubCardsSectionProps["cards"][number]

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
      <div className="space-y-1.5">
        <Label htmlFor="club-cards-label">Label</Label>
        <Input
          id="club-cards-label"
          value={local.label ?? ""}
          onChange={(e) => set("label", e.target.value || undefined)}
          placeholder="Loyalz Club"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="club-cards-title">Title</Label>
        <Input
          id="club-cards-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value || undefined)}
          placeholder="No es solo una tarjeta con puntos..."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="club-cards-subtitle">Subtitle</Label>
        <Textarea
          id="club-cards-subtitle"
          rows={3}
          value={local.subtitle ?? ""}
          onChange={(e) => set("subtitle", e.target.value || undefined)}
          placeholder="6 formas de hacer que vuelvan."
        />
      </div>

      <div className="space-y-2">
        <Label>Cards</Label>
        <ItemsField<ClubCard>
          items={local.cards ?? []}
          onChange={(cards) => set("cards", cards)}
          createItem={() => ({
            title: "Card title",
            description: "Card description",
          })}
          addLabel="Add card"
          itemLabel={(it, i) => it.title || `Card ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Title *</Label>
                <Input
                  value={item.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Estampas"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea
                  rows={2}
                  value={item.description ?? ""}
                  onChange={(e) =>
                    update({ description: e.target.value || undefined })
                  }
                  placeholder="Description for this card."
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
