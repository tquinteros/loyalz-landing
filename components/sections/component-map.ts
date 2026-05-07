import type { ComponentType } from "react"
import HeroSection from "./hero-section"
import HeroClubSection from "./hero-club-section"
import FeatureLinksSection from "./feature-links-section"
import StatsSection from "./stats-section"
import TestimonialsSection from "./testimonials-section"
import FAQSection from "./faq-section"
import ContactFormSection from "./contact-form-section"
import type { PageSection } from "@/lib/types/Pages"
import CTASection from "./cta-section"
import PricingSection from "./pricing-section"
import ProductPricingSection from "./product-pricing-section"
import ClubCardsSection from "./club-cards-section"
import HomeProductsSection from "./home-products-section"
import StepsClubSection from "./steps-club-section"
import CommonCTASection from "./common-cta-section"
import ClubActivationSection from "./club-activation-section"
import HomeActivationSection from "./home-activation-section"
import NotificationClubSection from "./notification-club-section"

/**
 * Deterministic factory for a new section of a given type. Used by the admin
 * "Add section" picker so every new entry has a fully-populated `props`
 * object that matches the component's expected shape.
 */
type SectionFor<T extends PageSection["type"]> = Extract<PageSection, { type: T }>

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `sec-${Math.random().toString(36).slice(2, 10)}`
}

