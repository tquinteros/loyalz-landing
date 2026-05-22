# Guide: Adding a new page section

This project renders CMS pages from a JSON array of **sections** stored in Postgres (`pages.sections`). Each section is a discriminated union on `type`. Follow these steps whenever you add a new section kind so types, admin, and public rendering stay in sync.

---

## 1. Mental model

- **`PageSection`**: known section shapes (each has `type`, `id`, `enabled`, optional `backgroundImage` / `className`, and `props`).
- **`AnyPageSection`**: `PageSection | UnknownSection` — legacy or unknown types still load from the DB without crashing the editor.
- **Single source of truth for “what sections exist”**: `components/sections/component-map.ts` (`SECTION_REGISTRY`, `createDefaultSection`).
- **Public rendering**: `components/sections/page-renderer.tsx` picks **Home** vs **Product** renderer from `page.type`; each renderer only switches on section types it should show.

---

## 2. Choose a `type` string and props shape

**Convention**

- Use **snake_case** for the discriminator, e.g. `"club_cards"`, `"hero_club"`.
- Props type name: **PascalCase** + `SectionProps`, e.g. `ClubCardsSectionProps`.

**File:** `lib/types/Pages.ts`

1. Add a **props** type describing only the content fields (not `id`, `enabled`, etc.):

```ts
export type MySectionProps = {
  title: string
  items: Array<{ label: string }>
}
```

2. Add a **section** type using `BaseSection`:

```ts
export type MySection = BaseSection<"my_section", MySectionProps>
```

3. Append **`MySection`** to the **`PageSection`** union.

If you skip this, TypeScript will fail in `component-map.ts`, `section-form.tsx`, and renderers until the union is updated.

---

## 3. Implement the UI component

**File:** `components/sections/<kebab-name>-section.tsx` (example: `club-cards-section.tsx`)

**Pattern**

- Import props from `@/lib/types/Pages` (your `*SectionProps` type).
- Extend with optional `backgroundImage` and `className` (these come from the section wrapper, not always from `props` alone).

```tsx
type Props = MySectionProps & {
  backgroundImage?: string | null
  className?: string | null
}
```

- Wrap content in **`SectionWrapper`** so background image and shared layout behave like other sections:

```tsx
<SectionWrapper backgroundImage={backgroundImage} className={className}>
  {/* section content */}
</SectionWrapper>
```

- Use shared UI primitives (`@/components/ui/...`) when appropriate (e.g. `Card` for card grids).
- Add `"use client"` only if the section uses hooks or browser-only APIs.

---

## 4. Register the section in `component-map.ts`

**File:** `components/sections/component-map.ts`

Do **three** things:

### 4.1 Import the component

```ts
import MySection from "./my-section"
```

### 4.2 Add a branch in `createDefaultSection`

Every new section must return a **fully valid** `props` object so “Add section” in admin never creates half-empty data.

```ts
case "my_section":
  return {
    ...base,
    type: "my_section",
    props: {
      title: "Default title",
      items: [{ label: "Item 1" }],
    },
  } as SectionFor<T>
```

### 4.3 Add an entry to `SECTION_REGISTRY`

```ts
my_section: {
  type: "my_section",
  label: "My section",
  description: "Short description for the admin picker.",
  component: MySection,
},
```

**Effects**

- **`SECTION_TYPES`** is derived from registry keys — the “Añadir” dropdown in the page editor updates automatically.
- **`createDefaultSection`** is used by `PageEditor` when adding a section — no change needed in `page-editor.tsx` for new types.

---

## 5. Wire public renderers (critical)

**File:** `components/sections/page-renderer.tsx`

- Routes by **`page.type`**:
  - `"product"` → `ProductRenderer`
  - anything else (e.g. home) → `HomeRenderer`

So you must add your section to **every renderer where it should appear**.

**Files**

- `components/sections/home-renderer.tsx` — typical marketing / home-style pages.
- `components/sections/product-renderer.tsx` — e.g. Club product pages.

