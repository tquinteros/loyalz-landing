"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import type { HomeActivationSectionProps } from "@/lib/types/Pages"

type Props = {
  value: HomeActivationSectionProps
  onChange: (next: HomeActivationSectionProps) => void
}

type Card = HomeActivationSectionProps["activationCards"][number]
type Brand = HomeActivationSectionProps["brands"][number]

export function HomeActivationForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<HomeActivationSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof HomeActivationSectionProps>(
    key: K,
    next: HomeActivationSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="home-activation-title">Titulo *</Label>
        <Input
          id="home-activation-title"
          value={local.title ?? ""}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Activaciones Home"
        />
      </div>

      <div className="space-y-2">
        <Label>Tarjetas de activacion</Label>
        <ItemsField<Card>
          items={local.activationCards ?? []}
          onChange={(activationCards) => set("activationCards", activationCards)}
          createItem={() => ({
            image: "",
            stat: "+12%",
            title: "Titulo de la tarjeta",
            description: "",
          })}
          addLabel="Anadir tarjeta"
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
                <Label className="text-xs">Titulo *</Label>
                <Input
                  value={item.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Descripcion</Label>
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
        <Label htmlFor="home-activation-bottom">Texto inferior *</Label>
        <Input
          id="home-activation-bottom"
          value={local.bottomLabel ?? ""}
          onChange={(e) => set("bottomLabel", e.target.value)}
          placeholder="Etiqueta bajo la grilla"
        />
      </div>

      <div className="space-y-2">
        <Label>Marcas (marquee)</Label>
        <ItemsField<Brand>
          items={local.brands ?? []}
          onChange={(brands) => set("brands", brands)}
          createItem={() => ({
            name: "Nueva marca",
            logo: "",
          })}
          addLabel="Anadir marca"
          itemLabel={(it, i) => it.name || `Marca ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Nombre *</Label>
                <Input
                  value={item.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Nombre de la marca"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Logo *</Label>
                <ImagePicker
                  value={item.logo || null}
                  onChange={(url) => update({ logo: url ?? "" })}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
