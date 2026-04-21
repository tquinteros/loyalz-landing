"use client"

import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react"
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
import { cn } from "@/lib/utils"
import {
  SECTION_REGISTRY,
  SECTION_TYPES,
  type SectionType,
} from "@/components/sections/component-map"
import type { AnyPageSection } from "@/lib/types/Pages"

type Props = {
  sections: AnyPageSection[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: (type: SectionType) => void
  onMove: (id: string, delta: -1 | 1) => void
  onRemove: (id: string) => void
  onToggleEnabled: (id: string) => void
}

function labelFor(type: string): string {
  const entry = SECTION_REGISTRY[type as SectionType]
  return entry?.label ?? type
}

export function SectionList({
  sections,
  selectedId,
  onSelect,
  onAdd,
  onMove,
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
          <ul className="divide-y">
            {sections.map((section, i) => {
              const isSelected = section.id === selectedId
              const enabled = section.enabled
              return (
                <li
                  key={section.id}
                  className={cn(
                    "group relative flex items-center gap-2 px-3 py-2.5 text-sm transition-colors",
                    isSelected
                      ? "bg-accent"
                      : "hover:bg-accent/50",
                  )}
                >
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
                      {i + 1}
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
                      className="size-7"
                      title="Subir"
                      disabled={i === 0}
                      onClick={() => onMove(section.id, -1)}
                    >
                      <ChevronUp className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      title="Bajar"
                      disabled={i === sections.length - 1}
                      onClick={() => onMove(section.id, 1)}
                    >
                      <ChevronDown className="size-3.5" />
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
            })}
          </ul>
        )}
      </ScrollArea>
    </div>
  )
}