export function createDefaultSection<T extends PageSection["type"]>(
  type: T,
): SectionFor<T> {
  const base = {
    id: makeId(),
    enabled: true,
    backgroundImage: null,
    className: null,
  }
  switch (type) {
    case "hero":
      return {
        ...base,
        type: "hero",
        props: {
          title: "El sistema all-in-one para hacer crecer tu negocio.",
          images: ["/club.png", "/club.png", "/club.png", "/club.png", "/club.png"],
          ctaLabel: "Demo Gratis",
          ctaHref: "/contact",
        },
      } as SectionFor<T>
    case "hero_club":
      return {
        ...base,
        type: "hero_club",
        props: {
          title: "New Hero Club section",
          subtitle: "",
          image: "",
          primaryCta: { label: "Get started", href: "/contact" },
        },
      } as SectionFor<T>
    case "feature_links":
      return {
        ...base,
        type: "feature_links",
        props: {
          title: "Features",
          subtitle: "",
          items: [
            { icon: "sparkles", title: "Feature one", description: "" },
            { icon: "zap", title: "Feature two", description: "" },
          ],
        },
      } as SectionFor<T>
    case "stats":
      return {
        ...base,
        type: "stats",
        props: {
          title: "Our numbers",
          items: [
            { value: "100+", label: "Customers" },
            { value: "24/7", label: "Support" },
          ],
        },
      } as SectionFor<T>
    case "testimonials":
      return {
        ...base,
        type: "testimonials",
        props: {
          title: "What people are saying",
          items: [
            {
              logo: "",
              badges: ["+6.000 members", "+30% growth"],
              summary: "An amazing product.",
              author: "Jane Doe",
              place: "Acme",
              avatar: "",
            },
          ],
        },
      } as SectionFor<T>
    case "faq":
      return {
        ...base,
        type: "faq",
        props: {
          title: "Frequently asked questions",
          image: "",
          helpTitle: "Still have questions?",
          helpDescription: "Talk to our team and learn everything about Loyalz.",
          helpCtaLabel: "Contact us",
          helpCtaHref: "/contact",
          items: [
            { question: "A common question?", answer: "The answer." },
          ],
        },
      } as SectionFor<T>
    case "contact_form":
      return {
        ...base,
        type: "contact_form",
        props: {
          title: "Get in touch",
          subtitle: "",
          submitLabel: "Send",
        },
      } as SectionFor<T>
    case "cta":
      return {
        ...base,
        type: "cta",
        props: {
          title: "Ready to get started?",
          label: "Contact us",
        },
      } as SectionFor<T>
    case "pricing":
      return {
        ...base,
        type: "pricing",
        props: {
          label: "Plans",
          title: "Simple pricing for every team",
          description: "Pick the plan that best fits your business.",
          bottomMessage: "POS + Pay are included in all plans.",
          cards: [
            {
              title: "Starter",
              price: "$79",
              shops: "Up to 1 shop",
              savings: "19%",
              features: ["Club", "Reviews", "POS", "Pay"],
            },
            {
              title: "Growth",
              price: "$349",
              shops: "Up to 3 shops",
              savings: "22%",
              features: ["Club", "Reviews", "POS", "Pay", "AI Pro"],
            },
          ],
        },
      } as SectionFor<T>
    case "productpricing":
      return {
        ...base,
        type: "productpricing",
        props: {
          label: "Nuestros productos",
          title: "Los precios claros. Como todo en Loyalz.",
          description: "Empeza con lo que necesitas hoy. Escala cuando quieras.",
          cards: [
            {
              price: 19,
              title: "Loyalz club",
              description: "Mantené más visitas de tus clientes con la fidelizacion.",
              href: "/club",
              ctaLabel: "Explorar Club",
              color: "#754390",
            },
            {
              price: 19,
              title: "Loyalz reviews",
              description: "Más reseñas positivas en Google sin tener que pedirlas.",
              href: "/reviews",
              ctaLabel: "Explorar Reviews",
              color: "#8C7F1F",
            },
            {
              price: 0,
              title: "Loyalz pos",
              description: "Obtené los datos de tus clientes de forma automatica.",
              href: "/pos",
              ctaLabel: "Explorar Pos",
              color: "#EC491E",
            },
            {
              price: 19,
              title: "Loyalz ai",
              description: "Tu asistente que responde, reactiva y vende 24/7.",
              href: "/ai",
              ctaLabel: "Explorar AI",
              color: "#013662",
            },
          ],
        },
      } as SectionFor<T>
    case "club_cards":
      return {
        ...base,
        type: "club_cards",
        props: {
          label: "Club",
          title: "Section title",
          subtitle: "Section subtitle",
          cards: [
            {
              title: "Card title",
              description: "Card description",
            },
          ],
        },
      } as SectionFor<T>
    case "home_products":
      return {
        ...base,
        type: "home_products",
        props: {
          label: "Productos",
          title: "Todo lo que necesitás para vender más",
          products: [
            {
              title: "Loyalz Club",
              subtitle: "Fidelización",
              description: "Convertí compras en clientes que siempre vuelven.",
              color: "#754390",
              image: "",
            },
            {
              title: "Loyalz Reviews",
              subtitle: "Reseñas",
              description: "Pedí y mostrà reseñas reales en tus canales.",
              color: "#EC491E",
              image: "",
            },
          ],
        },
      } as SectionFor<T>
    case "steps_club":
      return {
        ...base,
        type: "steps_club",
        props: {
          title: "Cómo funciona",
          steps: [
            {
              title: "Paso 1",
              description: "Descripción del paso.",
              image: "",
            },
          ],
        },
      } as SectionFor<T>
    case "common_cta":
      return {
        ...base,
        type: "common_cta",
        props: {
          backgroundColor: "#754390",
          title: "Tu próximo paso",
          description: "Breve texto que acompaña el llamado a la acción.",
          firstCta: { label: "Empezar", href: "/contact" },
          secondCta: { label: "Saber más", href: "/club" },
          image: "",
        },
      } as SectionFor<T>
    case "club_activation":
      return {
        ...base,
        type: "club_activation",
        props: {
          title: "Activaciones",
          activationCards: [
            {
              image: "",
              stat: "+4x",
              title: "Frecuencia en clientes",
              description: "Texto opcional bajo el título.",
            },
            {
              image: "",
              stat: "12",
              title: "Segundo bloque",
              description: "",
            },
            {
              image: "",
              stat: "24/7",
              title: "Tercer bloque",
            },
          ],
          bottomLabel: "Pie de sección",
        },
      } as SectionFor<T>
    case "home_activation":
      return {
        ...base,
        type: "home_activation",
        props: {
          title: "Activaciones",
          activationCards: [
            {
              image: "",
              stat: "+4x",
              title: "Frecuencia en clientes",
              description: "Texto opcional bajo el título.",
            },
            {
              image: "",
              stat: "12",
              title: "Segundo bloque",
              description: "",
            },
            {
              image: "",
              stat: "24/7",
              title: "Tercer bloque",
            },
          ],
          brands: [
            { name: "Marca 1", logo: "" },
            { name: "Marca 2", logo: "" },
            { name: "Marca 3", logo: "" },
          ],
          bottomLabel: "Pie de sección",
        },
      } as SectionFor<T>
    case "notification_club":
      return {
        ...base,
        type: "notification_club",
        props: {
          title: "Notificaciones Push",
          description:
            "Reactivá clientes sin costo. Mandales promociones, recordatorios o mensajes de cumpleaños directo al celular.",
          badges: [
            {
              brand: "AIR COFFEE",
              message:
                "¡Disfrutá un 50% de descuento en nuestro local hoy! ☕️",
            },
            {
              brand: "INNAMORATO",
              message:
                "¡Bienvenido a INNsaciables! Un club de beneficios para los incomprendidos 🍦😍",
            },
            {
              brand: "COFI JAUS",
              message:
                "Hola 🙌 ¡Estas cerca de Cofi, pasa por el local y recordá que cada 6 te regalamos 1 Café ☕️🫶",
            },
          ],
        },
      } as SectionFor<T>
    default: {
      const _exhaustive: never = type
      throw new Error(`Unknown section type: ${String(_exhaustive)}`)
    }
  }
}

