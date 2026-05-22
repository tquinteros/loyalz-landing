"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type {
  AudienceDemoFeatureItem,
  AudienceDemoProps,
  AudienceTabItem,
} from "@/lib/types/Pages"
import { EMPTY_LOCALIZED } from "@/lib/audiences/tab-blocks"
import { t as translate } from "@/lib/utils"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../../../items-field"
import { LocalizedField } from "../../localized-field"
import { HexColorField } from "../hex-color-field"

type Props = {
  tab: AudienceTabItem
  onChange: (patch: Partial<AudienceTabItem>) => void
}

export function AudienceTabDemoEditor({ tab, onChange }: Props) {
  const value = tab.audienceDemo!

  const set = <K extends keyof AudienceDemoProps>(
    key: K,
    next: AudienceDemoProps[K],
  ) => onChange({ audienceDemo: { ...value, [key]: next } })

  return (
    <div className="space-y-5">
      <HexColorField
        label="Color de fondo de sección *"
        value={value.backgroundColor}
        onChange={(backgroundColor) => set("backgroundColor", backgroundColor)}
      />

      <LocalizedField
        variant="comfortable"
        label="Label"
        idPrefix={`${tab.key}-demo-label`}
        value={value.label}
        onChange={(next) => set("label", next)}
        placeholderEs="¿Necesitás elegir uno para empezar?"
        placeholderEn="Need to pick one to get started?"
      />
      <LocalizedField
        variant="comfortable"
        label="Título *"
        idPrefix={`${tab.key}-demo-title`}
        value={value.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Loyalz club"
        placeholderEn="Loyalz club"
      />
      <LocalizedField
        variant="comfortable"
        label="Descripción"
        idPrefix={`${tab.key}-demo-description`}
        value={value.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={3}
        placeholderEs="El sistema de fidelización para que siempre vuelvan."
        placeholderEn="The loyalty system that keeps them coming back."
      />

      <LocalizedField
        variant="comfortable"
        label="CTA — etiqueta *"
        idPrefix={`${tab.key}-demo-cta-label`}
        value={value.ctaLabel}
        onChange={(next) => set("ctaLabel", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Demo Gratis"
        placeholderEn="Free demo"
      />
      <div className="space-y-1">
        <Label className="text-sm">CTA — enlace *</Label>
        <Input
          value={value.ctaHref ?? ""}
          onChange={(e) => set("ctaHref", e.target.value)}
          placeholder="/contact"
          className="h-10 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Imagen hero *</Label>
        <ImagePicker
          value={value.image ?? ""}
          onChange={(image) => set("image", image ?? "")}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Features</Label>
        <ItemsField<AudienceDemoFeatureItem>
          items={value.features ?? []}
          onChange={(features) => set("features", features)}
          createItem={() => ({
            title: { es: "Estampas", en: "Stamps" },
            description: {
              es: "Descripción de la feature.",
              en: "Feature description.",
            },
          })}
          addLabel="Añadir feature"
          emptyLabel="Sin features."
          itemLabel={(it, i) => translate(it.title) || `Feature ${i + 1}`}
          renderItem={(item, update) => (
            <div className="space-y-3">
              <LocalizedField
                variant="comfortable"
                label="Título *"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Estampas"
                placeholderEn="Stamps"
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
                placeholderEs="Descripción de la feature."
                placeholderEn="Feature description."
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
