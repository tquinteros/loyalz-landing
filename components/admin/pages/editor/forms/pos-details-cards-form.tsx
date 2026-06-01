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
  LocalizedString,
  PosDetailsCardItem,
  PosDetailsCardsSectionProps,
} from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: PosDetailsCardsSectionProps
  onChange: (next: PosDetailsCardsSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function PosDetailsCardsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<PosDetailsCardsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof PosDetailsCardsSectionProps>(
    key: K,
    next: PosDetailsCardsSectionProps[K],
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
        placeholder="#F5B8A8"
      />

      <HexColorField
        label="Color de texto (header + fondo de tarjetas)"
        value={local.textColor ?? ""}
        onChange={(hex) => set("textColor", hex)}
        placeholder="#E85D33"
      />

      <LocalizedField
        label="Label"
        idPrefix="pos-details-cards-label"
        value={local.label}
        onChange={(next) => set("label", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Pay"
        placeholderEn="Pay"
      />

      <LocalizedField
        label="Título *"
        idPrefix="pos-details-cards-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={2}
      />

      <LocalizedField
        label="Descripción"
        idPrefix="pos-details-cards-description"
        value={local.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={2}
      />

      <div className="space-y-2">
        <Label>CTA Principal</Label>
        <div className="grid gap-2">
          <LocalizedField
            label="Texto del botón *"
            idPrefix="pos-details-cards-primary-cta-label"
            value={local.primaryCta?.label}
            onChange={(next) =>
              set("primaryCta", {
                ...local.primaryCta,
                label: next ?? EMPTY_LOCALIZED,
                href: local.primaryCta?.href ?? "/contact",
              })
            }
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
            idPrefix="pos-details-cards-secondary-cta-label"
            value={local.secondaryCta?.label}
            onChange={(next) =>
              set("secondaryCta", {
                label: next ?? EMPTY_LOCALIZED,
                href: local.secondaryCta?.href ?? "/contact",
              })
            }
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
        <Label>Tarjetas de detalle (imagen + texto)</Label>
        <ItemsField<PosDetailsCardItem>
          items={local.cards ?? []}
          onChange={(cards) => set("cards", cards)}
          createItem={() => ({
            image: "",
            title: { es: "Pagos Presenciales", en: "In-person payments" },
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
                <Label className="text-xs">Imagen *</Label>
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
