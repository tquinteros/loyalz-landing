import HeroClubSection from "./hero-club-section"
import PricingSection from "./pricing-section"
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
    default:
      return null
  }
}
