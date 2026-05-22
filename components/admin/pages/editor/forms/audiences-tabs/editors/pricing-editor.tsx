"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type {
  AudiencePricingCardItem,
  AudiencePricingProps,
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

export function AudienceTabPricingEditor({ tab, onChange }: Props) {
  const value = tab.audiencePricing!

  const set = <K extends keyof AudiencePricingProps>(
    key: K,
    next: AudiencePricingProps[K],
  ) => onChange({ audiencePricing: { ...value, [key]: next } })

  return (
    <div className="space-y-5">
      <LocalizedField
        variant="comfortable"
        label="Label"
        idPrefix={`${tab.key}-pricing-label`}
        value={value.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Pricing"
        placeholderEn="Pricing"
      />
      <LocalizedField
        variant="comfortable"
        label="Título *"
        idPrefix={`${tab.key}-pricing-title`}
        value={value.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Planes para tu negocio"
        placeholderEn="Plans for your business"
      />
      <LocalizedField
        variant="comfortable"
        label="Descripción"
        idPrefix={`${tab.key}-pricing-description`}
        value={value.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={3}
        placeholderEs="Elegí el plan que mejor se adapte a vos."
        placeholderEn="Choose the plan that fits you best."
      />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Tarjetas de precio</Label>
        <ItemsField<AudiencePricingCardItem>
          items={value.pricingCards ?? []}
          onChange={(pricingCards) => set("pricingCards", pricingCards)}
          createItem={() => ({
            price: "29",
            title: { es: "Plan", en: "Plan" },
            label: { es: "Popular", en: "Popular" },
            description: {
              es: "Descripción del plan.",
              en: "Plan description.",
            },
            backgroundColor: "#754390",
          })}
          addLabel="Añadir tarjeta"
          emptyLabel="Sin tarjetas de precio."
          itemLabel={(it, i) =>
            translate(it.title) || translate(it.label) || `Plan ${i + 1}`
          }
          renderItem={(item, update) => (
            <div className="space-y-3">
              <HexColorField
                value={item.backgroundColor}
                onChange={(backgroundColor) => update({ backgroundColor })}
              />
              <div className="space-y-1">
                <Label className="text-xs">Precio (número o texto)</Label>
                <Input
                  value={item.price ?? ""}
                  onChange={(e) => update({ price: e.target.value })}
                  placeholder="29 o 0 para gratis"
                  className="h-10 text-sm"
                />
              </div>
              <LocalizedField
                variant="comfortable"
                label="Título *"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Club"
                placeholderEn="Club"
              />
              <LocalizedField
                variant="comfortable"
                label="Label"
                value={item.label}
                onChange={(next) => update({ label: next })}
                placeholderEs="Popular"
                placeholderEn="Popular"
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
                placeholderEs="Descripción del plan."
                placeholderEn="Plan description."
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
