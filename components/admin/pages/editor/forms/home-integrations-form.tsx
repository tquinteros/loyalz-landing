"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import type { HomeIntegrationsSectionProps, LocalizedString } from "@/lib/types/Pages"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { t as translate } from "@/lib/utils"

type Props = {
  value: HomeIntegrationsSectionProps
  onChange: (next: HomeIntegrationsSectionProps) => void
}

type FeatureItem = HomeIntegrationsSectionProps["features"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function HomeIntegrationsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HomeIntegrationsSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HomeIntegrationsSectionProps>(
    key: K,
    next: HomeIntegrationsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Label"
        idPrefix="home-integrations-label"
        value={local.label}
        onChange={(next) => set("label", next)}
        placeholderEs="Integración Loyalz"
        placeholderEn="Loyalz integration"
      />

      <LocalizedField
        label="Título *"
        idPrefix="home-integrations-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Un sistema conectado en un único lugar"
        placeholderEn="One connected system in a single place"
        multiline
        rows={2}
      />

      <LocalizedField
        label="Descripción"
        idPrefix="home-integrations-description"
        value={local.description}
        onChange={(next) => set("description", next)}
        placeholderEs="El POS es gratis. Pero es la base que hace que todo lo demás funcione mejor."
        placeholderEn="The POS is free. But it's the foundation that makes everything else work better."
        multiline
        rows={2}
      />

      <div className="space-y-1">
        <Label>Imagen principal</Label>
        <ImagePicker
          value={local.image || null}
          onChange={(url) => set("image", url ?? "")}
        />
      </div>

      <LocalizedField
        label="Título de features *"
        idPrefix="home-integrations-info-features"
        value={local.infoFeatures}
        onChange={(next) => set("infoFeatures", next ?? EMPTY_LOCALIZED)}
        placeholderEs="¿Cómo funcionan en conjunto?"
        placeholderEn="How do they work together?"
      />

      <div className="space-y-2">
        <Label>Features</Label>
        <p className="text-xs text-muted-foreground">
          Se muestran en una grilla de 4 columnas en desktop. Cada tarjeta usa el logo de Loyalz
          sobre el color de fondo elegido.
        </p>
        <ItemsField<FeatureItem>
          items={local.features ?? []}
          onChange={(features) => set("features", features)}
          createItem={() => ({
            title: { es: "+ Feature", en: "+ Feature" },
            backgroundColor: "#754390",
            description: { es: "", en: "" },
          })}
          addLabel="Añadir feature"
          emptyLabel="Sin features. Añadí al menos una."
          itemLabel={(it, i) => translate(it.title) || `Feature ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <LocalizedField
                label="Título *"
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="+ Club"
                placeholderEn="+ Club"
              />

              <div className="space-y-1">
                <Label className="text-xs">Color de fondo (hex) *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={item.backgroundColor || "#754390"}
                    onChange={(e) => update({ backgroundColor: e.target.value })}
                    className="h-9 w-14 p-1"
                  />
                  <Input
                    value={item.backgroundColor}
                    onChange={(e) => update({ backgroundColor: e.target.value })}
                    placeholder="#754390"
                  />
                </div>
              </div>

              <LocalizedField
                label="Descripción *"
                value={item.description}
                onChange={(next) => update({ description: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Los puntos se acumulan automáticamente al cobrar."
                placeholderEn="Points accumulate automatically when you charge."
                multiline
                rows={3}
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
