"use client"

import type { AudienceTabItem } from "@/lib/types/Pages"
import { EMPTY_LOCALIZED } from "@/lib/audiences/tab-blocks"
import { LocalizedField } from "../../localized-field"

type Props = {
  tab: AudienceTabItem
  onChange: (patch: Partial<AudienceTabItem>) => void
}

export function AudienceTabSeparatorEditor({ tab, onChange }: Props) {
  return (
    <div className="space-y-5">
      <LocalizedField
        variant="comfortable"
        label="Label"
        idPrefix={`tab-${tab.key}-content-label`}
        value={tab.label}
        onChange={(next) => onChange({ label: next })}
        placeholderEs="Cafés"
        placeholderEn="Cafés"
      />
      <LocalizedField
        variant="comfortable"
        label="Texto separador *"
        idPrefix={`tab-${tab.key}-separator`}
        value={tab.separatorText}
        onChange={(next) => onChange({ separatorText: next ?? EMPTY_LOCALIZED })}
        placeholderEs="La experiencia que hace volver."
        placeholderEn="The experience that brings them back."
      />
      <LocalizedField
        variant="comfortable"
        label="Título (legacy / reservado)"
        idPrefix={`tab-${tab.key}-title`}
        value={tab.title}
        onChange={(next) => onChange({ title: next ?? EMPTY_LOCALIZED })}
        placeholderEs="Convertí cada café en un cliente que vuelve."
        placeholderEn="Turn every coffee into a returning customer."
      />
    </div>
  )
}
