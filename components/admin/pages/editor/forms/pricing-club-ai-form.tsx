"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type {
  LocalizedString,
  PricingClubAiProduct,
  PricingClubAiSectionProps,
} from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: PricingClubAiSectionProps
  onChange: (next: PricingClubAiSectionProps) => void
}

type PricingCard = PricingClubAiSectionProps["cards"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

const PRODUCT_OPTIONS: Array<{ value: PricingClubAiProduct; label: string }> = [
  { value: "club", label: "Club" },
  { value: "ai", label: "AI" },
]

function featuresToText(features: LocalizedString[] | undefined, locale: "es" | "en") {
  return (features ?? [])
    .map((f) => f[locale] ?? "")
    .filter(Boolean)
    .join("\n")
}

export function PricingClubAiForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<PricingClubAiSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof PricingClubAiSectionProps>(
    key: K,
    next: PricingClubAiSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="pricing-club-ai-product">Producto</Label>
        <Select
          value={local.product ?? "club"}
          onValueChange={(v) => set("product", v as PricingClubAiProduct)}
        >
          <SelectTrigger id="pricing-club-ai-product" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Club aplica bordes y pills por tarjeta (Start sin borde, Growth
          #DBC5E8, Business #754390). AI usa tarjetas uniformes con sombra.
        </p>
      </div>

      <LocalizedField
        label="Label"
        idPrefix="pricing-club-ai-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Precios"
        placeholderEn="Pricing"
      />

      <LocalizedField
        label="Title"
        idPrefix="pricing-club-ai-title"
        value={local.title}
        onChange={(next) => set("title", next)}
        placeholderEs="Los precios claros. Como todo en Loyalz."
        placeholderEn="Clear pricing. Just like everything at Loyalz."
      />

      <LocalizedField
        label="Description"
        idPrefix="pricing-club-ai-description"
        multiline
        rows={2}
        value={local.description}
        onChange={(next) => set("description", next)}
      />

      <LocalizedField
        label="Bottom message"
        idPrefix="pricing-club-ai-bottom-message"
        value={local.bottomMessage}
        onChange={(next) => set("bottomMessage", next)}
        placeholderEs="POS + Pay incluidos gratis en todos los planes."
        placeholderEn="POS + Pay included free on all plans."
      />

      <div className="space-y-2">
        <Label>CTA Principal</Label>
        <div className="grid gap-2">
          <LocalizedField
            label="Texto del botón *"
            idPrefix="pricing-club-ai-primary-cta-label"
            value={local.primaryCta?.label}
            onChange={(next) =>
              set("primaryCta", {
                ...local.primaryCta,
                label: next ?? EMPTY_LOCALIZED,
                href: local.primaryCta?.href ?? "/contact",
              })
            }
            placeholderEs="Prueba Gratis"
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
            idPrefix="pricing-club-ai-secondary-cta-label"
            value={local.secondaryCta?.label}
            onChange={(next) =>
              set("secondaryCta", {
                label: next ?? EMPTY_LOCALIZED,
                href: local.secondaryCta?.href ?? "/contact",
              })
            }
            placeholderEs="Agendar Demo"
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
        <Label>Pricing cards</Label>
        <ItemsField<PricingCard>
          items={local.cards ?? []}
          onChange={(cards) => set("cards", cards)}
          createItem={() => ({
            title: { es: "Start", en: "Start" },
            price: "$39",
            shops: { es: "Hasta 1 local", en: "Up to 1 location" },
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
                placeholderEs="Start"
                placeholderEn="Start"
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Price *</Label>
                  <Input
                    value={item.price}
                    onChange={(e) => update({ price: e.target.value })}
                    placeholder="$39"
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
                label="Cantidad de locales (pill)"
                required
                value={item.shops}
                onChange={(next) => update({ shops: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Hasta 1 local"
                placeholderEn="Up to 1 location"
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
                    placeholder={"1 Mecánica Activa\n0 Managers"}
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
                    placeholder={"1 Active mechanic\n0 Managers"}
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
