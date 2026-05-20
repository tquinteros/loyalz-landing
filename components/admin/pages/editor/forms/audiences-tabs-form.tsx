"use client"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ItemsField } from "../items-field"
import { LocalizedField } from "./localized-field"
import { ImagePicker } from "@/components/admin/media-library/image-picker"
import type {
  AudiencesTabsSectionProps,
  AudienceTabItem,
  AudienceProblemProps,
  AudienceSolutionItem,
  LocalizedString,
} from "@/lib/types/Pages"
import { t as translate } from "@/lib/utils"

type Props = {
  value: AudiencesTabsSectionProps
  onChange: (next: AudiencesTabsSectionProps) => void
}

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

type ImageItem = { url: string }

function toImageItems(images: string[]): ImageItem[] {
  return (images ?? []).map((url) => ({ url }))
}
function fromImageItems(items: ImageItem[]): string[] {
  return items.map((it) => it.url)
}

export function AudiencesTabsForm({ value, onChange }: Props) {
  const [local, setLocal] = useState<AudiencesTabsSectionProps>(value)

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

  return (
    <div className="space-y-6">
      {/* Page-level title */}
      <LocalizedField
        label="Título principal *"
        idPrefix="audiences-title"
        value={local.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Para cada tipo de negocio"
        placeholderEn="For every type of business"
      />

      {/* Tabs */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Pestañas de audiencia</Label>
        <p className="text-xs text-muted-foreground">
          Configurá el contenido de cada pestaña (Cafés, Restaurantes, Delivery-first).
        </p>

        <Accordion type="multiple" className="w-full space-y-2">
          {(local.tabs ?? []).map((tab, index) => (
            <AccordionItem
              key={tab.key}
              value={tab.key}
              className="rounded-md border px-4"
            >
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {translate(tab.tabLabel) || tab.key}
              </AccordionTrigger>
              <AccordionContent>
                <TabEditor
                  tab={tab}
                  index={index}
                  onChange={(patch) => updateTab(index, patch)}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Single tab editor                                                   */
/* ------------------------------------------------------------------ */

type TabEditorProps = {
  tab: AudienceTabItem
  index: number
  onChange: (patch: Partial<AudienceTabItem>) => void
}

function TabEditor({ tab, onChange }: TabEditorProps) {
  const setTab = <K extends keyof AudienceTabItem>(
    key: K,
    next: AudienceTabItem[K],
  ) => onChange({ [key]: next })

  return (
    <div className="space-y-5 pb-2 pt-1">
      <LocalizedField
        label="Etiqueta del tab *"
        idPrefix={`tab-${tab.key}-label`}
        value={tab.tabLabel}
        onChange={(next) => setTab("tabLabel", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Cafés"
        placeholderEn="Cafés"
      />

      {/* Images */}
      <div className="space-y-2">
        <Label>Imágenes del carrusel</Label>
        <ItemsField<ImageItem>
          items={toImageItems(tab.images)}
          onChange={(items) => setTab("images", fromImageItems(items))}
          createItem={() => ({ url: "" })}
          addLabel="Añadir imagen"
          emptyLabel="Sin imágenes."
          itemLabel={(_, i) => `Imagen ${i + 1}`}
          renderItem={(item, update) => (
            <ImagePicker
              value={item.url || null}
              onChange={(url) => update({ url: url ?? "" })}
            />
          )}
        />
      </div>

      <LocalizedField
        label="Texto separador"
        idPrefix={`tab-${tab.key}-separator`}
        value={tab.separatorText}
        onChange={(next) => setTab("separatorText", next ?? EMPTY_LOCALIZED)}
        placeholderEs="La experiencia que hace volver."
        placeholderEn="The experience that brings them back."
      />

      <LocalizedField
        label="Label"
        idPrefix={`tab-${tab.key}-content-label`}
        value={tab.label}
        onChange={(next) => setTab("label", next)}
        placeholderEs="Cafés"
        placeholderEn="Cafés"
      />

      <LocalizedField
        label="Título *"
        idPrefix={`tab-${tab.key}-title`}
        value={tab.title}
        onChange={(next) => setTab("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="Convertí cada café en un cliente que vuelve."
        placeholderEn="Turn every coffee into a returning customer."
      />

      {/* Brand marquee */}
      <Accordion type="single" collapsible className="rounded-md border px-4">
        <AccordionItem value="marquee" className="border-0">
          <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:no-underline">
            Brand Marquee
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-1">
              <LocalizedField
                label="Título del marquee"
                idPrefix={`tab-${tab.key}-marquee-title`}
                value={tab.brandMarqueeTitle}
                onChange={(next) => setTab("brandMarqueeTitle", next)}
                placeholderEs="Marcas que confían en nosotros"
                placeholderEn="Brands that trust us"
              />

              <div className="space-y-2">
                <Label>Marcas</Label>
                <ItemsField<{ name?: string; logo: string }>
                  items={tab.brands ?? []}
                  onChange={(brands) => setTab("brands", brands)}
                  createItem={() => ({ name: "", logo: "" })}
                  addLabel="Añadir marca"
                  emptyLabel="Sin marcas."
                  itemLabel={(it, i) => it.name || `Marca ${i + 1}`}
                  renderItem={(item, update) => (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Nombre (alt)</Label>
                        <input
                          className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          value={item.name ?? ""}
                          placeholder="Nombre de marca"
                          onChange={(e) => update({ name: e.target.value })}
                        />
                      </div>
                      <ImagePicker
                        value={item.logo || null}
                        onChange={(url) => update({ logo: url ?? "" })}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Audience problem */}
      <Accordion type="single" collapsible className="rounded-md border px-4">
        <AccordionItem value="problem" className="border-0">
          <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:no-underline">
            Problema de audiencia
          </AccordionTrigger>
          <AccordionContent>
            <AudienceProblemEditor
              tabKey={tab.key}
              value={tab.audienceProblem}
              onChange={(next) => setTab("audienceProblem", next)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Audience problem editor                                             */
/* ------------------------------------------------------------------ */

type AudienceProblemEditorProps = {
  tabKey: string
  value: AudienceProblemProps
  onChange: (next: AudienceProblemProps) => void
}

function AudienceProblemEditor({ tabKey, value, onChange }: AudienceProblemEditorProps) {
  const set = <K extends keyof AudienceProblemProps>(
    key: K,
    next: AudienceProblemProps[K],
  ) => onChange({ ...value, [key]: next })

  return (
    <div className="space-y-4 pt-1">
      <LocalizedField
        label="Label"
        idPrefix={`${tabKey}-problem-label`}
        value={value.label}
        onChange={(next) => set("label", next)}
        placeholderEs="El desafío"
        placeholderEn="The challenge"
      />

      <LocalizedField
        label="Título *"
        idPrefix={`${tabKey}-problem-title`}
        value={value.title}
        onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
        placeholderEs="¿Cuál es el problema?"
        placeholderEn="What is the problem?"
      />

      <LocalizedField
        label="Descripción"
        idPrefix={`${tabKey}-problem-description`}
        value={value.description}
        onChange={(next) => set("description", next ?? EMPTY_LOCALIZED)}
        multiline
        rows={3}
        placeholderEs="Descripción del problema..."
        placeholderEn="Problem description..."
      />

      {/* Solutions */}
      <div className="space-y-2">
        <Label>Soluciones</Label>
        <ItemsField<AudienceSolutionItem>
          items={value.solutions ?? []}
          onChange={(solutions) => set("solutions", solutions)}
          createItem={() => ({
            label: { es: "Solución", en: "Solution" },
            title: { es: "Título de solución", en: "Solution title" },
            description: { es: "Descripción de la solución.", en: "Solution description." },
            backgroundColor: "#F8F5EF",
          })}
          addLabel="Añadir solución"
          emptyLabel="Sin soluciones."
          itemLabel={(it, i) => translate(it.title) || `Solución ${i + 1}`}
          renderItem={(item, update) => (
            <div className="space-y-3">
              <LocalizedField
                label="Label"
                value={item.label}
                onChange={(next) => update({ label: next })}
                placeholderEs="Solución"
                placeholderEn="Solution"
              />
              <LocalizedField
                label="Título *"
                required
                value={item.title}
                onChange={(next) => update({ title: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Título de solución"
                placeholderEn="Solution title"
              />
              <LocalizedField
                label="Descripción"
                multiline
                rows={2}
                value={item.description}
                onChange={(next) => update({ description: next ?? EMPTY_LOCALIZED })}
                placeholderEs="Descripción de la solución."
                placeholderEn="Solution description."
              />

              <div className="space-y-1">
                <Label className="text-xs">Color de fondo (hex) *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={item.backgroundColor || "#F8F5EF"}
                    onChange={(e) => update({ backgroundColor: e.target.value })}
                    className="h-9 w-14 p-1"
                  />
                  <Input
                    value={item.backgroundColor ?? ""}
                    onChange={(e) => update({ backgroundColor: e.target.value })}
                    placeholder="#F8F5EF"
                  />
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
