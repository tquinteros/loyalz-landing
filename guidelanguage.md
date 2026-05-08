# Guía de migración a i18n (ES / EN)

Esta guía explica, paso a paso, cómo migrar una sección existente (tipo,
componente y formulario del admin) del shape antiguo de strings planos al
nuevo shape con soporte multi-idioma usando `LocalizedString`.

El ejemplo de referencia ya migrado en el repo es `productpricing`. Cuando
aparezcan dudas, mirar:

- `lib/types/Pages.ts` → `ProductPricingSectionProps`
- `components/sections/product-pricing-section.tsx`
- `components/admin/pages/editor/forms/product-pricing-form.tsx`
- `components/sections/component-map.ts` → `case "productpricing"`

---

## Conceptos básicos

### `LocalizedString`

Definido en `lib/types/Pages.ts`:

```ts
export type LocalizedString = {
  es?: string
  en?: string
}
```

Cualquier campo de texto que el usuario edita desde el admin debe pasar a
ser `LocalizedString` (en lugar de `string`).

### Helper `t()`

Definido en `lib/utils.ts`:

```ts
t(value, locale)  // value: string | LocalizedString | undefined
```

Es retro-compatible: si recibe un `string`, lo devuelve tal cual. Si recibe
un `LocalizedString`, devuelve `value[locale] ?? value.es ?? value.en ?? ""`.
Esto permite que filas viejas de la DB sigan renderizando hasta que se
re-guarden desde el admin con el nuevo shape.

### Provider y hooks

`providers/language-provider.tsx`:

- `<LanguageProvider>` ya está montado en `app/layout.tsx`.
- `useLanguage()` → `{ locale, setLocale, t }`.
- `useT()` → atajo que devuelve solo el `t` ya bindeado al locale actual.

### `LocalizedField`

`components/admin/pages/editor/forms/localized-field.tsx`. Renderiza dos
inputs (ES / EN) — o dos textareas con `multiline` — y emite un
`LocalizedString` (o `undefined` si ambos quedan vacíos). Usar siempre que
se editen textos localizables en un form del admin.

---

## Paso 1 — Actualizar el tipo en `lib/types/Pages.ts`

Identificar los campos de texto que el admin edita y cambiar `string` por
`LocalizedString`. Mantener como `string` los campos no traducibles (URLs,
hex de color, números, IDs, paths de imagen, etc.).

**Antes:**

```ts
export type MySectionProps = {
  label?: string
  title?: string
  description?: string
  cards: Array<{
    title: string
    description: string
    ctaLabel: string
    href: string
    color: string
  }>
}
```

**Después:**

```ts
export type MySectionProps = {
  label?: LocalizedString
  title?: LocalizedString
  description?: LocalizedString
  cards: Array<{
    title: LocalizedString
    description: LocalizedString
    ctaLabel: LocalizedString
    href: string
    color: string
  }>
}
```

Si el archivo no lo tiene aún, asegurarse de importar / declarar
`LocalizedString` en la parte superior del archivo (ya está exportado en
`Pages.ts`).

---

## Paso 2 — Migrar el componente de sección

Archivo: `components/sections/<my-section>.tsx`.

1. Marcarlo como `"use client"` si no lo está (necesario para usar el hook).
2. Importar `useT`:

   ```ts
   import { useT } from "@/providers/language-provider"
   ```

3. Llamar al hook al principio del componente:

   ```ts
   const t = useT()
   ```

4. Resolver cada `LocalizedString` antes de usarla. **Importante**: las
   condiciones tipo `label && (...)` ahora siempre son truthy (un objeto
   `{}` es truthy), así que hay que chequear contra el string resuelto.

   **Antes:**

   ```tsx
   {label && <p>{label}</p>}
   ```

   **Después:**

   ```tsx
   const labelText = t(label)
   // ...
   {labelText && <p>{labelText}</p>}
   ```

5. Para los items de un array, resolver dentro del `.map`:

   ```tsx
   {cards.map((card, i) => {
     const cardTitle = t(card.title)
     const cardDescription = t(card.description)
     const cardCta = t(card.ctaLabel)
     return (
       <article key={`${cardTitle}-${i}`}>
         <h3>{cardTitle}</h3>
         <p>{cardDescription}</p>
         <a href={card.href}>{cardCta}</a>
       </article>
     )
   })}
   ```

6. Strings de UI hardcodeados (no editables desde el admin) que sí
   queremos traducir: pasarlos por `t()` con un `LocalizedString` inline.

   ```tsx
   <p>{t({ es: "Desde", en: "From" })}</p>
   <span>{t({ es: "Explorar", en: "Explore" })}</span>
   ```

---

## Paso 3 — Migrar el form del admin

Archivo: `components/admin/pages/editor/forms/<my-section>-form.tsx`.

1. Importar el helper:

   ```ts
   import { LocalizedField } from "./localized-field"
   ```

2. Reemplazar cada `<Input>` / `<Textarea>` que apuntaba a un campo de
   texto localizable.

   **Antes:**

   ```tsx
   <div className="space-y-1.5">
     <Label htmlFor="my-title">Title</Label>
     <Input
       id="my-title"
       value={local.title ?? ""}
       onChange={(e) => set("title", e.target.value || undefined)}
       placeholder="Mi título"
     />
   </div>
   ```

   **Después:**

   ```tsx
   <LocalizedField
     label="Title"
     idPrefix="my-section-title"
     value={local.title}
     onChange={(next) => set("title", next)}
     placeholderEs="Mi título"
     placeholderEn="My title"
   />
   ```

