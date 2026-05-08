"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type {
  HomeActivationSectionProps,
  LocalizedString,
} from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: HomeActivationSectionProps
  onChange: (next: HomeActivationSectionProps) => void
}

type Card = HomeActivationSectionProps["activationCards"][number]
type Brand = HomeActivationSectionProps["brands"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

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
      <LocalizedField
        label="Título *"
        idPrefix="home-activation-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Activaciones Home"
        placeholderEn="Home Activations"
      />

      <div className="space-y-2">
        <Label>Tarjetas de activación</Label>
        <ItemsField<Card>
          items={local.activationCards ?? []}
          onChange={(activationCards) => set("activationCards", activationCards)}
          createItem={() => ({
            image: "",
            stat: "+12%",
            title: { es: "Título de la tarjeta", en: "Card title" },
            description: { es: "", en: "" },
          })}
          addLabel="Añadir tarjeta"
          itemLabel={(it, i) => translate(it.title) || `Tarjeta ${i + 1}`}
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
              <LocalizedField
                label="Título"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
              />
              <LocalizedField
                label="Descripción"
                multiline
                rows={2}
                value={item.description}
                onChange={(next) => update({ description: next })}
              />
            </div>
          )}
        />
      </div>

      <LocalizedField
        label="Texto inferior *"
        idPrefix="home-activation-bottom"
        value={local.bottomLabel}
        onChange={(next) => set("bottomLabel", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Etiqueta bajo la grilla"
        placeholderEn="Label below the grid"
      />

      <div className="space-y-2">
        <Label>Marcas (marquee)</Label>
        <ItemsField<Brand>
          items={local.brands ?? []}
          onChange={(brands) => set("brands", brands)}
          createItem={() => ({
            name: "Nueva marca",
            logo: "",
          })}
          addLabel="Añadir marca"
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
