"use client"

import { Label } from "@/components/ui/label"
import type { AudienceTabItem } from "@/lib/types/Pages"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../../../items-field"
import { LocalizedField } from "../../localized-field"

type Props = {
  tab: AudienceTabItem
  onChange: (patch: Partial<AudienceTabItem>) => void
}

export function AudienceTabMarqueeEditor({ tab, onChange }: Props) {
  return (
    <div className="space-y-5">
      <LocalizedField
        variant="comfortable"
        label="Título del marquee"
        idPrefix={`tab-${tab.key}-marquee-title`}
        value={tab.brandMarqueeTitle}
        onChange={(next) => onChange({ brandMarqueeTitle: next })}
        placeholderEs="Marcas que confían en nosotros"
        placeholderEn="Brands that trust us"
      />
      <div className="space-y-2">
        <Label className="text-sm font-medium">Marcas</Label>
        <ItemsField<{ name?: string; logo: string }>
          items={tab.brands ?? []}
          onChange={(brands) => onChange({ brands })}
          createItem={() => ({ name: "", logo: "" })}
          addLabel="Añadir marca"
          emptyLabel="Sin marcas."
          itemLabel={(it, i) => it.name || `Marca ${i + 1}`}
          renderItem={(item, update) => (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Nombre (alt)</Label>
                <input
                  className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={item.name ?? ""}
                  placeholder="Nombre de marca"
                  onChange={(e) => update({ name: e.target.value })}
                />
              </div>
              <ImagePicker
                value={item.logo || null}
                onChange={(url) => update({ logo: url ?? "" })}
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
