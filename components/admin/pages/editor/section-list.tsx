"use client"

import { Plus } from "lucide-react"
import { DragDropProvider } from "@dnd-kit/react"
import { isSortable } from "@dnd-kit/react/sortable"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SECTION_REGISTRY,
  SECTION_TYPES,
  type SectionType,
} from "@/components/sections/component-map"
import type { AnyPageSection } from "@/lib/types/Pages"
import { SortableSectionItem } from "@/components/admin/pages/editor/sortable-section-item"

type Props = {
  sections: AnyPageSection[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: (type: SectionType) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onRemove: (id: string) => void
  onToggleEnabled: (id: string) => void
}

export function SectionList({
  sections,
  selectedId,
  onSelect,
  onAdd,
  onReorder,
  onRemove,
  onToggleEnabled,
}: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Secciones
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="size-4" />
              Añadir
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Tipo de sección</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {SECTION_TYPES.map((type) => {
              const entry = SECTION_REGISTRY[type]
              return (
                <DropdownMenuItem
                  key={type}
                  onSelect={() => onAdd(type)}
                  className="flex flex-col items-start gap-0.5"
                >
                  <span className="text-sm font-medium">{entry.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {entry.description}
                  </span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1">
        {sections.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            Esta página aún no tiene secciones.
          </p>
        ) : (
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) return
              const { source } = event.operation
              if (!source || !isSortable(source)) return
              const { initialIndex, index } = source
              if (initialIndex === index) return
              onReorder(initialIndex, index)
            }}
          >
            <ul className="divide-y">
              {sections.map((section, i) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  index={i}
                  isSelected={section.id === selectedId}
                  onSelect={onSelect}
                  onRemove={onRemove}
                  onToggleEnabled={onToggleEnabled}
                />
              ))}
            </ul>
          </DragDropProvider>
        )}
      </ScrollArea>
    </div>
  )
}
