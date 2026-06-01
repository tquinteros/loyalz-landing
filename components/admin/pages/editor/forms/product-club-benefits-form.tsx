"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  LocalizedString,
  ProductClubBenefitsSectionProps,
} from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"

type Props = {
  value: ProductClubBenefitsSectionProps
  onChange: (next: ProductClubBenefitsSectionProps) => void
}

type BenefitItem = ProductClubBenefitsSectionProps["benefits"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function ProductClubBenefitsForm({
  value,
  onChange,
}: Props) {
  const [local, setLocal] = useState<ProductClubBenefitsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ProductClubBenefitsSectionProps>(
    key: K,
    next: ProductClubBenefitsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <HexColorField
        label="Color de fondo (hex)"
        value={local.backgroundColor ?? ""}
        onChange={(hex) => set("backgroundColor", hex)}
        placeholder="#754390"
      />

      <LocalizedField
        label="Título *"
        idPrefix="product-club-benefits-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Ellos reciben beneficios, vos los recibís de vuelta."
        placeholderEn="They get benefits, you get them back."
        multiline
        rows={2}
      />

      <div className="space-y-2">
        <Label>Beneficios</Label>
        <p className="text-xs text-muted-foreground">
          Cada tarjeta muestra un icono personalizable (SVG o PNG), título y
          descripción en el color de fondo de la sección.
        </p>
        <ItemsField<BenefitItem>
          items={local.benefits ?? []}
          onChange={(benefits) => set("benefits", benefits)}
          createItem={() => ({
            icon: "",
            title: { es: "Título del beneficio", en: "Benefit title" },
            description: {
              es: "Descripción del beneficio.",
              en: "Benefit description.",
            },
          })}
          addLabel="Añadir beneficio"
          emptyLabel="Sin beneficios."
          itemLabel={(it, i) => translate(it.title) || `Beneficio ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Icono</Label>
                <ImagePicker
                  aspect="square"
                  value={item.icon?.trim() ? item.icon : null}
                  onChange={(url) => update({ icon: url ?? "" })}
                />
                <p className="text-[11px] text-muted-foreground">
                  Sube o elige un SVG/PNG del diseño (biblioteca de medios).
                </p>
              </div>
              <LocalizedField
                label="Título *"
                idPrefix={`product-club-benefits-item-title-${translate(item.title)}`}
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Estampas"
                placeholderEn="Stamps"
              />
              <LocalizedField
                label="Descripción"
                idPrefix={`product-club-benefits-item-desc-${translate(item.title)}`}
                value={item.description}
                onChange={(next) =>
                  update({ description: next ?? EMPTY_LOCALIZED })
                }
                placeholderEs="Descripción del beneficio."
                placeholderEn="Benefit description."
                multiline
                rows={2}
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
            idPrefix="product-club-benefits-primary-cta-label"
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
            idPrefix="product-club-benefits-secondary-cta-label"
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
