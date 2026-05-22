"use client"

import type { AudienceTabItem } from "@/lib/types/Pages"
import { EMPTY_LOCALIZED } from "@/lib/audiences/tab-blocks"
import { LocalizedField } from "../../localized-field"
type Props = {
  tab: AudienceTabItem
  onChange: (patch: Partial<AudienceTabItem>) => void
}

export function AudienceTabGeneralEditor({ tab, onChange }: Props) {
  return (
    <div className="space-y-5">
      <LocalizedField
        variant="comfortable"
        label="Etiqueta del tab *"
        idPrefix={`tab-${tab.key}-label`}
        value={tab.tabLabel}
        onChange={(next) => onChange({ tabLabel: next ?? EMPTY_LOCALIZED })}
        placeholderEs="Cafés"
        placeholderEn="Cafés"
      />
    </div>
  )
}
