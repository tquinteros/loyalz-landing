"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { LocalizedField } from "./localized-field"
import { ItemsField } from "../items-field"
import { HexColorField } from "./audiences-tabs/hex-color-field"
import type {
  ProductHowItWorksSectionProps,
  ProductHowItWorksStatItem,
  LocalizedString,
} from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: ProductHowItWorksSectionProps
  onChange: (next: ProductHowItWorksSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function ProductHowItWorksForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ProductHowItWorksSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ProductHowItWorksSectionProps>(
    key: K,
    next: ProductHowItWorksSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título *"
        idPrefix="how-it-works-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="¿Cómo funciona? Así de simple."
        placeholderEn="How does it work? This simple."
        multiline
        rows={2}
      />

      <HexColorField
        label="Color de fondo"
        value={local.backgroundColor ?? ""}
        onChange={(hex) => set("backgroundColor", hex || undefined)}
        placeholder="#F8F5EF"
      />

      {/* Images — up to 3 */}
      <div className="space-y-2">
        <Label>Imágenes (máx. 3)</Label>
        <p className="text-xs text-muted-foreground">
          Se muestran en un abanico con rotación. La imagen del centro es la principal.
        </p>
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="space-y-1">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Imagen {idx + 1}{idx === 1 ? " (centro)" : ""}
            </Label>
            <ImagePicker
              value={local.images?.[idx] || null}
              onChange={(url) => {
                const next = [...(local.images ?? ["", "", ""])]
                next[idx] = url ?? ""
                set("images", next)
              }}
            />
          </div>
        ))}
      </div>

      {/* Stats — up to 4 badges */}
      <div className="space-y-2">
        <Label>Estadísticas flotantes (máx. 4)</Label>
        <p className="text-xs text-muted-foreground">
          Se muestran como tarjetas flotantes sobre el abanico de imágenes.
        </p>
        <ItemsField<ProductHowItWorksStatItem>
          items={(local.stats ?? []).slice(0, 4)}
          onChange={(stats) => set("stats", stats.slice(0, 4))}
          createItem={() => ({ stat: "+0", title: EMPTY_LOCALIZED })}
          addLabel="Añadir estadística"
          emptyLabel="Sin estadísticas."
          itemLabel={(it, i) => it.stat || translate(it.title) || `Stat ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Valor (stat) *</Label>
                <Input
                  value={item.stat ?? ""}
                  onChange={(e) => update({ stat: e.target.value })}
                  placeholder="+15"
                />
              </div>
              <LocalizedField
                label="Etiqueta"
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Reseñas nuevas"
                placeholderEn="New reviews"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
