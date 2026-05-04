"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import type { CommonCTASectionProps } from "@/lib/types/Pages"

type Props = {
  value: CommonCTASectionProps
  onChange: (next: CommonCTASectionProps) => void
}

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

      <div className="space-y-1.5">
        <Label htmlFor="common-cta-title">Título *</Label>
        <Input
          id="common-cta-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="common-cta-description">Descripción *</Label>
        <Textarea
          id="common-cta-description"
          rows={4}
          value={local.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="space-y-2 rounded-md border bg-muted/20 p-3">
        <Label>Primer CTA</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            placeholder="Texto"
            value={local.firstCta?.label ?? ""}
            onChange={(e) =>
              set("firstCta", {
                ...(local.firstCta ?? { label: "", href: "" }),
                label: e.target.value,
              })
            }
          />
          <Input
            placeholder="/ruta o URL"
            value={local.firstCta?.href ?? ""}
            onChange={(e) =>
              set("firstCta", {
                ...(local.firstCta ?? { label: "", href: "" }),
                href: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2 rounded-md border bg-muted/20 p-3">
        <Label>Segundo CTA</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            placeholder="Texto"
            value={local.secondCta?.label ?? ""}
            onChange={(e) =>
              set("secondCta", {
                ...(local.secondCta ?? { label: "", href: "" }),
                label: e.target.value,
              })
            }
          />
          <Input
            placeholder="/ruta o URL"
            value={local.secondCta?.href ?? ""}
            onChange={(e) =>
              set("secondCta", {
                ...(local.secondCta ?? { label: "", href: "" }),
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
