"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import type { ClubActivationSectionProps } from "@/lib/types/Pages"

type Props = {
  value: ClubActivationSectionProps
  onChange: (next: ClubActivationSectionProps) => void
}

type Card = ClubActivationSectionProps["activationCards"][number]

export function ClubActivationForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<ClubActivationSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof ClubActivationSectionProps>(
    key: K,
    next: ClubActivationSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="club-activation-title">Título *</Label>
        <Input
          id="club-activation-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Activaciones"
        />
      </div>

      <div className="space-y-2">
        <Label>Tarjetas de activación</Label>
        <ItemsField<Card>
          items={local.activationCards ?? []}
          onChange={(activationCards) => set("activationCards", activationCards)}
          createItem={() => ({
            image: "",
            stat: "+12%",
            title: "Título de la tarjeta",
            description: "",
          })}
          addLabel="Añadir tarjeta"
          itemLabel={(it, i) => it.title || `Tarjeta ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Imagen</Label>
                <ImagePicker
                  value={item.image || null}
                  onChange={(url) => update({ image: url ?? "" })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Stat *</Label>
                <Input
                  value={item.stat}
                  onChange={(e) => update({ stat: e.target.value })}
                  placeholder="+4x"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Título *</Label>
                <Input
                  value={item.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Descripción</Label>
                <Textarea
                  rows={2}
                  value={item.description ?? ""}
                  onChange={(e) =>
                    update({ description: e.target.value || undefined })
                  }
                />
              </div>
            </div>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="club-activation-bottom">Texto inferior *</Label>
        <Input
          id="club-activation-bottom"
          value={local.bottomLabel ?? ""}
          onChange={(e) => set("bottomLabel", e.target.value)}
          placeholder="Etiqueta bajo la grilla"
        />
      </div>
    </div>
  )
}
