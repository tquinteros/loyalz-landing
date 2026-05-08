"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import type { FeatureLinksSectionProps, LocalizedString } from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: FeatureLinksSectionProps
  onChange: (next: FeatureLinksSectionProps) => void
}

type FeatureItem = FeatureLinksSectionProps["items"][number]

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export function FeatureLinksForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<FeatureLinksSectionProps>(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof FeatureLinksSectionProps>(
    key: K,
    next: FeatureLinksSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  return (
    <div className="space-y-4">
      <LocalizedField
        label="Título"
        idPrefix="fl-title"
        value={local.title}
        onChange={(next) => set("title", next)}
      />

      <LocalizedField
        label="Subtítulo"
        idPrefix="fl-subtitle"
        multiline
        rows={2}
        value={local.subtitle}
        onChange={(next) => set("subtitle", next)}
      />

      <div className="space-y-2">
        <Label>Items</Label>
        <ItemsField<FeatureItem>
          items={local.items ?? []}
          onChange={(items) => set("items", items)}
          createItem={() => ({
            icon: "sparkles",
            title: { es: "Nueva feature", en: "New feature" },
            description: { es: "", en: "" },
            href: "",
          })}
          addLabel="Añadir feature"
          itemLabel={(it, i) => translate(it.title) || `Item ${i + 1}`}
          renderItem={(item, update) => (
            <div className="grid gap-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Icono</Label>
                  <Input
                    value={item.icon ?? ""}
                    onChange={(e) => update({ icon: e.target.value || undefined })}
                    placeholder="users, gift, mail, bar-chart…"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Enlace</Label>
                  <Input
                    value={item.href ?? ""}
                    onChange={(e) => update({ href: e.target.value || undefined })}
                    placeholder="/features/…"
                  />
                </div>
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
    </div>
  )
}
