import type { ComponentType } from "react"
import HeroSection from "./hero-section"
import FeatureLinksSection from "./feature-links-section"
import StatsSection from "./stats-section"
import TestimonialsSection from "./testimonials-section"
import FAQSection from "./faq-section"
import ContactFormSection from "./contact-form-section"
import type { PageSection } from "@/lib/types/Pages"
import CTASection from "./cta-section"
import PricingSection from "./pricing-section"

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
          title: "New hero section",
          subtitle: "",
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
              quote: "An amazing product.",
              author: "Jane Doe",
              role: "CEO, Acme",
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
    description: "Large headline, subtitle and CTAs.",
    component: HeroSection,
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
}

/** Ordered list — handy for populating the admin UI. */
export const SECTION_TYPES = Object.keys(SECTION_REGISTRY) as SectionType[]

export function isKnownSectionType(type: string): type is SectionType {
  return type in SECTION_REGISTRY
}
