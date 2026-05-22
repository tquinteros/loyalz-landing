import type {
  AudienceEcosystemProps,
  AudienceMobileProps,
  AudienceProblemProps,
  AudienceStepsProps,
  AudienceTabItem,
  LocalizedString,
} from "@/lib/types/Pages"

/** Logical content blocks inside one audiences tab (admin panel nav). */
export const AUDIENCE_TAB_PANELS = [
  {
    id: "general",
    label: "Tab",
    description: "Etiqueta visible en la barra de pestañas.",
  },
  {
    id: "carousel",
    label: "Carrusel",
    description: "Imágenes full-bleed con overlay Loyalz.",
  },
  {
    id: "separator",
    label: "Separador",
    description: "Tarjeta crema con label y texto destacado.",
  },
  {
    id: "marquee",
    label: "Marcas",
    description: "Título opcional y logos en marquee.",
  },
  {
    id: "problem",
    label: "Problema",
    description: "Encabezado del desafío y tarjetas de solución.",
  },
  {
    id: "steps",
    label: "Pasos",
    description: "Grid interactivo con imagen y lista de pasos.",
  },
  {
    id: "mobile",
    label: "Mobile",
    description: "Mockup con stats flotantes y banner inferior.",
  },
  {
    id: "ecosystem",
    label: "Ecosystem",
    description: "Tarjetas de detalle, label inferior y CTA.",
  },
] as const

export type AudienceTabPanelId = (typeof AUDIENCE_TAB_PANELS)[number]["id"]

export const EMPTY_LOCALIZED: LocalizedString = { es: "", en: "" }

export const EMPTY_AUDIENCE_PROBLEM: AudienceProblemProps = {
  label: EMPTY_LOCALIZED,
  title: EMPTY_LOCALIZED,
  description: EMPTY_LOCALIZED,
  solutions: [],
}

export const EMPTY_AUDIENCE_STEPS: AudienceStepsProps = {
  title: EMPTY_LOCALIZED,
  steps: [],
}

export const EMPTY_AUDIENCE_MOBILE: AudienceMobileProps = {
  title: EMPTY_LOCALIZED,
  stats: [],
}

export const EMPTY_AUDIENCE_ECOSYSTEM: AudienceEcosystemProps = {
  label: EMPTY_LOCALIZED,
  title: EMPTY_LOCALIZED,
  description: EMPTY_LOCALIZED,
  details: [],
  bottomLabel: EMPTY_LOCALIZED,
  bottomCtaLabel: EMPTY_LOCALIZED,
  bottomCtaHref: "/contact",
}

/** Ensures nested blocks exist when loading legacy CMS JSON. */
export function normalizeAudienceTab(tab: AudienceTabItem): AudienceTabItem {
  return {
    ...tab,
    images: tab.images ?? [],
    brands: tab.brands ?? [],
    audienceProblem: tab.audienceProblem ?? EMPTY_AUDIENCE_PROBLEM,
    audienceSteps: tab.audienceSteps ?? EMPTY_AUDIENCE_STEPS,
    audienceMobile: tab.audienceMobile ?? EMPTY_AUDIENCE_MOBILE,
    audienceEcosystem: tab.audienceEcosystem ?? EMPTY_AUDIENCE_ECOSYSTEM,
  }
}
