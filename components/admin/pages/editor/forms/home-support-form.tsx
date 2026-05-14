"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import type { HomeSupportSectionProps, LocalizedString } from "@/lib/types/Pages"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { t as translate } from "@/lib/utils"

type Props = {
  value: HomeSupportSectionProps
  onChange: (next: HomeSupportSectionProps) => void
}

type SupportItem = HomeSupportSectionProps["supports"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function HomeSupportForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HomeSupportSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HomeSupportSectionProps>(
    key: K,
    next: HomeSupportSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        La imagen de fondo de la sección se configura en{" "}
        <span className="font-medium">Opciones avanzadas</span> del editor.
      </p>

      <LocalizedField
        label="Título *"
        idPrefix="home-support-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={3}
        placeholderEs="Arrancás con todo el soporte. Sin costo extra."
        placeholderEn="You start with full support. At no extra cost."
      />

      <LocalizedField
        label="Subtítulo"
        idPrefix="home-support-subtitle"
        value={local.subtitle}
        onChange={(next) => set("subtitle", next)}
        multiline
        rows={2}
        placeholderEs="Equipo dedicado, material listo y capacitación incluida."
        placeholderEn="Dedicated team, ready-made assets, and training included."
      />

      <div className="space-y-2">
        <Label>Soportes</Label>
        <p className="text-xs text-muted-foreground">
          Tarjetas que se muestran en carrusel vertical infinito a la derecha.
        </p>
        <ItemsField<SupportItem>
          items={local.supports ?? []}
          onChange={(supports) => set("supports", supports)}
          createItem={() => ({
            title: { es: "", en: "" },
            description: { es: "", en: "" },
          })}
          addLabel="Añadir soporte"
          emptyLabel="Sin ítems. Añadí al menos uno."
          itemLabel={(it, i) =>
            translate(it.title) || `Soporte ${i + 1}`
          }
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <LocalizedField
                label="Título *"
                value={item.title}
                onChange={(next) =>
                  update({ title: next ?? EMPTY_LOCALIZED })
                }
                placeholderEs="Armamos tu kit digital."
                placeholderEn="We build your digital kit."
              />
              <LocalizedField
                label="Descripción *"
                multiline
                rows={4}
                value={item.description}
                onChange={(next) =>
                  update({ description: next ?? EMPTY_LOCALIZED })
                }
                placeholderEs="Flyers, QR, material para redes…"
                placeholderEn="Flyers, QR, social assets…"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
