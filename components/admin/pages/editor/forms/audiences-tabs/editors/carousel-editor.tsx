"use client"

import { Label } from "@/components/ui/label"
import type { AudienceTabItem } from "@/lib/types/Pages"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../../../items-field"

type ImageItem = { url: string }

function toImageItems(images: string[]): ImageItem[] {
  return (images ?? []).map((url) => ({ url }))
}
function fromImageItems(items: ImageItem[]): string[] {
  return items.map((it) => it.url)
}

type Props = {
  tab: AudienceTabItem
  onChange: (patch: Partial<AudienceTabItem>) => void
}

export function AudienceTabCarouselEditor({ tab, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Imágenes</Label>
        <ItemsField<ImageItem>
          items={toImageItems(tab.images)}
          onChange={(items) => onChange({ images: fromImageItems(items) })}
          createItem={() => ({ url: "" })}
          addLabel="Añadir imagen"
          emptyLabel="Sin imágenes."
          itemLabel={(_, i) => `Imagen ${i + 1}`}
          renderItem={(item, update) => (
            <ImagePicker
              value={item.url || null}
              onChange={(url) => update({ url: url ?? "" })}
            />
          )}
        />
      </div>
    </div>
  )
}
