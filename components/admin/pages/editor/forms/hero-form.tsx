"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { CTA, HeroSectionProps, LocalizedString } from "@/lib/types/Pages"

type Props = {
  value: HeroSectionProps
  onChange: (next: HeroSectionProps) => void
}

type ImageRow = { url: string }

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }
const EMPTY_CTA: CTA = { label: EMPTY_LOCALIZED, href: "" }

export function HeroForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HeroSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HeroSectionProps>(key: K, next: HeroSectionProps[K]) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  const imageRows: ImageRow[] = (local.images ?? []).map((url) => ({ url }))
  const setImagesFromRows = (rows: ImageRow[]) => {
    set(
      "images",
      rows.map((r) => r.url),
    )
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="hero-title"
        value={local.title}
        onChange={(next) => set("title", next ?? { es: "", en: "" })}
        placeholderEs="El sistema all-in-one para hacer crecer tu negocio."
        placeholderEn="The all-in-one system to grow your business."
      />

      <div className="space-y-2">
        <Label>Imágenes del carrusel</Label>
        <p className="text-xs text-muted-foreground">
          Se muestran cinco a la vez; la del centro se destaca. Podés agregar más de cinco y rotar con las flechas en la página.
        </p>
        <ItemsField<ImageRow>
          items={imageRows}
          onChange={setImagesFromRows}
          createItem={() => ({ url: "" })}
          addLabel="Añadir imagen"
          emptyLabel="Sin imágenes. Añadí al menos una imagen desde la biblioteca."
          itemLabel={(_, i) => `Imagen ${i + 1}`}
          renderItem={(item, update) => (
            <ImagePicker
              value={item.url || null}
              onChange={(url) => update({ url: url ?? "" })}
            />
          )}
        />
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          CTA principal
        </Label>
        <LocalizedField
          label="Texto del botón *"
          idPrefix="hero-cta-label"
          value={local.ctaLabel}
          onChange={(next) => set("ctaLabel", next ?? EMPTY_LOCALIZED)}
          placeholderEs="Demo Gratis"
          placeholderEn="Free Demo"
        />
        <div className="space-y-1">
          <Label className="text-xs" htmlFor="hero-cta-href">
            URL *
          </Label>
          <Input
            id="hero-cta-href"
            value={local.ctaHref ?? ""}
            onChange={(e) => set("ctaHref", e.target.value)}
            placeholder="/contacto"
          />
        </div>
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          CTA secundario
        </Label>
        <LocalizedField
          label="Texto del botón"
          idPrefix="hero-secondary-cta-label"
          value={local.secondaryCta?.label ?? EMPTY_LOCALIZED}
          onChange={(next) =>
            set("secondaryCta", {
              ...(local.secondaryCta ?? EMPTY_CTA),
              label: next ?? EMPTY_LOCALIZED,
            })
          }
          placeholderEs="Agendar Demo"
          placeholderEn="Book a Demo"
        />
        <div className="space-y-1">
          <Label className="text-xs" htmlFor="hero-secondary-cta-href">
            URL
          </Label>
          <Input
            id="hero-secondary-cta-href"
            value={local.secondaryCta?.href ?? ""}
            onChange={(e) =>
              set("secondaryCta", {
                ...(local.secondaryCta ?? EMPTY_CTA),
                href: e.target.value,
              })
            }
            placeholder="/contacto"
          />
        </div>
      </div>
    </div>
  )
}