**Pattern**

1. Import your section component.
2. In the inner `switch (section.type)`, add:

```tsx
case "my_section":
  return <MySection {...section.props} {...common} />
```

where `common` is `{ backgroundImage, className }` (already defined in those files).

**If you forget this step:** the section saves in admin and appears in the list, but **nothing renders** on the public site for that page type.

**Live preview:** `components/admin/pages/editor/live-preview.tsx` uses `PageRenderer` with a synthetic `Page`. Once renderers include your case, preview matches production (when preview is enabled in the editor).

---

## 6. Admin: form component

**File:** `components/admin/pages/editor/forms/<kebab-name>-form.tsx` (example: `club-cards-form.tsx`)

**Pattern** (matches existing forms like `pricing-form.tsx`):

- Props: `value: MySectionProps` and `onChange: (next: MySectionProps) => void`.
- Local state + `useEffect` to sync when `value` changes from outside.
- `useDebouncedCallback(onChange, 300)` to avoid spamming parent updates on every keystroke.
- Use `@/components/ui/input`, `Label`, `Textarea`, etc.
- For **arrays**, use **`ItemsField`** from `../items-field` (reorder, add, remove).

Export a named component, e.g. `export function MySectionForm(...)`.

---

## 7. Admin: dispatch in `section-form.tsx`

**File:** `components/admin/pages/editor/section-form.tsx`

1. Import your form: `import { MySectionForm } from "./forms/my-section-form"`.
2. In **`TypedSectionBody`**, add a `case` that mirrors `PageSection`:

```tsx
case "my_section":
  return <MySectionForm value={section.props} onChange={onPropsChange} />
```

The `default` branch uses `never` — TypeScript will error until every union member has a case.

**Note:** `SectionForm` already handles **enabled**, **SECTION_REGISTRY** label/description, and **CommonSectionFields** (advanced `backgroundImage` / `className`). You usually only edit props in your form.

---

## 8. Internationalization (i18n)

All public-facing copy is **localized**. The CMS stores translatable strings
as a `LocalizedString` (`{ es?: string; en?: string }`), and the active
locale is resolved at runtime by the `LanguageProvider`.

### 8.1 Choose the right shape in `lib/types/Pages.ts`

- **Translatable copy** → `LocalizedString` (titles, labels, descriptions,
  CTA labels, FAQ answers, badges, etc.).
- **Brand / proper nouns** → plain `string` (e.g. testimonial `author`,
  brand `name`).