/**
 * Registry of every section type the renderer understands.
 *
 * Keeping the component reference here makes it trivial to:
 * - add a new section (one file + one entry)
 * - drive the admin "add section" picker from the same source of truth
 *
 * Note: component props differ per section, so the registry uses the loose
 * `ComponentType<any>` on purpose. The `PageRenderer` narrows the union via
 * a switch so actual render sites are still fully type-safe.
 */
export type SectionType = PageSection["type"]

export type SectionRegistryEntry = {
  type: SectionType
  label: string
  description: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>
}

export const SECTION_REGISTRY: Record<SectionType, SectionRegistryEntry> = {
  hero: {
    type: "hero",
    label: "Hero",
    description: "Full-viewport hero — headline, five-thumb carousel, single CTA.",
    component: HeroSection,
  },
  hero_club: {
    type: "hero_club",
    label: "Hero Club",
    description: "Hero for the Club page — same layout as Hero.",
    component: HeroClubSection,
  },
  feature_links: {
    type: "feature_links",
    label: "Feature links",
    description: "Grid of feature cards that link to sub-pages.",
    component: FeatureLinksSection,
  },
  stats: {
    type: "stats",
    label: "Stats",
    description: "Large number + label grid.",
    component: StatsSection,
  },
  testimonials: {
    type: "testimonials",
    label: "Testimonials",
    description: "Customer quotes with author + role.",
    component: TestimonialsSection,
  },
  faq: {
    type: "faq",
    label: "FAQ",
    description: "Accordion of frequently asked questions.",
    component: FAQSection,
  },
  contact_form: {
    type: "contact_form",
    label: "Contact form",
    description: "Lead-capture form.",
    component: ContactFormSection,
  },
  cta: {
    type: "cta",
    label: "CTA",
    description: "Call to action section.",
    component: CTASection,
  },
  pricing: {
    type: "pricing",
    label: "Pricing",
    description: "Pricing cards with plans and features.",
    component: PricingSection,
  },
  productpricing: {
    type: "productpricing",
    label: "Product pricing",
    description: "Label, title, description and product cards with href.",
    component: ProductPricingSection,
  },
  club_cards: {
    type: "club_cards",
    label: "Club Cards",
    description: "Label, title, subtitle and cards grid.",
    component: ClubCardsSection,
  },
  home_products: {
    type: "home_products",
    label: "Home Products",
    description: "Label, title and hoverable products with image preview.",
    component: HomeProductsSection,
  },
  steps_club: {
    type: "steps_club",
    label: "Steps Club",
    description: "Title and steps with image, title and description (Club / product pages).",
    component: StepsClubSection,
  },
  common_cta: {
    type: "common_cta",
    label: "Common CTA",
    description: "Solid background, title, description, two CTAs and image.",
    component: CommonCTASection,
  },
  club_activation: {
    type: "club_activation",
    label: "Club activation",
    description: "Title, activation cards (image + stat + title), bottom label.",
    component: ClubActivationSection,
  },
  home_activation: {
    type: "home_activation",
    label: "Home activation",
    description: "Title, activation cards (image + stat + title), bottom label.",
    component: HomeActivationSection,
  },
  notification_club: {
    type: "notification_club",
    label: "Notification Club",
    description: "Push notifications — copy left, phone + glass badges right.",
    component: NotificationClubSection,
  },
}

/** Ordered list — handy for populating the admin UI. */
export const SECTION_TYPES = Object.keys(SECTION_REGISTRY) as SectionType[]

export function isKnownSectionType(type: string): type is SectionType {
  return type in SECTION_REGISTRY
}
