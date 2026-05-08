"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { LocalizedField } from "./localized-field"
import type { CommonCTASectionProps, LocalizedString } from "@/lib/types/Pages"

type Props = {
  value: CommonCTASectionProps
  onChange: (next: CommonCTASectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function CommonCtaForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<CommonCTASectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof CommonCTASectionProps>(
    key: K,
    next: CommonCTASectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="common-cta-bg">Color de fondo (CSS)</Label>
        <Input
          id="common-cta-bg"
          value={local.backgroundColor ?? ""}
          onChange={(e) => set("backgroundColor", e.target.value)}
          placeholder="#754390"
        />
        <p className="text-xs text-muted-foreground">
          Hex color. Se ignora si la sección usa imagen de fondo
          (avanzado).
        </p>
      </div>

      <LocalizedField
        label="Título *"
        idPrefix="common-cta-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
      />

      <LocalizedField
        label="Descripción *"
        idPrefix="common-cta-description"
        multiline
        rows={4}
        value={local.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
      />

      <div className="space-y-2 rounded-md border bg-muted/20 p-3">
        <Label>Primer CTA</Label>
        <LocalizedField
          label="Texto"
          value={local.firstCta?.label}
          onChange={(next) =>
            set("firstCta", {
              ...(local.firstCta ?? { label: EMPTY_LOCALIZED, href: "" }),
              label: next ?? EMPTY_LOCALIZED,
            })
          }
        />
        <div className="space-y-1">
          <Label className="text-xs">Enlace</Label>
          <Input
            placeholder="/ruta o URL"
            value={local.firstCta?.href ?? ""}
            onChange={(e) =>
              set("firstCta", {
                ...(local.firstCta ?? { label: EMPTY_LOCALIZED, href: "" }),
                href: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2 rounded-md border bg-muted/20 p-3">
        <Label>Segundo CTA</Label>
        <LocalizedField
          label="Texto"
          value={local.secondCta?.label}
          onChange={(next) =>
            set("secondCta", {
              ...(local.secondCta ?? { label: EMPTY_LOCALIZED, href: "" }),
              label: next ?? EMPTY_LOCALIZED,
            })
          }
        />
        <div className="space-y-1">
          <Label className="text-xs">Enlace</Label>
          <Input
            placeholder="/ruta o URL"
            value={local.secondCta?.href ?? ""}
            onChange={(e) =>
              set("secondCta", {
                ...(local.secondCta ?? { label: EMPTY_LOCALIZED, href: "" }),
                href: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Imagen</Label>
        <ImagePicker
          value={local.image || null}
          onChange={(url) => set("image", url ?? "")}
        />
      </div>
    </div>
  )
}
