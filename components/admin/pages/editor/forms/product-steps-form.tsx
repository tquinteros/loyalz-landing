"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import type { LocalizedString, ProductStepsSectionProps } from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"

type Props = {
  value: ProductStepsSectionProps
  onChange: (next: ProductStepsSectionProps) => void
}

type Step = ProductStepsSectionProps["steps"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function ProductStepsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ProductStepsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ProductStepsSectionProps>(
    key: K,
    next: ProductStepsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="product-steps-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Así lo vive tu cliente."
        placeholderEn="This is how your customer experiences it."
      />

      <div className="space-y-2">
        <Label>Pasos</Label>
        <p className="text-xs text-muted-foreground">
          Cada paso muestra su imagen al pasar el cursor. El color se usa en el
          hover del texto y el borde izquierdo.
        </p>
        <ItemsField<Step>
          items={local.steps ?? []}
          onChange={(steps) => set("steps", steps)}
          createItem={() => ({
            title: { es: "Paso", en: "Step" },
            description: { es: "", en: "" },
            image: "",
            backgroundColor: "#754390",
          })}
          addLabel="Añadir paso"
          emptyLabel="Sin pasos."
          itemLabel={(it, i) => translate(it.title) || `Paso ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <LocalizedField
                label="Título *"
                idPrefix={`product-steps-step-title-${item.backgroundColor}`}
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Escanea un QR."
                placeholderEn="Scan a QR code."
              />
              <LocalizedField
                label="Descripción"
                idPrefix={`product-steps-step-desc-${item.backgroundColor}`}
                value={item.description}
                onChange={(next) =>
                  update({ description: next ?? EMPTY_LOCALIZED })
                }
                placeholderEs="En la caja, en la mesa o en un flyer."
                placeholderEn="At the counter, at the table, or on a flyer."
                multiline
                rows={2}
              />
              <div className="space-y-1">
                <Label className="text-xs">Imagen</Label>
                <ImagePicker
                  value={item.image || null}
                  onChange={(url) => update({ image: url ?? "" })}
                />
              </div>
              <HexColorField
                label="Color hover (hex)"
                value={item.backgroundColor ?? ""}
                onChange={(hex) => update({ backgroundColor: hex })}
                placeholder="#754390"
              />
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>CTA Principal</Label>
        <div className="grid gap-2">
          <LocalizedField
            label="Texto del botón *"
            idPrefix="product-steps-primary-cta-label"
            value={local.primaryCta?.label}
            onChange={(next) =>
              set("primaryCta", {
                ...local.primaryCta,
                label: next ?? EMPTY_LOCALIZED,
              })
            }
            placeholderEs="Prueba GRATIS"
            placeholderEn="Try for FREE"
          />
          <div className="space-y-1">
            <Label className="text-xs">URL *</Label>
            <Input
              value={local.primaryCta?.href ?? ""}
              onChange={(e) =>
                set("primaryCta", { ...local.primaryCta, href: e.target.value })
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
            idPrefix="product-steps-secondary-cta-label"
            value={local.secondaryCta?.label}
            onChange={(next) =>
              set(
                "secondaryCta",
                next
                  ? {
                      href: local.secondaryCta?.href ?? "/contact",
                      label: next,
                    }
                  : undefined,
              )
            }
            placeholderEs="Agendar DEMO"
            placeholderEn="Book a DEMO"
          />
          <div className="space-y-1">
            <Label className="text-xs">URL</Label>
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
