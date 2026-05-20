import AudiencesTabsSection from "./audiences-tabs-section"
import type { AnyPageSection, PageSection } from "@/lib/types/Pages"
import { isKnownSectionType } from "./component-map"
import { AdminSectionOverlay } from "@/components/admin/admin-section-overlay"

type Props = {
  sections: AnyPageSection[]
  pageId: string
}

export default function AudiencesRenderer({ sections, pageId }: Props) {
  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) return null
        if (!isKnownSectionType(section.type)) return null
        return (
          <AdminSectionOverlay key={section.id} pageId={pageId} sectionId={section.id}>
            <AudiencesSectionSwitch section={section as PageSection} />
          </AdminSectionOverlay>
        )
      })}
    </>
  )
}

function AudiencesSectionSwitch({ section }: { section: PageSection }) {
  const common = {
    backgroundImage: section.backgroundImage ?? null,
    className: section.className ?? null,
  }

  switch (section.type) {
    case "audiences_tabs":
      return <AudiencesTabsSection {...section.props} {...common} />
    default:
      return null
  }
}
