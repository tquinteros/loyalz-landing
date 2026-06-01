import HeroClubSection from "./hero-club-section"
import HeroProductSection from "./hero-product-section"
import ProductDetailSection from "./product-detail-section"
import ProductStepsSection from "./product-steps-section"
import PricingClubAiSection from "./pricing-club-ai-section"
import PricingSection from "./pricing-section"
import ClubCardsSection from "./club-cards-section"
import StepsClubSection from "./steps-club-section"
import CommonCTASection from "./common-cta-section"
import ClubActivationSection from "./club-activation-section"
import NotificationClubSection from "./notification-club-section"
import LegalDocumentSection from "./legal-document-section"
import ProductCtaImageSection from "./product-cta-image-section"
import ProductClubBenefitsSection from "./product-club-benefits-section"
import ProductClubNotificationsSection from "./product-club-notifications-section"
import TestimonialsSecondarySection from "./testimonials-secondary-section"
import ReviewsPricingSection from "./reviews-pricing-section"
import ProductDashboardSection from "./product-dashboard-section"
import ProductHowItWorksSection from "./product-how-it-works-section"
import ProductMechanicsSection from "./product-mechanics-section"
import ProductInformationSection from "./product-information-section"
import type { AnyPageSection, PageSection } from "@/lib/types/Pages"
import { isKnownSectionType } from "./component-map"
import { AdminSectionOverlay } from "@/components/admin/admin-section-overlay"

type Props = {
  sections: AnyPageSection[]
  pageId: string
}

export default function ProductRenderer({ sections, pageId }: Props) {
  return (
    <>
      {sections.map((section) => {
        if (!section.enabled) return null
        if (!isKnownSectionType(section.type)) return null
        return (
          <AdminSectionOverlay key={section.id} pageId={pageId} sectionId={section.id}>
            <ProductSectionSwitch section={section as PageSection} />
          </AdminSectionOverlay>
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
    case "hero_product":
      return <HeroProductSection {...section.props} {...common} />
    case "product_detail":
      return <ProductDetailSection {...section.props} {...common} />
    case "product_steps":
      return <ProductStepsSection {...section.props} {...common} />
    case "pricing_club_ai":
      return <PricingClubAiSection {...section.props} {...common} />
    case "reviews_pricing":
      return <ReviewsPricingSection {...section.props} {...common} />
    case "common_cta":
      return <CommonCTASection {...section.props} {...common} />
    case "legal_document":
      return <LegalDocumentSection {...section.props} {...common} />
    case "product_mechanics":
      return <ProductMechanicsSection {...section.props} {...common} />
    case "product_how_it_works":
      return <ProductHowItWorksSection {...section.props} {...common} />
    case "product_dashboard":
      return <ProductDashboardSection {...section.props} {...common} />
    case "product_cta_image":
      return <ProductCtaImageSection {...section.props} {...common} />
    case "product_club_benefits":
      return <ProductClubBenefitsSection {...section.props} {...common} />
    case "product_club_notifications":
      return <ProductClubNotificationsSection {...section.props} {...common} />
    case "testimonials_secondary":
      return <TestimonialsSecondarySection {...section.props} {...common} />
    case "product_information":
      return <ProductInformationSection {...section.props} {...common} />
    default:
      return null
  }
}
