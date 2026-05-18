"use client"

import { memo, useState, useMemo, useRef, useEffect } from "react"
import { Plus, Search, Sparkles } from "lucide-react"
import { DragDropProvider } from "@dnd-kit/react"
import { isSortable } from "@dnd-kit/react/sortable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  SECTION_REGISTRY,
  SECTION_TYPES,
  PAGE_SECTION_SUGGESTIONS,
  type SectionType,
} from "@/components/sections/component-map"
import type { AnyPageSection } from "@/lib/types/Pages"
import { SortableSectionItem } from "@/components/admin/pages/editor/sortable-section-item"
import { cn } from "@/lib/utils"

type Props = {
  sections: AnyPageSection[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: (type: SectionType) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onRemove: (id: string) => void
  onToggleEnabled: (id: string) => void
  pageSlug?: string
  pageType?: string | null
}

/** Derive which section types are "suggested" for the current page. */
function getSuggested(pageSlug?: string, pageType?: string | null): SectionType[] {
  if (pageSlug && pageSlug in PAGE_SECTION_SUGGESTIONS) {
    return PAGE_SECTION_SUGGESTIONS[pageSlug]
  }
  if (pageType === "product") {
    return PAGE_SECTION_SUGGESTIONS["__product"] ?? []
  }
  return []
}

export const SectionList = memo(function SectionList({
  sections,
  selectedId,
  onSelect,
  onAdd,
  onReorder,
  onRemove,
  onToggleEnabled,
  pageSlug,
  pageType,
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery("")
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const suggested = useMemo(
    () => getSuggested(pageSlug, pageType),
    [pageSlug, pageType],
  )

  const { matchedSuggested, matchedOthers } = useMemo(() => {
    const q = query.trim().toLowerCase()

    const passes = (type: SectionType) => {
      if (!q) return true
      const entry = SECTION_REGISTRY[type]
      return (
        entry.label.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        type.toLowerCase().includes(q)
      )
    }

    const suggestedSet = new Set(suggested)

    return {
      matchedSuggested: suggested.filter(passes),
      matchedOthers: SECTION_TYPES.filter(
        (t) => !suggestedSet.has(t) && passes(t),
      ),
    }
  }, [query, suggested])

  function handleSelect(type: SectionType) {
    onAdd(type)
    setOpen(false)
  }

  function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= sections.length) return
    onReorder(index, targetIndex)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Secciones
        </p>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Añadir
        </Button>
      </div>

      {/* Section items */}
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
                  total={sections.length}
                  isSelected={section.id === selectedId}
                  onSelect={onSelect}
                  onMove={handleMove}
                  onRemove={onRemove}
                  onToggleEnabled={onToggleEnabled}
                />
              ))}
            </ul>
          </DragDropProvider>
        )}
      </ScrollArea>

      {/* Section picker dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-0 gap-0">
          <DialogHeader className="px-4 pt-4 pb-3 border-b">
            <DialogTitle className="text-base">Añadir sección</DialogTitle>
            <DialogDescription className="sr-only">
              Buscá y seleccioná el tipo de sección que querés añadir a la página.
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="px-3 py-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar sección…"
                className="pl-8 h-8 text-sm border-0 bg-muted/50 focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Results */}
          <ScrollArea className="max-h-[420px]">
            {matchedSuggested.length === 0 && matchedOthers.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Sin resultados para &ldquo;{query}&rdquo;
              </p>
            ) : (
              <div className="py-1">
                {/* Suggested group */}
                {matchedSuggested.length > 0 && (
                  <div>
                    <p className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <Sparkles className="size-3" />
                      Sugeridas para esta página
                    </p>
                    {matchedSuggested.map((type) => (
                      <SectionPickerItem
                        key={type}
                        type={type}
                        onSelect={handleSelect}
                        highlighted
                      />
                    ))}
                  </div>
                )}

                {/* Divider between groups when both have results */}
                {matchedSuggested.length > 0 && matchedOthers.length > 0 && (
                  <div className="my-1 border-t" />
                )}

                {/* All others */}
                {matchedOthers.length > 0 && (
                  <div>
                    {matchedSuggested.length > 0 && (
                      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Otras secciones
                      </p>
                    )}
                    {matchedOthers.map((type) => (
                      <SectionPickerItem
                        key={type}
                        type={type}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
})

type SectionPickerItemProps = {
  type: SectionType
  onSelect: (type: SectionType) => void
  highlighted?: boolean
}

function SectionPickerItem({ type, onSelect, highlighted }: SectionPickerItemProps) {
  const entry = SECTION_REGISTRY[type]
  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      className={cn(
        "w-full flex flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none",
        highlighted && "hover:bg-primary/8",
      )}
    >
      <span className="text-sm font-medium leading-snug">{entry.label}</span>
      <span className="text-xs text-muted-foreground leading-snug line-clamp-1">
        {entry.description}
      </span>
    </button>
  )
}
