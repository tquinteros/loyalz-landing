import HeroSection from "./hero-section"
import FeatureLinksSection from "./feature-links-section"
import StatsSection from "./stats-section"
import TestimonialsSection from "./testimonials-section"
import FAQSection from "./faq-section"
import ContactFormSection from "./contact-form-section"
import CTASection from "./cta-section"
import PricingSection from "./pricing-section"
import ClubCardsSection from "./club-cards-section"
import CommonCTASection from "./common-cta-section"
import ClubActivationSection from "./club-activation-section"
import NotificationClubSection from "./notification-club-section"
import type { AnyPageSection, PageSection } from "@/lib/types/Pages"
import { isKnownSectionType } from "./component-map"

type Props = {
  sections: AnyPageSection[]
}

export default function HomeRenderer({ sections }: Props) {
  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) return null
        if (!isKnownSectionType(section.type)) return null
        return <HomeSectionSwitch key={section.id} section={section as PageSection} />
      })}
    </>
  )
}

function HomeSectionSwitch({ section }: { section: PageSection }) {
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
    case "club_cards":
      return <ClubCardsSection {...section.props} {...common} />
    case "common_cta":
      return <CommonCTASection {...section.props} {...common} />
    case "club_activation":
      return <ClubActivationSection {...section.props} {...common} />
    case "notification_club":
      return <NotificationClubSection {...section.props} {...common} />
    default:
      return null
  }
}
