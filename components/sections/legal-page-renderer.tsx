import LegalDocumentSection from "./legal-document-section"
import type {
  AnyPageSection,
  LegalDocumentSection as LegalDocumentSectionData,
} from "@/lib/types/Pages"
import { isKnownSectionType } from "./component-map"
import { AdminSectionOverlay } from "@/components/admin/admin-section-overlay"

type Props = {
  sections: AnyPageSection[]
  pageId: string
}

/**
 * Renders policy-style CMS pages (terms, privacy, cookies). Only
 * `legal_document` sections are shown; other section types are ignored so
 * editors can keep a single-purpose layout.
 */
export default function LegalPageRenderer({ sections, pageId }: Props) {
  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) return null
        if (!isKnownSectionType(section.type)) return null
        if (section.type !== "legal_document") return null
        const s = section as LegalDocumentSectionData
        const common = {
          backgroundImage: s.backgroundImage ?? null,
          className: s.className ?? null,
        }
        return (
          <AdminSectionOverlay key={s.id} pageId={pageId} sectionId={s.id}>
            <LegalDocumentSection {...s.props} {...common} />
          </AdminSectionOverlay>
        )
      })}
    </>
  )
}
