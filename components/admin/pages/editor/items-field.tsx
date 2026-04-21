"use client"

import type { ReactNode } from "react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props<T> = {
  items: T[]
  onChange: (next: T[]) => void
  createItem: () => T
  renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode
  addLabel?: string
  itemLabel?: (item: T, index: number) => string
  emptyLabel?: string
}

/**
 * Generic array editor used by every section form that has a list of items
 * (features, stats, testimonials, FAQ, etc). Provides reorder + delete +
 * add controls around a render-prop item form.
 */
export function ItemsField<T>({
  items,
  onChange,
  createItem,
  renderItem,
  addLabel = "Añadir elemento",
  itemLabel,
  emptyLabel = "Sin elementos.",
}: Props<T>) {
  function update(index: number, patch: Partial<T>) {
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    )
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }
  function move(index: number, delta: -1 | 1) {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    const next = items.slice()
    const [it] = next.splice(index, 1)
    next.splice(target, 0, it)
    onChange(next)
  }
  function add() {
    onChange([...items, createItem()])
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="rounded-md border bg-card p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {itemLabel ? itemLabel(item, i) : `Elemento ${i + 1}`}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    title="Subir"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    <ChevronUp className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    title="Bajar"
                    disabled={i === items.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:text-destructive"
                    title="Eliminar"
                    onClick={() => remove(i)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              {renderItem(item, (patch) => update(i, patch))}
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        className="w-full"
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  )
}
