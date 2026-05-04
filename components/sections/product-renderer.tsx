import HeroClubSection from "./hero-club-section"
import PricingSection from "./pricing-section"
import ClubCardsSection from "./club-cards-section"
import StepsClubSection from "./steps-club-section"
import CommonCTASection from "./common-cta-section"
import ClubActivationSection from "./club-activation-section"
import NotificationClubSection from "./notification-club-section"
import type { AnyPageSection, PageSection } from "@/lib/types/Pages"
import { isKnownSectionType } from "./component-map"

type Props = {
  sections: AnyPageSection[]
}

export default function ProductRenderer({ sections }: Props) {
  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) return null
        if (!isKnownSectionType(section.type)) return null
        return (
          <ProductSectionSwitch
            key={section.id}
            section={section as PageSection}
          />
        )
      })}
    </>
  )
}

function ProductSectionSwitch({ section }: { section: PageSection }) {
  const common = {
    backgroundImage: section.backgroundImage ?? null,
    className: section.className ?? null,
  }

  switch (section.type) {
    case "hero_club":
      return <HeroClubSection {...section.props} {...common} />
    case "pricing":
      return <PricingSection {...section.props} {...common} />
    case "club_cards":
      return <ClubCardsSection {...section.props} {...common} />
    case "steps_club":
      return <StepsClubSection {...section.props} {...common} />
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
