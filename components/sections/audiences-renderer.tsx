import AudiencesTabsSection from "./audiences-tabs-section"
import type { AnyPageSection, PageSection } from "@/lib/types/Pages"
import { isKnownSectionType } from "./component-map"
import { AdminSectionOverlay } from "@/components/admin/admin-section-overlay"

type Props = {
  sections: AnyPageSection[]
  pageId: string
  initialTab?: string
}

export default function AudiencesRenderer({ sections, pageId, initialTab }: Props) {
  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) return null
        if (!isKnownSectionType(section.type)) return null
        return (
          <AdminSectionOverlay key={section.id} pageId={pageId} sectionId={section.id}>
            <AudiencesSectionSwitch
              section={section as PageSection}
              initialTab={initialTab}
            />
          </AdminSectionOverlay>
        )
      })}
    </>
  )
}

function AudiencesSectionSwitch({
  section,
  initialTab,
}: {
  section: PageSection
  initialTab?: string
}) {
  const common = {
    backgroundImage: section.backgroundImage ?? null,
    className: section.className ?? null,
  }

  switch (section.type) {
    case "audiences_tabs":
      return (
        <AudiencesTabsSection
          {...section.props}
          {...common}
          initialTabKey={initialTab}
        />
      )
    default:
      return null
  }
}
