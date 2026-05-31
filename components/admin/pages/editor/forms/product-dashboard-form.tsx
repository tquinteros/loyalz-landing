"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LocalizedField } from "./localized-field"
import { ItemsField } from "../items-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"
import type {
  ProductDashboardSectionProps,
  ProductDashboardFeatureItem,
  LocalizedString,
} from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: ProductDashboardSectionProps
  onChange: (next: ProductDashboardSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function ProductDashboardForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ProductDashboardSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ProductDashboardSectionProps>(
    key: K,
    next: ProductDashboardSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label"
        idPrefix="product-dashboard-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Dashboard"
        placeholderEn="Dashboard"
      />

      <LocalizedField
        label="Título *"
        idPrefix="product-dashboard-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="La mejor forma de hacerlos volver"
        placeholderEn="The best way to bring them back"
        multiline
        rows={2}
      />

      <div className="space-y-1">
        <Label className="text-xs">Imagen del dashboard</Label>
        <ImagePicker
          value={local.image || null}
          onChange={(url) => set("image", url ?? "")}
        />
      </div>

      <LocalizedField
        label="Subtítulo"
        idPrefix="product-dashboard-subtitle"
        value={local.subtitle}
        onChange={(next) => set("subtitle", next)}
        placeholderEs="Controlá todo desde un solo dashboard."
        placeholderEn="Control everything from a single dashboard."
      />

      <HexColorField
        label="Color de acento (tarjetas)"
        value={local.color ?? ""}
        onChange={(hex) => set("color", hex)}
        placeholder="#754390"
      />
      <p className="text-xs text-muted-foreground -mt-2">
        Color del texto, borde e ícono de las feature cards.
      </p>

      {/* Features */}
      <div className="space-y-2">
        <Label>Features</Label>
        <p className="text-xs text-muted-foreground">
          Hasta 3 → grid. Más de 3 → carrusel infinito automático.
        </p>
        <ItemsField<ProductDashboardFeatureItem>
          items={local.features ?? []}
          onChange={(features) => set("features", features)}
          createItem={() => ({
            title: { es: "Título", en: "Title" },
            description: { es: "Descripción", en: "Description" },
          })}
          addLabel="Añadir feature"
          emptyLabel="Sin features."
          itemLabel={(it, i) => translate(it.title) || `Feature ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <LocalizedField
                label="Título *"
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Segmentación"
                placeholderEn="Segmentation"
              />
              <LocalizedField
                label="Descripción"
                multiline
                rows={2}
                value={item.description}
                onChange={(next) => update({ description: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Sabés quién vuelve y quién no."
                placeholderEn="Know who returns and who doesn't."
              />
            </div>
          )}
        />
      </div>

      {/* Primary CTA */}
      <div className="space-y-2 rounded-md border bg-muted/20 p-3">
        <Label>CTA Principal *</Label>
        <LocalizedField
          label="Texto"
          idPrefix="product-dashboard-primary-label"
          value={local.primaryCta?.label}
          onChange={(next) =>
            set("primaryCta", { ...local.primaryCta, label: next ?? EMPTY_LOCALIZED })
          }
          placeholderEs="Prueba Gratis"
          placeholderEn="Free Trial"
        />
        <div className="space-y-1">
          <Label className="text-xs">URL</Label>
          <Input
            value={local.primaryCta?.href ?? ""}
            onChange={(e) =>
              set("primaryCta", { ...local.primaryCta, href: e.target.value })
            }
            placeholder="/contact"
          />
        </div>
      </div>

      {/* Secondary CTA */}
      <div className="space-y-2 rounded-md border bg-muted/20 p-3">
        <Label>CTA Secundario</Label>
        <LocalizedField
          label="Texto"
          idPrefix="product-dashboard-secondary-label"
          value={local.secondaryCta?.label}
          onChange={(next) =>
            set(
              "secondaryCta",
              next
                ? { href: local.secondaryCta?.href ?? "/contact", label: next }
                : undefined,
            )
          }
          placeholderEs="Agendar Demo"
          placeholderEn="Book a Demo"
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
  )
}
