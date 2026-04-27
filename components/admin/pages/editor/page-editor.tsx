"use client"

import { useCallback, useState, useTransition } from "react"
import Link from "next/link"
import { useDebounce } from "use-debounce"
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  EyeOff,
  History,
  RotateCcw,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPageVersions, updatePageSections } from "@/lib/actions/pages"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createDefaultSection,
  type SectionType,
} from "@/components/sections/component-map"
import type {
  AnyPageSection,
  PageSection,
  PageVersion,
} from "@/lib/types/Pages"
import { SectionList } from "@/components/admin/pages/editor/section-list"
import { SectionForm } from "@/components/admin/pages/editor/section-form"
import { LivePreview } from "@/components/admin/pages/editor/live-preview"
import { toast } from "sonner"

type Props = {
  pageId: string
  pageTitle: string
  pageSlug: string
  initialSections: AnyPageSection[]
  initialVersions: PageVersion[]
}

function publicHref(slug: string) {
  return slug === "home" ? "/" : `/${slug}`
}

function formatVersionLabel(version: PageVersion) {
  const date = new Date(version.snapshot_at)
  if (Number.isNaN(date.getTime())) return "Versión anterior"

  return date.toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

export function PageEditor({
  pageId,
  pageTitle,
  pageSlug,
  initialSections,
  initialVersions,
}: Props) {
  const [sections, setSections] = useState<AnyPageSection[]>(initialSections)
  const [savedSections, setSavedSections] =
    useState<AnyPageSection[]>(initialSections)
  const [versions, setVersions] = useState<PageVersion[]>(initialVersions)
  const [selectedVersionId, setSelectedVersionId] = useState<string>()
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSections[0]?.id ?? null,
  )
  const [showPreview, setShowPreview] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  const [debouncedSections] = useDebounce(sections, 400)

  const selectedIndex = sections.findIndex((s) => s.id === selectedId)
  const selected = selectedIndex >= 0 ? sections[selectedIndex] : null

  const addSection = useCallback((type: SectionType) => {
    const next = createDefaultSection(type)
    setSections((prev) => [...prev, next])
    setSelectedId(next.id)
    setIsDirty(true)
  }, [])

  const removeSection = useCallback(
    (id: string) => {
      setSections((prev) => {
        const next = prev.filter((s) => s.id !== id)
        if (id === selectedId) {
          setSelectedId(next[0]?.id ?? null)
        }
        return next
      })
      setIsDirty(true)
    },
    [selectedId],
  )

  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    setSections((prev) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex >= prev.length
      ) {
        return prev
      }
      const next = prev.slice()
      const [item] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, item)
      return next
    })
    setIsDirty(true)
  }, [])

  const toggleEnabled = useCallback((id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    )
    setIsDirty(true)
  }, [])

  /**
   * Generic shallow merge for non-props section fields
   * (`backgroundImage`, `className`, `enabled`, rarely `id`).
   */
  const patchSection = useCallback(
    (id: string, patch: Partial<AnyPageSection>) => {
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      )
      setIsDirty(true)
    },
    [],
  )

  /**
   * Replace a section's `props` wholesale. The per-type form owns the
   * shape, so we just trust it and set.
   */
  const setProps = useCallback(
    (id: string, nextProps: PageSection["props"]) => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === id
            ? ({ ...s, props: nextProps } as AnyPageSection)
            : s,
        ),
      )
      setIsDirty(true)
    },
    [],
  )

  function handleSave() {
    setError(null)
    const sectionsToSave = sections

    startTransition(async () => {
      const result = await updatePageSections(pageId, sectionsToSave)
      if (result.error) {
        setError(result.error)
        return
      }
      setSavedAt(Date.now())
      setSavedSections(sectionsToSave)
      setSelectedVersionId(undefined)
      setIsDirty(false)
      toast.success("Secciones guardadas correctamente")

      const historyResult = await getPageVersions(pageId)
      if (historyResult.data) {
        setVersions(historyResult.data)
      }
    })
  }

  function handleReset() {
    setSections(savedSections)
    setSelectedId(savedSections[0]?.id ?? null)
    setSelectedVersionId(undefined)
    setError(null)
    setIsDirty(false)
  }

  function handleVersionSelect(versionId: string) {
    const version = versions.find((item) => item.id === versionId)
    if (!version) return

    setSections(version.sections)
    setSelectedId(version.sections[0]?.id ?? null)
    setSelectedVersionId(versionId)
    setError(null)
    setIsDirty(true)
    toast.info("Versión anterior cargada. Guarda para restaurarla.")
  }

  return (
    <div className="-m-4 flex min-h-[calc(100dvh-3.5rem)] flex-col md:-m-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Button asChild variant="ghost" size="icon" title="Volver">
            <Link href="/admin/pages">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold leading-tight">
              {pageTitle}
            </h1>
            <p className="truncate font-mono text-xs text-muted-foreground">
              /{pageSlug}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isDirty ? (
            <span className="text-xs text-amber-600 dark:text-amber-400">
              Cambios sin guardar
            </span>
          ) : savedAt ? (
            <span className="text-xs text-muted-foreground">Guardado</span>
          ) : null}

          <Select
            value={selectedVersionId}
            disabled={versions.length === 0 || isPending}
            onValueChange={handleVersionSelect}
          >
            <SelectTrigger
              size="sm"
              className="w-[190px]"
              title="Cargar una versión anterior"
            >
              <History className="size-4" />
              <SelectValue
                placeholder={versions.length ? "Historial" : "Sin historial"}
              />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectLabel>Versiones anteriores</SelectLabel>
                {versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {formatVersionLabel(version)} · {version.sections.length}{" "}
                    secciones
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            asChild
            variant="ghost"
            size="sm"
            title="Ver en el sitio"
          >
            <Link
              href={publicHref(pageSlug)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="size-4" />
              <span className="hidden sm:inline">Abrir</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview((v) => !v)}
            title={showPreview ? "Ocultar preview" : "Mostrar preview"}
          >
            {showPreview ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
            <span className="hidden sm:inline">
              {showPreview ? "Ocultar preview" : "Preview"}
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!isDirty || isPending}
            onClick={handleReset}
          >
            <RotateCcw className="size-4" />
            Descartar
          </Button>
          <Button
            size="sm"
            disabled={!isDirty || isPending}
            onClick={handleSave}
          >
            <Save className="size-4" />
            {isPending ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="border-b bg-destructive/10 px-4 py-2 text-sm text-destructive md:px-6">
          {error}
        </div>
      ) : null}

      {/* Editor body */}
      <div className="grid flex-1 min-h-0 grid-cols-1 gap-0 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
        <aside className="border-b lg:border-b-0 lg:border-r">
          <SectionList
            sections={sections}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAdd={addSection}
            onReorder={reorderSections}
            onRemove={removeSection}
            onToggleEnabled={toggleEnabled}
          />
        </aside>

        <div className="min-w-0 flex flex-col">
          <div className="flex-1 min-h-0">
            {selected ? (
              <SectionForm
                section={selected}
                onPatch={(patch) => patchSection(selected.id, patch)}
                onPropsChange={(p) => setProps(selected.id, p)}
              />
            ) : (
              <div className="flex h-full items-center justify-center p-10 text-center text-sm text-muted-foreground">
                Selecciona una sección de la lista o añade una nueva para
                empezar a editar.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live preview */}
      {showPreview ? (
        <div className="border-t bg-muted/30">
          <div className="flex items-center justify-between border-b bg-background/60 px-4 py-2 md:px-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Live preview
            </p>
            <p className="text-xs text-muted-foreground">
              {sections.filter((s) => s.enabled).length} /{" "}
              {sections.length} secciones visibles
            </p>
          </div>
          <LivePreview sections={debouncedSections} />
        </div>
      ) : null}
    </div>
  )
}
