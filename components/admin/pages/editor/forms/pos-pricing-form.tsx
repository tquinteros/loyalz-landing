"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type {
  LocalizedString,
  PosPricingCardItem,
  PosPricingSectionProps,
} from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: PosPricingSectionProps
  onChange: (next: PosPricingSectionProps) => void
}

type PricingCard = PosPricingCardItem

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

function featuresToText(features: LocalizedString[] | undefined, locale: "es" | "en") {
  return (features ?? []).map((f) => f[locale] ?? "").join("\n")
}

function featuresFromText(
  raw: string,
  locale: "es" | "en",
  existing: LocalizedString[] | undefined,
): LocalizedString[] {
  return raw.split("\n").map((line, i) => {
    const prev = existing?.[i]
    if (locale === "es") {
      return { es: line, en: prev?.en ?? "" }
    }
    return { es: prev?.es ?? "", en: line }
  })
}

export function PosPricingForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<PosPricingSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof PosPricingSectionProps>(
    key: K,
    next: PosPricingSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label"
        idPrefix="pos-pricing-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Precios"
        placeholderEn="Pricing"
      />

      <LocalizedField
        label="Título *"
        idPrefix="pos-pricing-title"
        value={local.title}
        onChange={(next) => set("title", next)}
        multiline
        rows={2}
        placeholderEs={"Sin letra chica.\nSin costo oculto."}
        placeholderEn={"No fine print.\nNo hidden fees."}
      />

      <LocalizedField
        label="Mensaje inferior (banner)"
        idPrefix="pos-pricing-bottom-message"
        value={local.bottomMessage}
        onChange={(next) => set("bottomMessage", next)}
        placeholderEs="* POS + Pay incluidos en todos los planes de Loyalz."
        placeholderEn="* POS + Pay included in all Loyalz plans."
      />

      <div className="space-y-2">
        <Label>CTA Principal</Label>
        <div className="grid gap-2">
          <LocalizedField
            label="Texto del botón *"
            idPrefix="pos-pricing-primary-cta-label"
            value={local.primaryCta?.label}
            onChange={(next) =>
              set("primaryCta", {
                ...local.primaryCta,
                label: next ?? EMPTY_LOCALIZED,
                href: local.primaryCta?.href ?? "/contact",
              })
            }
            placeholderEs="Prueba GRATIS"
            placeholderEn="Free Trial"
          />
          <div className="space-y-1">
            <Label className="text-xs">Enlace</Label>
            <Input
              value={local.primaryCta?.href ?? ""}
              onChange={(e) =>
                set("primaryCta", {
                  ...local.primaryCta,
                  label: local.primaryCta?.label ?? EMPTY_LOCALIZED,
                  href: e.target.value,
                })
              }
              placeholder="/contact"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>CTA Secundario</Label>
        <div className="grid gap-2">
          <LocalizedField
            label="Texto del botón"
            idPrefix="pos-pricing-secondary-cta-label"
            value={local.secondaryCta?.label}
            onChange={(next) =>
              set("secondaryCta", {
                label: next ?? EMPTY_LOCALIZED,
                href: local.secondaryCta?.href ?? "/contact",
              })
            }
            placeholderEs="Agendar DEMO"
            placeholderEn="Book a Demo"
          />
          <div className="space-y-1">
            <Label className="text-xs">Enlace</Label>
            <Input
              value={local.secondaryCta?.href ?? ""}
              onChange={(e) =>
                set("secondaryCta", {
                  label: local.secondaryCta?.label ?? EMPTY_LOCALIZED,
                  href: e.target.value,
                })
              }
              placeholder="/contact"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tarjetas de precios (2 por fila)</Label>
        <ItemsField<PricingCard>
          items={local.cards ?? []}
          onChange={(cards) => set("cards", cards)}
          createItem={() => ({
            title: { es: "POS", en: "POS" },
            price: "Gratis",
            shops: { es: "Sin integraciones", en: "No integrations" },
            features: [{ es: "Funcionalidad", en: "Feature" }],
          })}
          addLabel="Añadir tarjeta"
          itemLabel={(it, i) => translate(it.title) || `Card ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <LocalizedField
                label="Label de tarjeta (ej. POS, PAY)"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="POS"
                placeholderEn="POS"
              />

              <div className="space-y-1">
                <Label className="text-xs">Título / precio *</Label>
                <Input
                  value={item.price}
                  onChange={(e) => update({ price: e.target.value })}
                  placeholder="Gratis"
                />
              </div>

              <LocalizedField
                label="Botón (pill)"
                required
                value={item.shops}
                onChange={(next) => update({ shops: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Sin integraciones"
                placeholderEn="No integrations"
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Features ES (una por línea)</Label>
                  <Textarea
                    rows={4}
                    value={featuresToText(item.features, "es")}
                    onChange={(e) =>
                      update({
                        features: featuresFromText(
                          e.target.value,
                          "es",
                          item.features,
                        ),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Features EN (one per line)</Label>
                  <Textarea
                    rows={4}
                    value={featuresToText(item.features, "en")}
                    onChange={(e) =>
                      update({
                        features: featuresFromText(
                          e.target.value,
                          "en",
                          item.features,
                        ),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
