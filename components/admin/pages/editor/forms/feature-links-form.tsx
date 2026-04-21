"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ItemsField } from "../items-field"
import type { FeatureLinksSectionProps } from "@/lib/types/Pages"

type Props = {
  value: FeatureLinksSectionProps
  onChange: (next: FeatureLinksSectionProps) => void
}

type FeatureItem = FeatureLinksSectionProps["items"][number]

export function FeatureLinksForm({ value, onChange }: Props) {
  const set = <K extends keyof FeatureLinksSectionProps>(
    key: K,
    next: FeatureLinksSectionProps[K],
  ) => onChange({ ...value, [key]: next })

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fl-title">Título</Label>
        <Input
          id="fl-title"
          value={value.title ?? ""}
          onChange={(e) => set("title", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fl-subtitle">Subtítulo</Label>
        <Textarea
          id="fl-subtitle"
          rows={2}
          value={value.subtitle ?? ""}
          onChange={(e) => set("subtitle", e.target.value || undefined)}
        />
      </div>

      <div className="space-y-2">
        <Label>Items</Label>
        <ItemsField<FeatureItem>
          items={value.items ?? []}
          onChange={(items) => set("items", items)}
          createItem={() => ({
            icon: "sparkles",
            title: "Nueva feature",
            description: "",
            href: "",
          })}
          addLabel="Añadir feature"
          itemLabel={(it, i) => it.title || `Item ${i + 1}`}
          renderItem={(item, update) => (
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
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Título *</Label>
                <Input
                  value={item.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
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
    </div>
  )
}
