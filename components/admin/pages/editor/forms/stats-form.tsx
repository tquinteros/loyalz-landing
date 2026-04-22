"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ItemsField } from "../items-field"
import type { StatsSectionProps } from "@/lib/types/Pages"

type Props = {
  value: StatsSectionProps
  onChange: (next: StatsSectionProps) => void
}

type StatItem = StatsSectionProps["items"][number]

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
      <div className="space-y-1.5">
        <Label htmlFor="stats-title">Título</Label>
        <Input
          id="stats-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="stats-subtitle">Subtítulo</Label>
        <Textarea
          id="stats-subtitle"
          rows={2}
          value={local.subtitle ?? ""}
          onChange={(e) => set("subtitle", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-2">
        <Label>Métricas</Label>
        <ItemsField<StatItem>
          items={local.items ?? []}
          onChange={(items) => set("items", items)}
          createItem={() => ({ value: "100+", label: "Clientes" })}
          addLabel="Añadir métrica"
          itemLabel={(it, i) => it.label || `Métrica ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Valor *</Label>
                <Input
                  value={item.value}
                  onChange={(e) => update({ value: e.target.value })}
                  placeholder="2.5x"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Etiqueta *</Label>
                <Input
                  value={item.label}
                  onChange={(e) => update({ label: e.target.value })}
                  placeholder="Repeat purchase rate"
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