- **Hrefs, hex colors, numeric/display tokens** (`"+4x"`, `"$79"`) → plain
  `string` (they don't change per locale).
- **Composite CTAs** with both label + href → use the shared `CTA` type
  (`{ label: LocalizedString; href: string }`).

```ts
export type MySectionProps = {
  label?: LocalizedString          // optional translated tag
  title: LocalizedString           // required translated copy
  cards: Array<{
    title: LocalizedString
    image: string                  // URL, not translated
  }>
  primaryCta: CTA                  // label is localized, href is not
}
```

### 8.2 Public component: resolve text with `useT`

In every section component, import the translation helper and call it for
**any** `LocalizedString` (or legacy plain string) field before rendering.

```tsx
"use client"

import { useT } from "@/providers/language-provider"
import type { MySectionProps } from "@/lib/types/Pages"

type Props = MySectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function MySection({ title, label, primaryCta }: Props) {
  const t = useT()
  const titleText = t(title)            // -> string in current locale
  const labelText = t(label)            // safe with undefined
  const ctaLabel = t(primaryCta?.label)
  // ...
}
```

Notes:

- `useT()` must be called inside the `LanguageProvider` tree, so the
  section component must be a Client Component (`"use client"`) when it
  calls hooks.
- `t(undefined)` returns `""` — you can guard with `titleText ? ... : null`.
- For inline copy that the editor cannot author (placeholders, alt text,
  empty-state strings), pass a `LocalizedString` literal:
  ```tsx
  t({ es: "Sin imágenes.", en: "No images." })
  ```

### 8.3 Admin form: edit translations with `LocalizedField`

In `components/admin/pages/editor/forms/<name>-form.tsx`, use
`LocalizedField` (from `./localized-field`) for every `LocalizedString`
prop. It renders stacked ES + EN inputs and handles the empty-collapse
logic (`{ es: "", en: "" }` becomes `undefined`).

```tsx
import { LocalizedField } from "./localized-field"
import type { LocalizedString } from "@/lib/types/Pages"

const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

<LocalizedField
  label="Título *"
  idPrefix="my-section-title"
  value={local.title}
  // Required field: coerce undefined back to an empty object
  onChange={(next) => set("title", next ?? EMPTY_LOCALIZED)}
  placeholderEs="Título por defecto"
  placeholderEn="Default title"
/>

<LocalizedField
  label="Label"
  idPrefix="my-section-label"
  value={local.label}
  // Optional field: forward undefined as-is so it can be cleared
  onChange={(next) => set("label", next)}
/>
```

For long copy, opt into `multiline` (renders `<Textarea>`):

```tsx
<LocalizedField multiline rows={3} value={local.description} onChange={...} />
```

### 8.4 Defaults in `createDefaultSection`

Always seed both locales in `component-map.ts` so newly created sections
are usable in either language out of the box.

```ts
case "my_section":
  return {
    ...base,
    type: "my_section",
    props: {
      label: { es: "Etiqueta", en: "Label" },
      title: { es: "Título por defecto", en: "Default title" },
      // images / hrefs / colors stay as plain strings
      primaryCtaHref: "/contact",
      primaryCtaLabel: { es: "Empezar", en: "Get started" },
    },
  } as SectionFor<T>
```

### 8.5 Item labels in `ItemsField`

When listing array items in the admin, derive a human label from the
**current** locale so each card is recognizable. Use the plain `t`
translator from `@/lib/utils` (no React hook) for synchronous list
labels:

```ts
import { t as translate } from "@/lib/utils"

itemLabel={(it, i) => translate(it.title) || `Producto ${i + 1}`}
```

### 8.6 i18n checklist

- [ ] Every translatable prop in `lib/types/Pages.ts` is `LocalizedString`.
- [ ] Section component imports `useT` and wraps **every** translatable
      field in `t(...)` (including fallbacks via `t({ es, en })` literals).
- [ ] Admin form uses `LocalizedField` (with `idPrefix` and placeholders)
      for every `LocalizedString`.
- [ ] `createDefaultSection` seeds **both** `es` and `en` for all
      localized strings.
- [ ] Don't translate brand names, hex colors, hrefs, or numeric tokens.

---

## 9. Files you normally do **not** touch

| File | Why |
|------|-----|
| `components/admin/pages/editor/page-editor.tsx` | Uses `createDefaultSection` / `SECTION_REGISTRY` generically. |
| `components/admin/pages/editor/section-list.tsx` | Reads `SECTION_TYPES` from the registry. |
| `lib/actions/pages.ts` | Saves `sections` JSON as-is; no per-type logic. |
| `lib/queries/pages.ts` | Normalizes sections array shape only. |

---

## 10. Checklist (copy-paste)

- [ ] `lib/types/Pages.ts` — `*SectionProps`, `*Section`, extend `PageSection` union.
- [ ] `components/sections/<name>-section.tsx` — UI + `SectionWrapper` + prop spread pattern.
- [ ] `components/sections/component-map.ts` — import, `createDefaultSection`, `SECTION_REGISTRY`.
- [ ] `home-renderer.tsx` and/or `product-renderer.tsx` — `switch` case(s).
- [ ] `components/admin/pages/editor/forms/<name>-form.tsx` — edit props.
- [ ] `section-form.tsx` — import + `TypedSectionBody` case.
- [ ] All translatable strings use `LocalizedString` + `useT()` + `LocalizedField` (see §8).
- [ ] Run TypeScript / linter — exhaustive `switch` should pass.
- [ ] Manually test: admin “Añadir” → pick section → edit → Guardar → open public page.

---

## 11. Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Section missing from “Añadir” dropdown | Not in `SECTION_REGISTRY` or typo in `type` string. |
| Editor shows “Sección desconocida” | `type` not in registry, or mismatch with DB. |
| Section saves but never renders | Missing `case` in `HomeRenderer` / `ProductRenderer` for that `page.type`. |
| TypeScript errors in `TypedSectionBody` | New section not added to `PageSection` union or missing `case`. |
| Props undefined at runtime | Incomplete `createDefaultSection` default `props`. |

---

## 12. Reference: related paths

| Concern | Path |
|---------|------|
| Section types | `lib/types/Pages.ts` |
| Registry & defaults | `components/sections/component-map.ts` |
| Which renderer runs | `components/sections/page-renderer.tsx` |
| Home sections | `components/sections/home-renderer.tsx` |
| Product sections | `components/sections/product-renderer.tsx` |
| Section shell | `components/sections/section-wrapper.tsx` |
| Admin form router | `components/admin/pages/editor/section-form.tsx` |
| List/array editor | `components/admin/pages/editor/items-field.tsx` |
| Localized input (i18n) | `components/admin/pages/editor/forms/localized-field.tsx` |
| Language provider / `useT` | `providers/language-provider.tsx` |
| Example multi-card form | `components/admin/pages/editor/forms/pricing-form.tsx` |
| Example custom section | `components/sections/club-cards-section.tsx` + `forms/club-cards-form.tsx` |
| Example with images + two CTAs | `components/sections/home-solutions-section.tsx` + `forms/home-solutions-form.tsx` |
| Audiences (nested tab CMS) | `components/sections/audiences-tabs/` + `forms/audiences-tabs/` + `lib/audiences/tab-blocks.ts` |

This document should be updated when new renderers or page types are added so future sections stay consistent end-to-end.

---

## 13. Audiences page — nested blocks without extra section types

The `/audiences` page uses a **single** section type (`audiences_tabs`) in the DB. Each tab stores several **logical blocks** in one `AudienceTabItem` JSON object.

### Why one section type

Splitting into many `PageSection` types (carousel, marquee, problem, etc.) would force editors to manage section order per tab and complicate the public tab UI. Instead:

- **Public**: `components/sections/audiences-tabs/` — one file per block (`tab-carousel.tsx`, `problem-block.tsx`, …) composed in `tab-body.tsx`.
- **Admin**: two-level sidebar — **audiencia** (cafés / restaurantes / delivery) → **bloque** (Tab, Carrusel, Separador, …). No nested accordions.
- **Types**: block list and defaults live in `lib/audiences/tab-blocks.ts` (`AUDIENCE_TAB_PANELS`, `normalizeAudienceTab`).

### Adding a new block to audiences tabs

1. Extend `AudienceTabItem` in `lib/types/Pages.ts` (document under a `/* --- Block: … --- */` comment).
2. Add a panel entry to `AUDIENCE_TAB_PANELS` in `lib/audiences/tab-blocks.ts`.
3. Create `editors/<block>-editor.tsx` under `forms/audiences-tabs/editors/`.
4. Wire the panel in `forms/audiences-tabs/tab-editor.tsx`.
5. Create or update a public component under `components/sections/audiences-tabs/` and render it from `tab-body.tsx`.
6. Seed defaults for all three tabs in `component-map.ts` → `case "audiences_tabs"`.
7. Tab-specific assets (e.g. mobile screen by `tab.key`) live in `lib/audiences/mobile-screens.ts`.

Do **not** add a new `PageSection` union member unless the block must be reused on other pages as an independent section.
