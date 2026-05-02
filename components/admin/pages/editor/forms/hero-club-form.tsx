"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import type { HeroClubSectionProps } from "@/lib/types/Pages"

type Props = {
  value: HeroClubSectionProps
  onChange: (next: HeroClubSectionProps) => void
}

export function HeroClubForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HeroClubSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HeroClubSectionProps>(
    key: K,
    next: HeroClubSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="hero-club-title">Título *</Label>
        <Input
          id="hero-club-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Convierte a cada cliente…"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hero-club-subtitle">Subtítulo</Label>
        <Textarea
          id="hero-club-subtitle"
          rows={3}
          value={local.subtitle ?? ""}
          onChange={(e) => set("subtitle", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Imagen</Label>
        <ImagePicker
          value={local.image || null}
          onChange={(url) => set("image", url ?? "")}
        />
      </div>

      <div className="space-y-1.5">
        <Label>CTA principal</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            placeholder="Texto del botón"
            value={local.primaryCta?.label ?? ""}
            onChange={(e) =>
              set("primaryCta", {
                ...(local.primaryCta ?? { label: "", href: "" }),
                label: e.target.value,
              })
            }
          />
          <Input
            placeholder="/ruta"
            value={local.primaryCta?.href ?? ""}
            onChange={(e) =>
              set("primaryCta", {
                ...(local.primaryCta ?? { label: "", href: "" }),
                href: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
