"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import type { HomeAutonomySectionProps, LocalizedString } from "@/lib/types/Pages"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { t as translate } from "@/lib/utils"

type Props = {
  value: HomeAutonomySectionProps
  onChange: (next: HomeAutonomySectionProps) => void
}

type StatItem = HomeAutonomySectionProps["stats"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function HomeAutonomyForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HomeAutonomySectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HomeAutonomySectionProps>(
    key: K,
    next: HomeAutonomySectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título (banda inferior) *"
        idPrefix="home-autonomy-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Más autonomía y personalización para tomar decisiones."
        placeholderEn="More autonomy and personalization to make decisions."
        multiline
        rows={2}
      />

      <div className="space-y-2">
        <Label>Estadísticas</Label>
        <p className="text-xs text-muted-foreground">
          Las cuatro primeras se muestran en las esquinas alrededor del iPad;
          si añadís más, aparecen en fila debajo del dispositivo.
        </p>
        <ItemsField<StatItem>
          items={local.stats ?? []}
          onChange={(stats) => set("stats", stats)}
          createItem={() => ({
            title: { es: "", en: "" },
            description: { es: "", en: "" },
            statText: { es: "", en: "" },
          })}
          addLabel="Añadir estadística"
          emptyLabel="Sin estadísticas. Añadí al menos una."
          itemLabel={(it, i) =>
            translate(it.title) || translate(it.statText) || `Estadística ${i + 1}`
          }
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <LocalizedField
                label="Título *"
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Reservas"
                placeholderEn="Reservations"
              />
              <LocalizedField
                label="Valor / texto principal *"
                value={item.statText}
                onChange={(next) => update({ statText: next ?? EMPTY_LOCALIZED })}
                placeholderEs="7 mesas"
                placeholderEn="7 tables"
              />
              <LocalizedField
                label="Descripción (opcional, estilo pastilla)"
                value={item.description}
                onChange={(next) => update({ description: next })}
                placeholderEs="20 pendientes"
                placeholderEn="20 pending"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
