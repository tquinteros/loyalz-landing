"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type {
  AudienceEcosystemDetailItem,
  AudienceEcosystemProps,
  AudienceTabItem,
} from "@/lib/types/Pages"
import { EMPTY_LOCALIZED } from "@/lib/audiences/tab-blocks"
import { t as translate } from "@/lib/utils"
import { ItemsField } from "../../../items-field"
import { LocalizedField } from "../../localized-field"
import { HexColorField } from "../hex-color-field"

type Props = {
  tab: AudienceTabItem
  onChange: (patch: Partial<AudienceTabItem>) => void
}

export function AudienceTabEcosystemEditor({ tab, onChange }: Props) {
  const value = tab.audienceEcosystem!

  const set = <K extends keyof AudienceEcosystemProps>(
    key: K,
    next: AudienceEcosystemProps[K],
  ) => onChange({ audienceEcosystem: { ...value, [key]: next } })

  return (
    <div className="space-y-5">
      <LocalizedField
        variant="comfortable"
        label="Label"
        idPrefix={`${tab.key}-ecosystem-label`}
        value={value.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Ecosystem"
        placeholderEn="Ecosystem"
      />
      <LocalizedField
        variant="comfortable"
        label="Título *"
        idPrefix={`${tab.key}-ecosystem-title`}
        value={value.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Un ecosistema pensado para vos"
        placeholderEn="An ecosystem built for you"
      />
      <LocalizedField
        variant="comfortable"
        label="Descripción"
        idPrefix={`${tab.key}-ecosystem-description`}
        value={value.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={3}
        placeholderEs="Descripción del ecosistema..."
        placeholderEn="Ecosystem description..."
      />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Detalles</Label>
        <ItemsField<AudienceEcosystemDetailItem>
          items={value.details ?? []}
          onChange={(details) => set("details", details)}
          createItem={() => ({
            backgroundColor: "#F8F5EF",
            label: { es: "Detalle", en: "Detail" },
            title: { es: "Título del detalle", en: "Detail title" },
            description: {
              es: "Descripción del detalle.",
              en: "Detail description.",
            },
          })}
          addLabel="Añadir detalle"
          emptyLabel="Sin detalles."
          itemLabel={(it, i) =>
            translate(it.title) || translate(it.label) || `Detalle ${i + 1}`
          }
          renderItem={(item, update) => (
            <div className="space-y-3">
              <HexColorField
                value={item.backgroundColor}
                onChange={(backgroundColor) => update({ backgroundColor })}
              />
              <LocalizedField
                variant="comfortable"
                label="Label"
                value={item.label}
                onChange={(next) => update({ label: next })}
                placeholderEs="Club"
                placeholderEn="Club"
              />
              <LocalizedField
                variant="comfortable"
                label="Título *"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Título del detalle"
                placeholderEn="Detail title"
              />
              <LocalizedField
                variant="comfortable"
                label="Descripción"
                multiline
                rows={2}
                value={item.description}
                onChange={(next) =>
                  update({ description: next ?? EMPTY_LOCALIZED })
                }
                placeholderEs="Descripción del detalle."
                placeholderEn="Detail description."
              />
            </div>
          )}
        />
      </div>

      <LocalizedField
        variant="comfortable"
        label="Label inferior"
        idPrefix={`${tab.key}-ecosystem-bottom-label`}
        value={value.bottomLabel}
        onChange={(next) => set("bottomLabel", next)}
        placeholderEs="Texto debajo de las tarjetas"
        placeholderEn="Text below the cards"
      />

      <LocalizedField
        variant="comfortable"
        label="CTA inferior — etiqueta *"
        idPrefix={`${tab.key}-ecosystem-cta-label`}
        value={value.bottomCtaLabel}
        onChange={(next) => set("bottomCtaLabel", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Empezar ahora"
        placeholderEn="Get started"
      />
      <div className="space-y-1">
        <Label className="text-sm">CTA inferior — enlace *</Label>
        <Input
          value={value.bottomCtaHref ?? ""}
          onChange={(e) => set("bottomCtaHref", e.target.value)}
          placeholder="/contact"
          className="h-10 text-sm"
        />
      </div>
    </div>
  )
}
