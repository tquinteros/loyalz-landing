"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CTA, HomeBusinessSectionProps, LocalizedString } from "@/lib/types/Pages"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { t as translate } from "@/lib/utils"

type Props = {
  value: HomeBusinessSectionProps
  onChange: (next: HomeBusinessSectionProps) => void
}

type BusinessCard = HomeBusinessSectionProps["businessCards"][number]
type Stat = HomeBusinessSectionProps["stats"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }
const EMPTY_CTA: CTA = { label: EMPTY_LOCALIZED, href: "" }

export function HomeBusinessForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HomeBusinessSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HomeBusinessSectionProps>(
    key: K,
    next: HomeBusinessSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-6">
      {/* Header fields */}
      <LocalizedField
        label="Label"
        idPrefix="home-business-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Negocios"
        placeholderEn="Business"
      />

      <LocalizedField
        label="Título *"
        idPrefix="home-business-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="No importa el tamaño de tu negocio"
        placeholderEn="No matter the size of your business"
      />

      <LocalizedField
        label="Descripción"
        idPrefix="home-business-description"
        multiline
        rows={3}
        value={local.description}
        onChange={(next) => set("description", next)}
        placeholderEs="Llevá tu negocio al siguiente nivel."
        placeholderEn="Take your business to the next level."
      />

      {/* Primary CTA */}
      <div className="space-y-2 rounded-md border p-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">CTA Principal</Label>
        <LocalizedField
          label="Texto del botón *"
          idPrefix="home-business-primary-cta-label"
          value={local.primaryCta?.label ?? EMPTY_LOCALIZED}
          onChange={(next) =>
            set("primaryCta", { ...(local.primaryCta ?? EMPTY_CTA), label: next ?? EMPTY_LOCALIZED })
          }
          placeholderEs="Prueba Gratis"
          placeholderEn="Free Trial"
        />
        <div className="space-y-1">
          <Label className="text-xs">URL *</Label>
          <Input
            value={local.primaryCta?.href ?? ""}
            onChange={(e) =>
              set("primaryCta", { ...(local.primaryCta ?? EMPTY_CTA), href: e.target.value })
            }
            placeholder="/contact"
          />
        </div>
      </div>

      {/* Secondary CTA */}
      <div className="space-y-2 rounded-md border p-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">CTA Secundario</Label>
        <LocalizedField
          label="Texto del botón *"
          idPrefix="home-business-secondary-cta-label"
          value={local.secondaryCta?.label ?? EMPTY_LOCALIZED}
          onChange={(next) =>
            set("secondaryCta", { ...(local.secondaryCta ?? EMPTY_CTA), label: next ?? EMPTY_LOCALIZED })
          }
          placeholderEs="Agendar Demo"
          placeholderEn="Book a Demo"
        />
        <div className="space-y-1">
          <Label className="text-xs">URL *</Label>
          <Input
            value={local.secondaryCta?.href ?? ""}
            onChange={(e) =>
              set("secondaryCta", { ...(local.secondaryCta ?? EMPTY_CTA), href: e.target.value })
            }
            placeholder="/contact"
          />
        </div>
      </div>

      {/* Business cards */}
      <div className="space-y-2">
        <Label>Tarjetas de negocio</Label>
        <ItemsField<BusinessCard>
          items={local.businessCards ?? []}
          onChange={(cards) => set("businessCards", cards)}
          createItem={() => ({
            image: "",
            title: { es: "Nuevo tipo de negocio", en: "New business type" },
            description: { es: "Descripción del negocio.", en: "Business description." },
          })}
          addLabel="Añadir tarjeta"
          itemLabel={(it, i) => translate(it.title) || `Tarjeta ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <LocalizedField
                label="Título *"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Gastronómicos"
                placeholderEn="Restaurants"
              />

              <LocalizedField
                label="Descripción *"
                required
                multiline
                rows={2}
                value={item.description}
                onChange={(next) => update({ description: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Fidelizá a tus comensales."
                placeholderEn="Retain your diners."
              />

              <div className="space-y-1">
                <Label className="text-xs">Imagen *</Label>
                <ImagePicker
                  value={item.image || null}
                  onChange={(url) => update({ image: url ?? "" })}
                />
              </div>
            </div>
          )}
        />
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <Label>Stats</Label>
        <ItemsField<Stat>
          items={local.stats ?? []}
          onChange={(stats) => set("stats", stats)}
          createItem={() => ({
            image: "",
            title: { es: "Nueva stat", en: "New stat" },
            stat: "+0%",
            backgroundColorCard: "#754390",
          })}
          addLabel="Añadir stat"
          itemLabel={(it, i) => it.stat || `Stat ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Valor de la stat *</Label>
                <Input
                  value={item.stat}
                  onChange={(e) => update({ stat: e.target.value })}
                  placeholder="+30%"
                />
              </div>

              <LocalizedField
                label="Título *"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Más visitas por cliente"
                placeholderEn="More visits per customer"
              />

              <div className="space-y-1">
                <Label className="text-xs">Color de fondo (hex) *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={item.backgroundColorCard || "#754390"}
                    onChange={(e) => update({ backgroundColorCard: e.target.value })}
                    className="h-9 w-14 p-1"
                  />
                  <Input
                    value={item.backgroundColorCard}
                    onChange={(e) => update({ backgroundColorCard: e.target.value })}
                    placeholder="#754390"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Imagen (ícono)</Label>
                <ImagePicker
                  value={item.image || null}
                  onChange={(url) => update({ image: url ?? "" })}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