3. Para `<Textarea>` usar `multiline` y `rows`:

   ```tsx
   <LocalizedField
     label="Description"
     multiline
     rows={3}
     value={local.description}
     onChange={(next) => set("description", next)}
     placeholderEs="Descripción..."
     placeholderEn="Description..."
   />
   ```

4. Dentro de `ItemsField` (cards / items): los textos del item también
   pasan a `LocalizedField`. Para campos requeridos, evitar mandar
   `undefined` al `update` reemplazando por un objeto vacío:

   ```tsx
   <LocalizedField
     label="Title"
     required
     value={item.title}
     onChange={(next) => update({ title: next ?? { es: "", en: "" } })}
     placeholderEs="..."
     placeholderEn="..."
   />
   ```

5. El `itemLabel` del `ItemsField` (usado para el título del card en el
   acordeón del admin) ahora recibe un `LocalizedString`. Resolverlo con
   el helper `t` de `lib/utils` (sin locale → cae a ES / EN por orden):

   ```ts
   import { t as translate } from "@/lib/utils"

   itemLabel={(it, i) => translate(it.title) || `Card ${i + 1}`}
   ```

6. Actualizar el `createItem` del `ItemsField` para que devuelva el nuevo
   shape con ambos idiomas:

   ```ts
   createItem={() => ({
     title: { es: "Mi card", en: "My card" },
     description: { es: "Descripción.", en: "Description." },
     ctaLabel: { es: "Explorar", en: "Explore" },
     href: "/",
     color: "#754390",
   })}
   ```

7. Los campos no traducibles (`href`, `color`, `price`, imágenes, etc.)
   se quedan como antes con `<Input>` plano.

---

## Paso 4 — Actualizar el scaffold por defecto

Archivo: `components/sections/component-map.ts`.

En el `case "<my-section>"` del scaffold, cambiar todos los strings
localizables por objetos `{ es, en }`. Esto define los valores iniciales
cuando se crea una nueva sección desde el admin.

**Antes:**

```ts
case "my_section":
  return {
    ...base,
    type: "my_section",
    props: {
      title: "Mi título",
      description: "Mi descripción",
      cards: [
        { title: "Card 1", description: "...", ctaLabel: "Explorar", href: "/", color: "#754390" },
      ],
    },
  } as SectionFor<T>
```

**Después:**

```ts
case "my_section":
  return {
    ...base,
    type: "my_section",
    props: {
      title: { es: "Mi título", en: "My title" },
      description: { es: "Mi descripción", en: "My description" },
      cards: [
        {
          title: { es: "Card 1", en: "Card 1" },
          description: { es: "...", en: "..." },
          ctaLabel: { es: "Explorar", en: "Explore" },
          href: "/",
          color: "#754390",
        },
      ],
    },
  } as SectionFor<T>
```

---

## Paso 5 — Datos hardcodeados en componentes (no DB)

Para componentes que tienen su propia data hardcodeada (ej. el `Header`,
listas de productos, copy estático), seguir este patrón:

1. Definir un objeto `*_COPY` tipado como `Record<string, LocalizedString>`
   con `satisfies` para autocompletado:

   ```ts
   const HEADER_COPY = {
     company: { es: "Empresa", en: "Company" },
     products: { es: "Productos", en: "Products" },
   } satisfies Record<string, LocalizedString>
   ```

2. Para listas, tipar cada item con `LocalizedString` y agregar un `id`
   estable como key de React (el `title` ya no sirve porque cambia con el
   idioma):

   ```ts
   type Item = {
     id: string
     title: LocalizedString
     description: LocalizedString
   }
   ```

3. En el render: `const t = useT()` y `t(item.title)` donde se use.

---

## Paso 6 — Verificar

1. `pnpm dev` (o el comando equivalente) y abrir la página.
2. Cambiar el idioma con el dropdown del header. Todos los textos
   migrados deberían cambiar al instante.
3. Ir a `/admin/pages/...edit`, abrir la sección migrada y confirmar que
   los inputs ES / EN aparecen correctamente y que al guardar se persiste
   el shape `{ es, en }`.
4. Datos viejos (filas en DB con strings planos) deben seguir
   renderizando — el helper `t()` los acepta sin romper.

---

## Compatibilidad hacia atrás (resumen)

- `t()` acepta `string | LocalizedString | undefined` → seguro contra
  filas legacy.
- Los formularios sí migran al nuevo shape, así que cuando un editor
  guarda una sección vieja, queda persistida con `{ es, en }`.
- No hace falta migración de datos en la DB; la conversión ocurre
  naturalmente al re-guardar desde el admin.

---

## Checklist por sección a migrar

- [ ] Cambiar tipos en `lib/types/Pages.ts` (`string` → `LocalizedString`)
- [ ] Componente: `"use client"`, `useT()`, resolver con `t(...)`
- [ ] Componente: chequear truthy contra el string resuelto, no contra el objeto
- [ ] Form: reemplazar inputs/textareas por `<LocalizedField>`
- [ ] Form: `createItem` devuelve `{ es, en }`
- [ ] Form: `itemLabel` usa `translate(it.title)` (helper de `lib/utils`)
- [ ] `component-map.ts`: scaffold con `{ es, en }`
- [ ] Smoke test: cambiar idioma + crear / editar sección desde el admin

---

## Secciones pendientes de migrar

Hoy solo `productpricing` está migrada. El resto de tipos en
`lib/types/Pages.ts` siguen con `string` plano y deberían pasar por esta
guía cuando se quiera habilitar i18n para ellos:

`hero`, `hero_club`, `feature_links`, `stats`, `testimonials`, `faq`,
`contact_form`, `cta`, `pricing`, `club_cards`, `home_products`,
`steps_club`, `common_cta`, `club_activation`, `home_activation`,
`notification_club`.
