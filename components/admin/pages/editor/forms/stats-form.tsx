"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { StatsSectionProps, LocalizedString } from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: StatsSectionProps
  onChange: (next: StatsSectionProps) => void
}

type StatItem = StatsSectionProps["items"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function StatsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<StatsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof StatsSectionProps>(
    key: K,
    next: StatsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título"
        idPrefix="stats-title"
        value={local.title}
        onChange={(next) => set("title", next)}
      />

      <LocalizedField
        label="Subtítulo"
        idPrefix="stats-subtitle"
        multiline
        rows={2}
        value={local.subtitle}
        onChange={(next) => set("subtitle", next)}
      />

      <div className="space-y-2">
        <Label>Métricas</Label>
        <ItemsField<StatItem>
          items={local.items ?? []}
          onChange={(items) => set("items", items)}
          createItem={() => ({
            value: "100+",
            label: { es: "Clientes", en: "Customers" },
          })}
          addLabel="Añadir métrica"
          itemLabel={(it, i) => translate(it.label) || `Métrica ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Valor *</Label>
                <Input
                  value={item.value}
                  onChange={(e) => update({ value: e.target.value })}
                  placeholder="2.5x"
                />
              </div>

              <LocalizedField
                label="Etiqueta"
                required
                value={item.label}
                onChange={(next) => update({ label: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Tasa de recompra"
                placeholderEn="Repeat purchase rate"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
