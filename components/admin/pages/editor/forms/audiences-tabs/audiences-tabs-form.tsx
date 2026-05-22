"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import type { AudiencesTabsSectionProps, AudienceTabItem } from "@/lib/types/Pages"
import {
  AUDIENCE_TAB_PANELS,
  EMPTY_LOCALIZED,
  type AudienceTabPanelId,
} from "@/lib/audiences/tab-blocks"
import { cn } from "@/lib/utils"
import { LocalizedField } from "../localized-field"
import { AudienceTabSidebar } from "./tab-sidebar"
import { AudiencePanelSidebar } from "./panel-sidebar"
import { AudienceTabPanelContent } from "./audience-tab-panel-content"

type Props = {
  value: AudiencesTabsSectionProps
  onChange: (next: AudiencesTabsSectionProps) => void
}

export function AudiencesTabsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<AudiencesTabsSectionProps>(value)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [activePanel, setActivePanel] = useState<AudienceTabPanelId>("general")

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedOnChange = useDebouncedCallback(onChange, 300)

  const set = <K extends keyof AudiencesTabsSectionProps>(
    key: K,
    next: AudiencesTabsSectionProps[K],
  ) => {
    const nextValue = { ...local, [key]: next }
    setLocal(nextValue)
    debouncedOnChange(nextValue)
  }

  const updateTab = (index: number, patch: Partial<AudienceTabItem>) => {
    const nextTabs = local.tabs.map((tab, i) =>
      i === index ? { ...tab, ...patch } : tab,
    )
    set("tabs", nextTabs)
  }

  const tabs = local.tabs ?? []
  const safeTabIndex = Math.min(activeTabIndex, Math.max(tabs.length - 1, 0))
  const activeTab = tabs[safeTabIndex]
  const panelMeta = AUDIENCE_TAB_PANELS.find((p) => p.id === activePanel)

  return (
    <div className="w-full min-w-0 space-y-6">
      <LocalizedField
        label="Título principal *"
        idPrefix="audiences-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Para cada tipo de negocio"
        placeholderEn="For every type of business"
        variant="comfortable"
      />

      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">Contenido por audiencia</Label>
          <p className="mt-1 text-sm text-muted-foreground">
            Elegí audiencia → bloque → editá campos a la derecha. Sin acordeones
            anidados.
          </p>
        </div>

        {tabs.length > 0 && activeTab ? (
          <div
            className={cn(
              "grid min-h-[min(72vh,820px)] w-full overflow-hidden rounded-lg border bg-background",
              "grid-cols-1 lg:grid-cols-[10rem_10rem_minmax(18rem,1fr)] xl:grid-cols-[10.5rem_10.5rem_minmax(24rem,1fr)]",
            )}
          >
            <AudienceTabSidebar
              tabs={tabs}
              activeIndex={safeTabIndex}
              onSelect={(index) => {
                setActiveTabIndex(index)
                setActivePanel("general")
              }}
            />

            <AudiencePanelSidebar
              activePanel={activePanel}
              onSelect={setActivePanel}
            />

            <div className="min-w-0 overflow-y-auto border-t lg:border-t-0 lg:border-l">
              <div className="space-y-1 border-b bg-muted/20 px-5 py-4 lg:px-6">
                <p className="text-sm font-semibold text-foreground">
                  {panelMeta?.label ?? activePanel}
                </p>
                {panelMeta?.description ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {panelMeta.description}
                  </p>
                ) : null}
              </div>
              <div className="px-5 py-5 lg:px-8 lg:py-6">
                <AudienceTabPanelContent
                  key={`${activeTab.key}-${activePanel}`}
                  panel={activePanel}
                  tab={activeTab}
                  onChange={(patch) => updateTab(safeTabIndex, patch)}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
            No hay pestañas configuradas.
          </p>
        )}
      </div>
    </div>
  )
}
