"use client"

import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react"
import { useSortable } from "@dnd-kit/react/sortable"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SECTION_REGISTRY, type SectionType } from "@/components/sections/component-map"
import type { AnyPageSection } from "@/lib/types/Pages"

type Props = {
  section: AnyPageSection
  index: number
  isSelected: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onToggleEnabled: (id: string) => void
}

function labelFor(type: string): string {
  const entry = SECTION_REGISTRY[type as SectionType]
  return entry?.label ?? type
}

export function SortableSectionItem({
  section,
  index,
  isSelected,
  onSelect,
  onRemove,
  onToggleEnabled,
}: Props) {
  const { ref, handleRef, isDragging, isDragSource } = useSortable({
    id: section.id,
    index,
  })

  const enabled = section.enabled

  return (
    <li
      ref={ref}
      data-dragging={isDragging || undefined}
      className={cn(
        "group relative flex items-center gap-2 px-3 py-2.5 text-sm transition-colors",
        isSelected ? "bg-accent" : "hover:bg-accent/50",
        isDragSource && "opacity-60",
        isDragging && "z-10 shadow-lg ring-1 ring-primary/40",
      )}
    >
      <button
        ref={handleRef}
        type="button"
        aria-label="Arrastrar para reordenar"
        title="Arrastrar para reordenar"
        className={cn(
          "flex size-6 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground",
          "hover:bg-muted hover:text-foreground active:cursor-grabbing",
          "touch-none select-none",
        )}
      >
        <GripVertical className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => onSelect(section.id)}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <span
          className={cn(
            "inline-flex size-6 shrink-0 items-center justify-center rounded-md border text-[10px] font-mono tabular-nums",
            isSelected && "border-primary text-primary",
          )}
        >
          {index + 1}
        </span>
        <div className="min-w-0">
          <div
            className={cn(
              "truncate text-sm font-medium",
              !enabled && "text-muted-foreground line-through",
            )}
          >
            {labelFor(section.type)}
          </div>
          <div className="truncate font-mono text-[10px] text-muted-foreground">
            {section.id.slice(0, 8)}
          </div>
        </div>
      </button>

      <div className="flex shrink-0 items-center opacity-60 group-hover:opacity-100">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          title={enabled ? "Ocultar" : "Mostrar"}
          onClick={() => onToggleEnabled(section.id)}
        >
          {enabled ? (
            <Eye className="size-3.5" />
          ) : (
            <EyeOff className="size-3.5" />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-destructive hover:text-destructive"
          title="Eliminar"
          onClick={() => onRemove(section.id)}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </li>
  )
}
