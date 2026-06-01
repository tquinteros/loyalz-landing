"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { LocalizedField } from "./localized-field"
import type {
  LocalizedString,
  ReviewsPricingSectionProps,
} from "@/lib/types/Pages"

type Props = {
  value: ReviewsPricingSectionProps
  onChange: (next: ReviewsPricingSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

function featuresToText(features: LocalizedString[] | undefined, locale: "es" | "en") {
  return (features ?? [])
    .map((f) => f[locale] ?? "")
    .filter(Boolean)
    .join("\n")
}

export function ReviewsPricingForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ReviewsPricingSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ReviewsPricingSectionProps>(
    key: K,
    next: ReviewsPricingSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  const setCard = (patch: Partial<ReviewsPricingSectionProps["card"]>) => {
    set("card", { ...local.card, ...patch })
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label"
        idPrefix="reviews-pricing-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Precios"
        placeholderEn="Pricing"
      />

      <LocalizedField
        label="Title"
        idPrefix="reviews-pricing-title"
        value={local.title}
        onChange={(next) => set("title", next)}
        placeholderEs="Los precios claros. Como todo en Loyalz."
        placeholderEn="Clear pricing. Just like everything at Loyalz."
      />

      <div className="space-y-1">
        <Label htmlFor="reviews-pricing-accent">Color de acento</Label>
        <Input
          id="reviews-pricing-accent"
          value={local.backgroundColor ?? local.accentColor ?? "#8C7F1F"}
          onChange={(e) => set("backgroundColor", e.target.value)}
          placeholder="#8C7F1F"
        />
        <p className="text-[11px] text-muted-foreground">
          Borde de tarjeta, pill, banner derecho e icono inferior. El fondo
          de la sección usa el color crema por defecto del sitio.
        </p>
      </div>

      <div className="space-y-2 rounded-lg border p-3">
        <Label>Pricing card</Label>

        <LocalizedField
          label="Title"
          required
          value={local.card?.title}
          onChange={(next) => setCard({ title: next ?? EMPTY_LOCALIZED })}
          placeholderEs="Reviews"
          placeholderEn="Reviews"
        />

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-xs">Price *</Label>
            <Input
              value={local.card?.price ?? ""}
              onChange={(e) => setCard({ price: e.target.value })}
              placeholder="$10"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Savings (%)</Label>
            <Input
              value={local.card?.savings ?? ""}
              onChange={(e) => setCard({ savings: e.target.value })}
              placeholder="0%"
            />
          </div>
        </div>

        <LocalizedField
          label="Cantidad de locales (pill)"
          required
          value={local.card?.shops}
          onChange={(next) => setCard({ shops: next ?? EMPTY_LOCALIZED })}
          placeholderEs="Precio por unidad de negocio"
          placeholderEn="Price per business unit"
        />

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-xs">Features ES (una por línea)</Label>
            <Textarea
              rows={4}
              value={featuresToText(local.card?.features, "es")}
              onChange={(e) => {
                const lines = e.target.value.split("\n").map((l) => l.trim())
                setCard({
                  features: lines
                    .filter(Boolean)
                    .map((es, i) => ({
                      es,
                      en: local.card?.features?.[i]?.en ?? es,
                    })),
                })
              }}
              placeholder={"Bifurcación Inteligente\nIntegración Google Reviews\nAI Insights"}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Features EN (one per line)</Label>
            <Textarea
              rows={4}
              value={featuresToText(local.card?.features, "en")}
              onChange={(e) => {
                const lines = e.target.value.split("\n").map((l) => l.trim())
                setCard({
                  features: lines
                    .filter(Boolean)
                    .map((en, i) => ({
                      es: local.card?.features?.[i]?.es ?? en,
                      en,
                    })),
                })
              }}
              placeholder={"Smart Routing\nGoogle Reviews integration\nAI Insights"}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label>Imagen (columna derecha)</Label>
        <ImagePicker
          value={local.image?.trim() ? local.image : null}
          onChange={(url) => set("image", url ?? "")}
        />
      </div>

      <LocalizedField
        label="Pricing label (banner bajo la imagen)"
        idPrefix="reviews-pricing-label-banner"
        multiline
        rows={2}
        value={local.pricingLabel}
        onChange={(next) => set("pricingLabel", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Se activa en minutos con resultados en la primera semana."
        placeholderEn="Live in minutes with results in the first week."
      />

      <LocalizedField
        label="Bottom message"
        idPrefix="reviews-pricing-bottom-message"
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
            idPrefix="reviews-pricing-primary-cta-label"
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
            idPrefix="reviews-pricing-secondary-cta-label"
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
    </div>
  )
}
