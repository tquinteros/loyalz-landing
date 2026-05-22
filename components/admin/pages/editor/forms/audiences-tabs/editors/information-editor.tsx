"use client"

import { Label } from "@/components/ui/label"
import type {
  AudienceInformationProps,
  AudienceTabItem,
} from "@/lib/types/Pages"
import { EMPTY_LOCALIZED } from "@/lib/audiences/tab-blocks"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import { LocalizedField } from "../../localized-field"
import { HexColorField } from "../hex-color-field"

type Props = {
  tab: AudienceTabItem
  onChange: (patch: Partial<AudienceTabItem>) => void
}

export function AudienceTabInformationEditor({ tab, onChange }: Props) {
  const value = tab.audienceInformation!

  const set = <K extends keyof AudienceInformationProps>(
    key: K,
    next: AudienceInformationProps[K],
  ) => onChange({ audienceInformation: { ...value, [key]: next } })

  return (
    <div className="space-y-5">
      <HexColorField
        label="Color de acento / panel derecho *"
        value={value.backgroundColor}
        onChange={(backgroundColor) => set("backgroundColor", backgroundColor)}
      />
      <p className="text-xs text-muted-foreground">
        El panel izquierdo usa un tinte claro de este color; el texto y el panel
        de la imagen usan el color directo.
      </p>

      <LocalizedField
        variant="comfortable"
        label="Título *"
        idPrefix={`${tab.key}-information-title`}
        value={value.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Pagos directo desde la mesa."
        placeholderEn="Pay directly from the table."
      />
      <LocalizedField
        variant="comfortable"
        label="Descripción"
        idPrefix={`${tab.key}-information-description`}
        value={value.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={3}
        placeholderEs="Recibe pedidos por WhatsApp, cobra con link de pago..."
        placeholderEn="Receive WhatsApp orders, charge with payment links..."
      />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Imagen *</Label>
        <ImagePicker
          value={value.image ?? ""}
          onChange={(image) => set("image", image ?? "")}
        />
      </div>
    </div>
  )
}
