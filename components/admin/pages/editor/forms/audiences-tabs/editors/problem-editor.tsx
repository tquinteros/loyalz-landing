"use client"

import { Label } from "@/components/ui/label"
import type {
  AudienceProblemProps,
  AudienceSolutionItem,
  AudienceTabItem,
} from "@/lib/types/Pages"
import { EMPTY_LOCALIZED } from "@/lib/audiences/tab-blocks"
import { t as translate } from "@/lib/utils"
import { ItemsField } from "../../../items-field"
import { LocalizedField } from "../../localized-field"
import { HexColorField } from "../hex-color-field"

type Props = {
  tab: AudienceTabItem
  onChange: (patch: Partial<AudienceTabItem>) => void
}

export function AudienceTabProblemEditor({ tab, onChange }: Props) {
  const value = tab.audienceProblem

  const set = <K extends keyof AudienceProblemProps>(
    key: K,
    next: AudienceProblemProps[K],
  ) => onChange({ audienceProblem: { ...value, [key]: next } })

  return (
    <div className="space-y-5">
      <LocalizedField
        variant="comfortable"
        label="Label"
        idPrefix={`${tab.key}-problem-label`}
        value={value.label}
        onChange={(next) => set("label", next)}
        placeholderEs="El desafío"
        placeholderEn="The challenge"
      />
      <LocalizedField
        variant="comfortable"
        label="Título *"
        idPrefix={`${tab.key}-problem-title`}
        value={value.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="¿Cuál es el problema?"
        placeholderEn="What is the problem?"
      />
      <LocalizedField
        variant="comfortable"
        label="Descripción"
        idPrefix={`${tab.key}-problem-description`}
        value={value.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={3}
        placeholderEs="Descripción del problema..."
        placeholderEn="Problem description..."
      />
      <div className="space-y-2">
        <Label className="text-sm font-medium">Soluciones</Label>
        <ItemsField<AudienceSolutionItem>
          items={value.solutions ?? []}
          onChange={(solutions) => set("solutions", solutions)}
          createItem={() => ({
            label: { es: "Solución", en: "Solution" },
            title: { es: "Título de solución", en: "Solution title" },
            description: {
              es: "Descripción de la solución.",
              en: "Solution description.",
            },
            backgroundColor: "#F8F5EF",
          })}
          addLabel="Añadir solución"
          emptyLabel="Sin soluciones."
          itemLabel={(it, i) => translate(it.title) || `Solución ${i + 1}`}
          renderItem={(item, update) => (
            <div className="space-y-3">
              <LocalizedField
        variant="comfortable"
                label="Label"
                value={item.label}
                onChange={(next) => update({ label: next })}
                placeholderEs="Solución"
                placeholderEn="Solution"
              />
              <LocalizedField
        variant="comfortable"
                label="Título *"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Título de solución"
                placeholderEn="Solution title"
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
                placeholderEs="Descripción de la solución."
                placeholderEn="Solution description."
              />
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
