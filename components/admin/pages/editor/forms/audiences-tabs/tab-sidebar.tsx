"use client"

import { cn, t as translate } from "@/lib/utils"
import type { AudienceTabItem } from "@/lib/types/Pages"

type Props = {
  tabs: AudienceTabItem[]
  activeIndex: number
  onSelect: (index: number) => void
}

export function AudienceTabSidebar({ tabs, activeIndex, onSelect }: Props) {
  return (
    <nav
      className="flex shrink-0 flex-col border-b bg-muted/40 lg:border-b-0 lg:border-r"
      aria-label="Audiencias"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onSelect(index)}
          className={cn(
            "border-b px-4 py-3.5 text-left text-sm transition-colors last:border-b-0",
            activeIndex === index
              ? "bg-background font-semibold text-foreground"
              : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
          )}
        >
          {translate(tab.tabLabel) || tab.key}
        </button>
      ))}
    </nav>
  )
}
