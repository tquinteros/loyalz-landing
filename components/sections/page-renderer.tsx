import HeroSection from "./hero-section"
import FeatureLinksSection from "./feature-links-section"
import StatsSection from "./stats-section"
import TestimonialsSection from "./testimonials-section"
import FAQSection from "./faq-section"
import ContactFormSection from "./contact-form-section"
import type { AnyPageSection, PageSection } from "@/lib/types/Pages"
import { isKnownSectionType } from "./component-map"
import CTASection from "./cta-section"
import PricingSection from "./pricing-section"

type Props = {
  sections: AnyPageSection[]
}

/**
 * Renders a list of page sections coming from the DB.
 *
 * Rules:
 *  - `enabled: false` sections are skipped.
 *  - Unknown section `type`s (e.g. added later in the admin but not yet shipped
 *    in this bundle) are skipped silently so the page still renders.
 *  - A switch over the union narrows `props` per section type so each
 *    component gets fully typed input.
 */
export default function PageRenderer({ sections }: Props) {
  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) return null
        if (!isKnownSectionType(section.type)) return null
        return <SectionSwitch key={section.id} section={section as PageSection} />
      })}
    </>
  )
}

function SectionSwitch({ section }: { section: PageSection }) {
  const common = {
    backgroundImage: section.backgroundImage ?? null,
    className: section.className ?? null,
  }

  switch (section.type) {
    case "hero":
      return <HeroSection {...section.props} {...common} />
    case "feature_links":
      return <FeatureLinksSection {...section.props} {...common} />
    case "stats":
      return <StatsSection {...section.props} {...common} />
    case "testimonials":
      return <TestimonialsSection {...section.props} {...common} />
    case "faq":
      return <FAQSection {...section.props} {...common} />
    case "contact_form":
      return <ContactFormSection {...section.props} {...common} />
    case "cta":
      return <CTASection {...section.props} {...common} />
    case "pricing":
      return <PricingSection {...section.props} {...common} />
    default:
      return null
  }
}
