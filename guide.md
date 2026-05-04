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

## 8. Files you normally do **not** touch

| File | Why |
|------|-----|
| `components/admin/pages/editor/page-editor.tsx` | Uses `createDefaultSection` / `SECTION_REGISTRY` generically. |
| `components/admin/pages/editor/section-list.tsx` | Reads `SECTION_TYPES` from the registry. |
| `lib/actions/pages.ts` | Saves `sections` JSON as-is; no per-type logic. |
| `lib/queries/pages.ts` | Normalizes sections array shape only. |

---

## 9. Checklist (copy-paste)

- [ ] `lib/types/Pages.ts` — `*SectionProps`, `*Section`, extend `PageSection` union.
- [ ] `components/sections/<name>-section.tsx` — UI + `SectionWrapper` + prop spread pattern.
- [ ] `components/sections/component-map.ts` — import, `createDefaultSection`, `SECTION_REGISTRY`.
- [ ] `home-renderer.tsx` and/or `product-renderer.tsx` — `switch` case(s).
- [ ] `components/admin/pages/editor/forms/<name>-form.tsx` — edit props.
- [ ] `section-form.tsx` — import + `TypedSectionBody` case.
- [ ] Run TypeScript / linter — exhaustive `switch` should pass.
- [ ] Manually test: admin “Añadir” → pick section → edit → Guardar → open public page.

---

## 10. Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Section missing from “Añadir” dropdown | Not in `SECTION_REGISTRY` or typo in `type` string. |
| Editor shows “Sección desconocida” | `type` not in registry, or mismatch with DB. |
| Section saves but never renders | Missing `case` in `HomeRenderer` / `ProductRenderer` for that `page.type`. |
| TypeScript errors in `TypedSectionBody` | New section not added to `PageSection` union or missing `case`. |
| Props undefined at runtime | Incomplete `createDefaultSection` default `props`. |

---

## 11. Reference: related paths

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
| Example multi-card form | `components/admin/pages/editor/forms/pricing-form.tsx` |
| Example custom section | `components/sections/club-cards-section.tsx` + `forms/club-cards-form.tsx` |

This document should be updated when new renderers or page types are added so future sections stay consistent end-to-end.
