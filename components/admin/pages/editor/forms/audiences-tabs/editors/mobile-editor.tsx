"use client"

import { Label } from "@/components/ui/label"
import type {
  AudienceMobileStatItem,
  AudienceMobileProps,
  AudienceTabItem,
} from "@/lib/types/Pages"
import { EMPTY_LOCALIZED } from "@/lib/audiences/tab-blocks"
import { AUDIENCE_TAB_MOBILE_SCREEN } from "@/lib/audiences/mobile-screens"
import { t as translate } from "@/lib/utils"
import { ItemsField } from "../../../items-field"
import { LocalizedField } from "../../localized-field"

type Props = {
  tab: AudienceTabItem
  onChange: (patch: Partial<AudienceTabItem>) => void
}

export function AudienceTabMobileEditor({ tab, onChange }: Props) {
  const value = tab.audienceMobile!

  const set = <K extends keyof AudienceMobileProps>(
    key: K,
    next: AudienceMobileProps[K],
  ) => onChange({ audienceMobile: { ...value, [key]: next } })

  const screenHint =
    AUDIENCE_TAB_MOBILE_SCREEN[tab.key] ?? "/coffe-mobile.png (cafés)"

  return (
    <div className="space-y-5">
      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
        Pantalla del mockup para <strong>{tab.key}</strong>:{" "}
        <code className="text-xs">{screenHint}</code> + case{" "}
        <code className="text-xs">/mobile-case.png</code>
      </p>

      <LocalizedField
        variant="comfortable"
        label="Título (banner inferior) *"
        idPrefix={`${tab.key}-mobile-title`}
        value={value.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={2}
        placeholderEs={
          "Implementación en menos de 15 minutos.\nSin interrupciones en tu operación."
        }
        placeholderEn={
          "Setup in under 15 minutes.\nNo disruption to your operations."
        }
      />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Stats flotantes</Label>
        <ItemsField<AudienceMobileStatItem>
          items={value.stats ?? []}
          onChange={(stats) => set("stats", stats)}
          createItem={() => ({
            title: { es: "Título del stat", en: "Stat title" },
            stat: { es: "0", en: "0" },
            label: { es: "", en: "" },
          })}
          addLabel="Añadir stat"
          emptyLabel="Sin stats."
          itemLabel={(it, i) =>
            translate(it.title) || translate(it.stat) || `Stat ${i + 1}`
          }
          renderItem={(item, update) => (
            <div className="space-y-3">
              <LocalizedField
                variant="comfortable"
                label="Título"
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Clientes fidelizados"
                placeholderEn="Loyal customers"
              />
              <LocalizedField
                variant="comfortable"
                label="Stat *"
                required
                value={item.stat}
                onChange={(next) => update({ stat: next ?? EMPTY_LOCALIZED })}
                placeholderEs="158"
                placeholderEn="158"
              />
              <LocalizedField
                variant="comfortable"
                label="Label"
                value={item.label}
                onChange={(next) => update({ label: next })}
                placeholderEs="109 beneficios activos"
                placeholderEn="109 active benefits"
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}
