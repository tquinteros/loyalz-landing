"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { HeroProductSectionProps } from "@/lib/types/Pages"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"

type Props = {
  value: HeroProductSectionProps
  onChange: (next: HeroProductSectionProps) => void
}

type Brand = NonNullable<HeroProductSectionProps["brands"]>[number]

export function HeroProductForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HeroProductSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HeroProductSectionProps>(
    key: K,
    next: HeroProductSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label"
        idPrefix="hero-product-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Producto"
        placeholderEn="Product"
      />

      <LocalizedField
        label="Título *"
        idPrefix="hero-product-title"
        value={local.title}
        onChange={(next) => set("title", next ?? { es: "", en: "" })}
        placeholderEs="El título del producto"
        placeholderEn="The product headline"
      />

      <HexColorField
        label="Color del título"
        value={local.titleColor ?? ""}
        onChange={(hex) => set("titleColor", hex)}
        placeholder="#8C7F1F"
      />

      <LocalizedField
        label="Descripción"
        idPrefix="hero-product-description"
        value={local.description}
        onChange={(next) => set("description", next)}
        placeholderEs="Descripción breve del producto"
        placeholderEn="Short product description"
        multiline
        rows={3}
      />

      <div className="space-y-1">
        <Label className="text-xs">Imagen del producto</Label>
        <ImagePicker
          value={local.image || null}
          onChange={(url) => set("image", url ?? "")}
        />
      </div>

      {/* Primary CTA */}
      <div className="space-y-2">
        <Label>CTA Principal</Label>
        <div className="grid gap-2">
          <LocalizedField
            label="Texto del botón *"
            idPrefix="hero-product-primary-cta-label"
            value={local.primaryCta?.label}
            onChange={(next) =>
              set("primaryCta", { ...local.primaryCta, label: next ?? { es: "", en: "" } })
            }
            placeholderEs="Empezar gratis"
            placeholderEn="Start for free"
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

      {/* Secondary CTA */}
      <div className="space-y-2">
        <Label>CTA Secundario</Label>
        <div className="grid gap-2">
          <LocalizedField
            label="Texto del botón"
            idPrefix="hero-product-secondary-cta-label"
            value={local.secondaryCta?.label}
            onChange={(next) =>
              set("secondaryCta", next
                ? { href: local.secondaryCta?.href ?? "/contact", label: next }
                : undefined)
            }
            placeholderEs="Agendar demo"
            placeholderEn="Book a demo"
          />
          <div className="space-y-1">
            <Label className="text-xs">URL</Label>
            <Input
              value={local.secondaryCta?.href ?? ""}
              onChange={(e) =>
                set("secondaryCta", {
                  label: local.secondaryCta?.label ?? { es: "", en: "" },
                  href: e.target.value,
                })
              }
              placeholder="/contact"
            />
          </div>
        </div>
      </div>

      {/* Brand marquee */}
      <div className="space-y-2">
        <LocalizedField
          label="Título de marcas (opcional)"
          idPrefix="hero-product-marquee-title"
          value={local.brandMarqueeTitle}
          onChange={(next) => set("brandMarqueeTitle", next)}
          placeholderEs="Marcas que confían en nosotros"
          placeholderEn="Brands that trust us"
        />
        <p className="text-xs text-muted-foreground">
          Las marcas se muestran en una cinta infinita debajo del héroe.
        </p>
        <ItemsField<Brand>
          items={local.brands ?? []}
          onChange={(brands) => set("brands", brands)}
          createItem={() => ({ name: "", logo: "" })}
          addLabel="Añadir marca"
          emptyLabel="Sin marcas."
          itemLabel={(it, i) => (it.name && it.name.trim()) || `Marca ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Nombre</Label>
                <Input
                  value={item.name ?? ""}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Acme"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Logo *</Label>
                <ImagePicker
                  value={item.logo || null}
                  onChange={(url) => update({ logo: url ?? "" })}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
