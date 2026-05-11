"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  HomeSolutionsSectionProps,
  LocalizedString,
} from "@/lib/types/Pages"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { t as translate } from "@/lib/utils"

type Props = {
  value: HomeSolutionsSectionProps
  onChange: (next: HomeSolutionsSectionProps) => void
}

type ImageTile = HomeSolutionsSectionProps["images"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function HomeSolutionsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HomeSolutionsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HomeSolutionsSectionProps>(
    key: K,
    next: HomeSolutionsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label"
        idPrefix="home-solutions-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Soluciones"
        placeholderEn="Solutions"
      />

      <LocalizedField
        label="Título *"
        idPrefix="home-solutions-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="¿Cómo funcionan nuestras soluciones?"
        placeholderEn="How do our solutions work?"
      />

      <div className="space-y-2">
        <Label>Imágenes</Label>
        <p className="text-xs text-muted-foreground">
          Se muestran 3 por fila. Cada imagen puede tener una leyenda
          superpuesta que se traduce.
        </p>
        <ItemsField<ImageTile>
          items={local.images ?? []}
          onChange={(images) => set("images", images)}
          createItem={() => ({
            url: "",
            caption: { es: "", en: "" },
          })}
          addLabel="Añadir imagen"
          emptyLabel="Sin imágenes. Añadí al menos una desde la biblioteca."
          itemLabel={(it, i) => translate(it.caption) || `Imagen ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Imagen *</Label>
                <ImagePicker
                  value={item.url || null}
                  onChange={(url) => update({ url: url ?? "" })}
                />
              </div>
              <LocalizedField
                label="Leyenda"
                value={item.caption}
                onChange={(next) => update({ caption: next })}
                placeholderEs="Tan solo escaneando el QR"
                placeholderEn="Just by scanning the QR"
              />
            </div>
          )}
        />
      </div>

      <div className="space-y-2 rounded-md border bg-muted/20 p-3">
        <Label>CTA principal</Label>
        <LocalizedField
          label="Texto *"
          idPrefix="home-solutions-primary-cta-label"
          value={local.primaryCtaLabel}
          onChange={(next) =>
            set("primaryCtaLabel", next ?? EMPTY_LOCALIZED)
          }
          placeholderEs="Prueba GRATIS"
          placeholderEn="Try for FREE"
        />
        <div className="space-y-1">
          <Label htmlFor="home-solutions-primary-cta-href" className="text-xs">
            Enlace *
          </Label>
          <Input
            id="home-solutions-primary-cta-href"
            value={local.primaryCtaHref ?? ""}
            onChange={(e) => set("primaryCtaHref", e.target.value)}
            placeholder="/contact"
          />
        </div>
      </div>

      <div className="space-y-2 rounded-md border bg-muted/20 p-3">
        <Label>CTA secundario</Label>
        <LocalizedField
          label="Texto"
          idPrefix="home-solutions-secondary-cta-label"
          value={local.secondaryCtaLabel}
          onChange={(next) =>
            set("secondaryCtaLabel", next ?? EMPTY_LOCALIZED)
          }
          placeholderEs="Agendar DEMO"
          placeholderEn="Book a DEMO"
        />
        <div className="space-y-1">
          <Label
            htmlFor="home-solutions-secondary-cta-href"
            className="text-xs"
          >
            Enlace
          </Label>
          <Input
            id="home-solutions-secondary-cta-href"
            value={local.secondaryCtaHref ?? ""}
            onChange={(e) => set("secondaryCtaHref", e.target.value)}
            placeholder="/contact"
          />
        </div>
      </div>
    </div>
  )
}
