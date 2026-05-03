"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import type { StepsClubSectionProps } from "@/lib/types/Pages"

type Props = {
  value: StepsClubSectionProps
  onChange: (next: StepsClubSectionProps) => void
}

type Step = StepsClubSectionProps["steps"][number]

export function StepsClubForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<StepsClubSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof StepsClubSectionProps>(
    key: K,
    next: StepsClubSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="steps-club-title">Título *</Label>
        <Input
          id="steps-club-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Cómo funciona"
        />
      </div>

      <div className="space-y-2">
        <Label>Pasos</Label>
        <ItemsField<Step>
          items={local.steps ?? []}
          onChange={(steps) => set("steps", steps)}
          createItem={() => ({
            title: "Nuevo paso",
            description: "",
            image: "",
          })}
          addLabel="Añadir paso"
          itemLabel={(it, i) => it.title || `Paso ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Título *</Label>
                <Input
                  value={item.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Título del paso"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Descripción *</Label>
                <Textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="Texto del paso"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Imagen</Label>
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
