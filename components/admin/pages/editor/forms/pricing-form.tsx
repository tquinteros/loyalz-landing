"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { PricingSectionProps, LocalizedString } from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: PricingSectionProps
  onChange: (next: PricingSectionProps) => void
}

type PricingCard = PricingSectionProps["cards"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

function featuresToText(features: LocalizedString[] | undefined, locale: "es" | "en") {
  return (features ?? [])
    .map((f) => f[locale] ?? "")
    .filter(Boolean)
    .join("\n")
}

export function PricingForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<PricingSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof PricingSectionProps>(
    key: K,
    next: PricingSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label"
        idPrefix="pricing-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Planes"
        placeholderEn="Plans"
      />

      <LocalizedField
        label="Title"
        idPrefix="pricing-title"
        value={local.title}
        onChange={(next) => set("title", next)}
        placeholderEs="Precios simples para cada equipo"
        placeholderEn="Simple pricing for every team"
      />

      <LocalizedField
        label="Description"
        idPrefix="pricing-description"
        multiline
        rows={2}
        value={local.description}
        onChange={(next) => set("description", next)}
      />

      <LocalizedField
        label="Bottom message"
        idPrefix="pricing-bottom-message"
        value={local.bottomMessage}
        onChange={(next) => set("bottomMessage", next)}
        placeholderEs="POS + Pay están incluidos en todos los planes."
        placeholderEn="POS + Pay are included in all plans."
      />

      <div className="space-y-2">
        <Label>Pricing cards</Label>
        <ItemsField<PricingCard>
          items={local.cards ?? []}
          onChange={(cards) => set("cards", cards)}
          createItem={() => ({
            title: { es: "Nuevo plan", en: "New plan" },
            price: "$0",
            shops: { es: "Hasta 1 local", en: "Up to 1 shop" },
            savings: "0%",
            features: [{ es: "Funcionalidad", en: "Feature one" }],
          })}
          addLabel="Add pricing card"
          itemLabel={(it, i) => translate(it.title) || `Card ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <LocalizedField
                label="Title"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Total Start"
                placeholderEn="Total Start"
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Price *</Label>
                  <Input
                    value={item.price}
                    onChange={(e) => update({ price: e.target.value })}
                    placeholder="$79"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Savings (%) *</Label>
                  <Input
                    value={item.savings}
                    onChange={(e) => update({ savings: e.target.value })}
                    placeholder="19%"
                  />
                </div>
              </div>

              <LocalizedField
                label="Cantidad de locales"
                required
                value={item.shops}
                onChange={(next) => update({ shops: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Hasta 1 local"
                placeholderEn="Up to 1 shop"
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">
                    Features ES (una por línea)
                  </Label>
                  <Textarea
                    rows={4}
                    value={featuresToText(item.features, "es")}
                    onChange={(e) => {
                      const lines = e.target.value
                        .split("\n")
                        .map((l) => l.trim())
                      update({
                        features: lines
                          .filter(Boolean)
                          .map((es, i) => ({
                            es,
                            en: item.features?.[i]?.en ?? es,
                          })),
                      })
                    }}
                    placeholder={"Club\nReviews\nPOS\nPay"}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    Features EN (one per line)
                  </Label>
                  <Textarea
                    rows={4}
                    value={featuresToText(item.features, "en")}
                    onChange={(e) => {
                      const lines = e.target.value
                        .split("\n")
                        .map((l) => l.trim())
                      update({
                        features: lines
                          .filter(Boolean)
                          .map((en, i) => ({
                            es: item.features?.[i]?.es ?? en,
                            en,
                          })),
                      })
                    }}
                    placeholder={"Club\nReviews\nPOS\nPay"}
                  />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Las listas se asocian línea por línea entre ES y EN. Si una
                tiene más líneas que la otra, las faltantes copian el otro
                idioma.
              </p>
            </div>
          )}
        />
      </div>
    </div>
  )
}
