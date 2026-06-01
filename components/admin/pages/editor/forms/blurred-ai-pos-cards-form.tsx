"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"
import type {
  BlurredAiPosCardItem,
  BlurredAiPosCardsSectionProps,
  LocalizedString,
} from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: BlurredAiPosCardsSectionProps
  onChange: (next: BlurredAiPosCardsSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function BlurredAiPosCardsForm({
  value,
  onChange,
}: Props) {
  const [local, setLocal] = useState<BlurredAiPosCardsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof BlurredAiPosCardsSectionProps>(
    key: K,
    next: BlurredAiPosCardsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <HexColorField
        label="Color de fondo de la sección"
        value={local.backgroundColor ?? ""}
        onChange={(hex) => set("backgroundColor", hex)}
        placeholder="#B2C8D9"
      />

      <HexColorField
        label="Color de texto (label, título, borde CTA secundario)"
        value={local.textColor ?? ""}
        onChange={(hex) => set("textColor", hex)}
        placeholder="#013662"
      />

      <LocalizedField
        label="Label"
        idPrefix="blurred-ai-pos-cards-label"
        value={local.label}
        onChange={(next) => set("label", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Negocios"
        placeholderEn="Businesses"
      />

      <LocalizedField
        label="Título *"
        idPrefix="blurred-ai-pos-cards-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={2}
        placeholderEs="Una AI que se adapta a tu negocio, no al revés."
        placeholderEn="AI that adapts to your business, not the other way around."
      />

      <div className="space-y-2">
        <Label>CTA Principal</Label>
        <div className="grid gap-2">
          <LocalizedField
            label="Texto del botón *"
            idPrefix="blurred-ai-pos-cards-primary-cta-label"
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
            idPrefix="blurred-ai-pos-cards-secondary-cta-label"
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
        <Label>Tarjetas</Label>
        <ItemsField<BlurredAiPosCardItem>
          items={local.cards ?? []}
          onChange={(cards) => set("cards", cards)}
          createItem={() => ({
            image: "",
            title: { es: "Restaurantes", en: "Restaurants" },
            description: {
              es: "Descripción de la tarjeta.",
              en: "Card description.",
            },
          })}
          addLabel="Añadir tarjeta"
          itemLabel={(it, i) => translate(it.title) || `Tarjeta ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Imagen de fondo *</Label>
                <ImagePicker
                  value={item.image?.trim() ? item.image : null}
                  onChange={(url) => update({ image: url ?? "" })}
                />
              </div>

              <LocalizedField
                label="Título"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
              />

              <LocalizedField
                label="Descripción"
                multiline
                rows={2}
                value={item.description}
                onChange={(next) => update({ description: next ?? EMPTY_LOCALIZED })}
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
