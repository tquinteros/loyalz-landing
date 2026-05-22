"use client"

import { cn } from "@/lib/utils"
import {
  AUDIENCE_TAB_PANELS,
  type AudienceTabPanelId,
} from "@/lib/audiences/tab-blocks"

type Props = {
  activePanel: AudienceTabPanelId
  onSelect: (panel: AudienceTabPanelId) => void
}

export function AudiencePanelSidebar({ activePanel, onSelect }: Props) {
  return (
    <nav
      className="flex shrink-0 flex-col border-b bg-muted/30 lg:border-b-0 lg:border-r"
      aria-label="Bloques del tab"
    >
      {AUDIENCE_TAB_PANELS.map((panel) => (
        <button
          key={panel.id}
          type="button"
          onClick={() => onSelect(panel.id)}
          className={cn(
            "border-b px-4 py-3 text-left text-sm transition-colors last:border-b-0",
            activePanel === panel.id
              ? "bg-background font-semibold text-foreground"
              : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
          )}
        >
          {panel.label}
        </button>
      ))}
    </nav>
  )
}
