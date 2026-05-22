"use client"

import { Label } from "@/components/ui/label"
import type {
  AudienceStepItem,
  AudienceStepsProps,
  AudienceTabItem,
} from "@/lib/types/Pages"
import { EMPTY_LOCALIZED } from "@/lib/audiences/tab-blocks"
import { t as translate } from "@/lib/utils"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { ItemsField } from "../../../items-field"
import { LocalizedField } from "../../localized-field"
import { HexColorField } from "../hex-color-field"

type Props = {
  tab: AudienceTabItem
  onChange: (patch: Partial<AudienceTabItem>) => void
}

export function AudienceTabStepsEditor({ tab, onChange }: Props) {
  const value = tab.audienceSteps!

  const set = <K extends keyof AudienceStepsProps>(
    key: K,
    next: AudienceStepsProps[K],
  ) => onChange({ audienceSteps: { ...value, [key]: next } })

  return (
    <div className="space-y-5">
      <LocalizedField
        variant="comfortable"
        label="Título de sección *"
        idPrefix={`${tab.key}-steps-title`}
        value={value.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Vos solo atendé tu negocio. El sistema Loyalz hace el resto."
        placeholderEn="You run your business. Loyalz handles the rest."
      />
      <div className="space-y-2">
        <Label className="text-sm font-medium">Pasos</Label>
        <ItemsField<AudienceStepItem>
          items={value.steps ?? []}
          onChange={(steps) => set("steps", steps)}
          createItem={() => ({
            title: { es: "Paso", en: "Step" },
            description: {
              es: "Descripción del paso.",
              en: "Step description.",
            },
            image: "",
            backgroundColor: "#F8F5EF",
          })}
          addLabel="Añadir paso"
          emptyLabel="Sin pasos."
          itemLabel={(it, i) => translate(it.title) || `Paso ${i + 1}`}
          renderItem={(item, update) => (
            <div className="space-y-3">
              <LocalizedField
        variant="comfortable"
                label="Título *"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Fidelización con Club."
                placeholderEn="Loyalty with Club."
              />
              <LocalizedField
        variant="comfortable"
                label="Descripción"
                multiline
                rows={2}
                value={item.description}
                onChange={(next) =>
                  update({ description: next ?? EMPTY_LOCALIZED })
                }
                placeholderEs="Descripción del paso."
                placeholderEn="Step description."
              />
              <div className="space-y-1">
                <Label className="text-xs">Imagen (preview al hover)</Label>
                <ImagePicker
                  value={item.image || null}
                  onChange={(url) => update({ image: url ?? "" })}
                />
              </div>
              <HexColorField
                value={item.backgroundColor}
                onChange={(backgroundColor) => update({ backgroundColor })}
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
