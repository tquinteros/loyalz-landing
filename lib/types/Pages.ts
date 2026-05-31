import type { TipTapDocument } from "@/lib/types/content"

/**
 * Page / Section types for the DB-driven page renderer.
 *
 * A `Page` is identified by a unique `slug` and stores its layout as an
 * ordered array of `Section` objects in the `sections` JSONB column.
 *
 * Each section is a discriminated union on `type`, so rendering code can
 * narrow the shape of `props` based on which component it maps to.
 */

export type LocalizedString = {
  es?: string
  en?: string
}

export type CTA = {
  label: LocalizedString
  href: string
}

/** Fields that every section shares. */
type BaseSection<TType extends string, TProps> = {
  /** Stable id (used as React key and for admin editing). */
  id: string
  /** Discriminator — maps to a component in the componentMap. */
  type: TType
  /** When false, the renderer skips this section. */
  enabled: boolean
  /** Optional background image for the whole section. */
  backgroundImage?: string | null
  /** Optional raw CSS class overrides (advanced / admin). */
  className?: string | null
  /** Type-specific content. */
  props: TProps
}

export type HeroSectionProps = {
  title: LocalizedString
  /** Carousel slides (URLs or paths). Five cells are shown; the center cell is visually emphasized. */
  images: string[]
  ctaLabel: LocalizedString
  ctaHref: string
  secondaryCta?: CTA
}

export type HeroClubSectionProps = {
  title: LocalizedString
  subtitle: LocalizedString
  image: string
  primaryCta: CTA
}

export type FeatureLinksSectionProps = {
  title?: LocalizedString
  subtitle?: LocalizedString
  items: Array<{
    icon?: string
    title: LocalizedString
    description?: LocalizedString
    href?: string
  }>
}

export type StatsSectionProps = {
  title?: LocalizedString
  subtitle?: LocalizedString
  items: Array<{
    /** Numeric / symbolic display value (e.g. "+4x"); not translated. */
    value: string
    label: LocalizedString
  }>
}

export type TestimonialsSectionProps = {
  title?: LocalizedString
  subtitle?: LocalizedString
  items: Array<{
    summary: LocalizedString
    /** Author name — typically not translated. */
    author: string
    place?: LocalizedString
    avatar?: string
    logo?: string
    /** Optional image painted behind the testimonial card content. */
    backgroundImage?: string
    /** Legacy fields kept so previously saved page JSON keeps rendering. */
    quote?: LocalizedString | string
    role?: LocalizedString | string
  }>
}

export type FAQSectionProps = {
  title?: LocalizedString
  subtitle?: LocalizedString
  image?: string
  helpTitle?: LocalizedString
  helpDescription?: LocalizedString
  helpCtaLabel?: LocalizedString
  helpCtaHref?: string
  items: Array<{
    question: LocalizedString
    answer: LocalizedString
  }>
}

export type ContactFormSectionProps = {
  title?: LocalizedString
  subtitle?: LocalizedString
  submitLabel?: LocalizedString
}

export type CTASectionProps = {
  title?: LocalizedString
  label?: LocalizedString
}

export type PricingSectionProps = {
  label?: LocalizedString
  title?: LocalizedString
  description?: LocalizedString
  bottomMessage?: LocalizedString
  cards: Array<{
    title: LocalizedString
    /** Display price string (e.g. "$79"); kept as plain string. */
    price: string
    shops: LocalizedString
    /** Savings token (e.g. "19%"); kept as plain string. */
    savings: string
    features: LocalizedString[]
  }>
}

/** Which product page this pricing block targets — drives card styling. */
export type PricingClubAiProduct = "club" | "ai"

export type PricingClubAiCardItem = {
  title: LocalizedString
  price: string
  shops: LocalizedString
  savings: string
  features: LocalizedString[]
}

export type PricingClubAiSectionProps = {
  product: PricingClubAiProduct
  label?: LocalizedString
  title?: LocalizedString
  description?: LocalizedString
  bottomMessage?: LocalizedString
  cards: PricingClubAiCardItem[]
}

export type ProductPricingSectionProps = {
  label?: LocalizedString
  title?: LocalizedString
  description?: LocalizedString

  cards: Array<{
    price: number

    title: LocalizedString
    description: LocalizedString
    ctaLabel: LocalizedString

    href: string
    color: string
  }>
}

export type ClubCardsSectionProps = {
  label?: LocalizedString
  title?: LocalizedString
  subtitle?: LocalizedString
  cards: Array<{
    title: LocalizedString
    description?: LocalizedString
  }>
}

export type HomeProductsSectionProps = {
  label?: LocalizedString
  title: LocalizedString
  products: Array<{
    title: LocalizedString
    subtitle: LocalizedString
    description: LocalizedString
    color: string
    image: string
    /** Internal page slug or path (e.g. `club` → `/club`). */
    href?: string
  }>
}

/** Home — infinite horizontal marquee of partner / customer brand logos. */
export type BrandMarqueeSectionProps = {
  title?: LocalizedString
  brands: Array<{
    /** Brand display name. Not translated; used as `alt` and admin label. */
    name?: string
    logo: string
  }>
}

/** Home — solutions showcase: label + title, 3-col image grid with captions, two CTAs. */
export type HomeSolutionsSectionProps = {
  label?: LocalizedString
  title: LocalizedString
  images: Array<{
    url: string
    caption?: LocalizedString
  }>
  primaryCtaLabel: LocalizedString
  primaryCtaHref: string
  secondaryCtaLabel: LocalizedString
  secondaryCtaHref: string
}

/** Product (Club) page — titled steps with image + copy per step. */
export type StepsClubSectionProps = {
  title: LocalizedString
  steps: Array<{
    title: LocalizedString
    description: LocalizedString
    image: string
  }>
}

/** Shared CTA band — solid background color + copy + two CTAs + image. */
export type CommonCTASectionProps = {
  /** CSS color string, e.g. `#754390` or `rgb(117 67 144)`. */
  backgroundColor: string
  title: LocalizedString
  description: LocalizedString
  firstCta: CTA
  secondCta: CTA
  image: string
}

/** Club — activation grid cards with image backgrounds + overlay copy + footer label. */
export type ClubActivationSectionProps = {
  title: LocalizedString
  activationCards: Array<{
    image: string
    /** Numeric display value (e.g. "+4x"); not translated. */
    stat: string
    title: LocalizedString
    description?: LocalizedString
  }>
  bottomLabel: LocalizedString
}

/** Home — activation grid cards with image backgrounds + overlay copy + footer label. */
export type HomeActivationSectionProps = {
  title: LocalizedString
  activationCards: Array<{
    image: string
    /** Numeric display value (e.g. "+4x"); not translated. */
    stat: string
    title: LocalizedString
    description?: LocalizedString
  }>
  brands: Array<{
    /** Brand display name — typically not translated. */
    name: string
    logo: string
  }>
  bottomLabel: LocalizedString
}

/** Home — iPad mockup with floating stat cards at corners + title band below. */
export type HomeAutonomySectionProps = {
  title: LocalizedString
  stats: Array<{
    title: LocalizedString
    description?: LocalizedString
    statText: LocalizedString
  }>
}

/** Home — full-bleed background, headline left, infinite vertical marquee of support cards right. */
export type HomeSupportSectionProps = {
  title: LocalizedString
  subtitle?: LocalizedString
  supports: Array<{
    title: LocalizedString
    description: LocalizedString
  }>
}

/** Home — integrations showcase: label, copy, hero image, feature grid with brand colors. */
export type HomeIntegrationsSectionProps = {
  label?: LocalizedString
  title: LocalizedString
  description?: LocalizedString
  image: string
  infoFeatures: LocalizedString
  features: Array<{
    title: LocalizedString
    /** CSS hex color for icon background, border, and title, e.g. "#754390". */
    backgroundColor: string
    description: LocalizedString
  }>
}

/** Home — business types showcase: label + title + description, business cards grid, CTAs, stats grid. */
export type HomeBusinessSectionProps = {
  label?: LocalizedString
  title: LocalizedString
  description?: LocalizedString
  businessCards: Array<{
    image: string
    title: LocalizedString
    description: LocalizedString
  }>
  primaryCta: CTA
  secondaryCta: CTA
  stats: Array<{
    image: string
    title: LocalizedString
    /** Display stat token (e.g. "+30%", "4x"); not translated. */
    stat: string
    /** CSS color string for the stat band background, e.g. "#754390". */
    backgroundColorCard: string
  }>
}

/** Club — push notifications showcase with phone mockup + glass badges. */
export type NotificationClubSectionProps = {
  title: LocalizedString
  description: LocalizedString
  badges: Array<{
    /** Brand display name — typically not translated. */
    brand: string
    message: LocalizedString
  }>
}

/**
 * Shared layout for policy pages (terms, privacy, cookies): localized title
 * and intro, plus TipTap JSON per locale (same shape as blog `content`).
 */
export type LegalDocumentSectionProps = {
  title: LocalizedString
  description: LocalizedString
  body: {
    es?: TipTapDocument | null
    en?: TipTapDocument | null
  }
}

/** About page — hero with title, description and image carousel. */
export type AboutHeroSectionProps = {
  title: LocalizedString
  description: LocalizedString
  images: string[]
}

/** About page — visual separator with a single title. */
export type AboutSeparatorSectionProps = {
  title: LocalizedString
}

/** About page — "us" block: copy, quoted articles, image grid. */
export type AboutUsSectionProps = {
  title: LocalizedString
  description: LocalizedString
  /** Short pull-quotes or article blurbs (one per locale). */
  articles: LocalizedString[]
  bottomLabel: LocalizedString
  images: string[]
}

/** About page — stats with a single supporting image. */
export type AboutStatsSectionProps = {
  title: LocalizedString
  description: LocalizedString
  image: string
  stats: Array<{
    /** Display value (e.g. "+100k"); not translated. */
    stat: string
    statLabel: LocalizedString
  }>
}

/** About page — team members grid. */
export type AboutTeamSectionProps = {
  title: LocalizedString
  description: LocalizedString
  team: Array<{
    avatarImage: string
    /** Proper noun — not translated. */
    fullName: string
    role: LocalizedString
    description: LocalizedString
  }>
}

/** Audience problem solution item. */
export type AudienceSolutionItem = {
  label?: LocalizedString
  title: LocalizedString
  description: LocalizedString
  /** CSS hex color for the card background, e.g. `#F8F5EF`. */
  backgroundColor: string
}

/** Audience problem block inside a tab. */
export type AudienceProblemProps = {
  label?: LocalizedString
  title: LocalizedString
  description: LocalizedString
  solutions: AudienceSolutionItem[]
}

/** Single step inside an audiences tab steps block. */
export type AudienceStepItem = {
  title: LocalizedString
  description: LocalizedString
  /** Image URL for the step. */
  image: string
  /** CSS hex color for the step card background, e.g. `#F8F5EF`. */
  backgroundColor: string
}

/** Steps block inside an audiences tab (title + colored step cards). */
export type AudienceStepsProps = {
  title: LocalizedString
  steps: AudienceStepItem[]
}

/** Floating stat card around the mobile mockup. */
export type AudienceMobileStatItem = {
  /** Small heading above the value, e.g. "Clientes fidelizados". */
  title: LocalizedString
  /** Display value, e.g. "158" or "$ 16". */
  stat: LocalizedString
  /** Optional pill below the value, e.g. "109 beneficios activos". */
  label?: LocalizedString
}

/** Mobile showcase block — stats around phone + bottom title banner. */
export type AudienceMobileProps = {
  title: LocalizedString
  stats: AudienceMobileStatItem[]
}

/** Detail card inside the audiences ecosystem block. */
export type AudienceEcosystemDetailItem = {
  /** CSS hex color for the card background. */
  backgroundColor: string
  label?: LocalizedString
  title: LocalizedString
  description: LocalizedString
}

/** Ecosystem block — header, colored detail cards, bottom label + CTA. */
export type AudienceEcosystemProps = {
  label?: LocalizedString
  title: LocalizedString
  description: LocalizedString
  details: AudienceEcosystemDetailItem[]
  bottomLabel?: LocalizedString
  bottomCtaLabel: LocalizedString
  bottomCtaHref: string
}

/** Feature card inside the audiences demo block. */
export type AudienceDemoFeatureItem = {
  title: LocalizedString
  description: LocalizedString
}

/** Demo block — hero with image + infinite feature carousel on a colored surface. */
export type AudienceDemoProps = {
  /** CSS hex color for the full-bleed section background. */
  backgroundColor: string
  label?: LocalizedString
  title: LocalizedString
  description: LocalizedString
  ctaLabel: LocalizedString
  ctaHref: string
  image: string
  features: AudienceDemoFeatureItem[]
}

/** Information block — 7/5 grid hero with colored panel + image. */
export type AudienceInformationProps = {
  /** Left panel background (hex). */
  backgroundColor: string
  /** Title and description color (hex); same family as the panel accent. */
  textColor: string
  title: LocalizedString
  description: LocalizedString
  image: string
}

/** Pricing card inside the audiences pricing block. */
export type AudiencePricingCardItem = {
  /** Display price (e.g. "29" or "0" for free). */
  price: string
  title: LocalizedString
  label: LocalizedString
  description: LocalizedString
  backgroundColor: string
}

/** Pricing block — header + colored pricing cards. */
export type AudiencePricingProps = {
  label?: LocalizedString
  title: LocalizedString
  description: LocalizedString
  pricingCards: AudiencePricingCardItem[]
}

/**
 * Single tab item for the audiences page.
 *
 * Logically split into blocks (see `AUDIENCE_TAB_PANELS` in `lib/audiences/tab-blocks.ts`).
 * Stored as one JSON object per tab — no DB migration when adding blocks.
 */
export type AudienceTabItem = {
  /** Non-translated discriminator key, e.g. "cafes". Not shown to end users. */
  key: string

  /* --- Block: general (tab bar) --- */
  tabLabel: LocalizedString

  /* --- Block: carousel --- */
  images: string[]

  /* --- Block: separator --- */
  separatorText: LocalizedString
  label?: LocalizedString
  /** Legacy field; kept for alt text on carousel. */
  title: LocalizedString

  /* --- Block: marquee --- */
  brandMarqueeTitle?: LocalizedString
  brands: Array<{
    name?: string
    logo: string
  }>

  /* --- Block: problem --- */
  audienceProblem: AudienceProblemProps

  /* --- Block: steps --- */
  audienceSteps?: AudienceStepsProps

  /* --- Block: mobile --- */
  audienceMobile?: AudienceMobileProps

  /* --- Block: ecosystem --- */
  audienceEcosystem?: AudienceEcosystemProps

  /* --- Block: demo --- */
  audienceDemo?: AudienceDemoProps

  /* --- Block: information --- */
  audienceInformation?: AudienceInformationProps

  /* --- Block: pricing --- */
  audiencePricing?: AudiencePricingProps
}

/** Audiences page — tabbed content for cafes, restaurantes, delivery-first. */
export type AudiencesTabsSectionProps = {
  /** Main page title rendered above the tab bar. */
  title: LocalizedString
  tabs: AudienceTabItem[]
}

/**
 * Shared hero for product pages (AI, POS, Reviews, Club).
 * Includes an optional embedded brand marquee strip below the CTA area.
 */
export type HeroProductSectionProps = {
  label?: LocalizedString
  title: LocalizedString
  description?: LocalizedString
  /** Hero product image URL. */
  image: string
  primaryCta: CTA
  secondaryCta?: CTA
  /** CSS hex color for the title text, e.g. "#8C7F1F". */
  titleColor?: string
  /** Optional heading shown above the brand marquee strip. */
  brandMarqueeTitle?: LocalizedString
  brands?: Array<{
    /** Brand display name — not translated; used as alt text. */
    name?: string
    logo: string
  }>
}

/**
 * Shared stats/details block for product pages.
 * Renders a label, title, and a grid of stat + description pairs.
 * Background color can be customised per product via a hex string.
 */
export type ProductDetailSectionProps = {
  label?: LocalizedString
  title: LocalizedString
  details: Array<{
    /** Display stat token (e.g. "+4x", "100k"); not translated. */
    stat: string
    description: LocalizedString
  }>
  /** CSS hex color for the section background, e.g. "#754390". */
  backgroundColor?: string
}

/** Shared interactive steps block for product pages (hover image + numbered steps + CTAs). */
export type ProductStepsStepItem = {
  title: LocalizedString
  description: LocalizedString
  /** Image shown in the left preview when this step is hovered. */
  image: string
  /** CSS hex color for hover accent on step copy and left border, e.g. `#754390`. */
  backgroundColor: string
}

export type ProductStepsSectionProps = {
  title: LocalizedString
  steps: ProductStepsStepItem[]
  primaryCta: CTA
  secondaryCta?: CTA
}

/** Product page — phone mockup with floating stats + bottom title banner. */
export type ProductMechanicsProduct = "club" | "reviews" | "ai"

export type ProductMechanicsStatItem = {
  title: LocalizedString
  stat: LocalizedString
  label?: LocalizedString
}

export type ProductMechanicsSectionProps = {
  /** Which product screen to show inside the phone case. */
  product: ProductMechanicsProduct
  /** Bottom banner title (supports line breaks). */
  title: LocalizedString
  /** CSS hex background for the whole section. */
  backgroundColor?: string
  /** CSS hex background for the bottom title banner. */
  bottomLabelBackground?: string
  stats: ProductMechanicsStatItem[]
}

/** Product page — "how it works" block: title, fanned images + floating stat badges. */
export type ProductHowItWorksStatItem = {
  /** Display stat value (e.g. "+15", "★★★★★", "50%"). Not translated. */
  stat: string
  title: LocalizedString
}

export type ProductHowItWorksSectionProps = {
  title: LocalizedString
  /** CSS hex background color for the whole section, e.g. `#F8F5EF`. */
  backgroundColor?: string
  /** Up to 3 image URLs shown in the fanned card layout. */
  images: string[]
  /** Up to 4 floating stat badges overlaid on the image fan. */
  stats: ProductHowItWorksStatItem[]
}

/** Product page — dashboard showcase: label, title, image, subtitle, feature cards, two CTAs. */
export type ProductDashboardFeatureItem = {
  title: LocalizedString
  description: LocalizedString
}

export type ProductDashboardSectionProps = {
  label?: LocalizedString
  title: LocalizedString
  /** Product screenshot / dashboard image URL. */
  image: string
  subtitle?: LocalizedString
  features: ProductDashboardFeatureItem[]
  /** CSS hex color for feature card text, border accent, and icon badge background, e.g. `#754390`. */
  color: string
  primaryCta: CTA
  secondaryCta?: CTA
}

/** Product page — full-bleed background image with centered title and a styled label badge. */
export type ProductCtaImageSectionProps = {
  title: LocalizedString
  label?: LocalizedString
  /** CSS hex color for the label badge background, e.g. `#DBC5E8`. */
  labelBackgroundColor?: string
}

/** Product Club page — benefits grid with icon cards and two CTAs on a colored background. */
export type ProductClubBenefitsItem = {
  title: LocalizedString
  description: LocalizedString
}

export type ProductClubBenefitsSectionProps = {
  /** CSS hex color for the section background and card copy, e.g. `#754390`. */
  backgroundColor?: string
  title: LocalizedString
  benefits: ProductClubBenefitsItem[]
  primaryCta: CTA
  secondaryCta?: CTA
}

export type HeroSection = BaseSection<"hero", HeroSectionProps>
export type HeroClubSection = BaseSection<"hero_club", HeroClubSectionProps>
export type FeatureLinksSection = BaseSection<"feature_links", FeatureLinksSectionProps>
export type StatsSection = BaseSection<"stats", StatsSectionProps>
export type TestimonialsSection = BaseSection<"testimonials", TestimonialsSectionProps>
export type FAQSection = BaseSection<"faq", FAQSectionProps>
export type ContactFormSection = BaseSection<"contact_form", ContactFormSectionProps>
export type CTASection = BaseSection<"cta", CTASectionProps>
export type PricingSection = BaseSection<"pricing", PricingSectionProps>
export type ProductPricingSection = BaseSection<"productpricing", ProductPricingSectionProps>
export type ClubCardsSection = BaseSection<"club_cards", ClubCardsSectionProps>
export type HomeProductsSection = BaseSection<"home_products", HomeProductsSectionProps>
export type HomeSolutionsSection = BaseSection<"home_solutions", HomeSolutionsSectionProps>
export type BrandMarqueeSection = BaseSection<"brand_marquee", BrandMarqueeSectionProps>
export type StepsClubSection = BaseSection<"steps_club", StepsClubSectionProps>
export type CommonCTASection = BaseSection<"common_cta", CommonCTASectionProps>
export type ClubActivationSection = BaseSection<"club_activation", ClubActivationSectionProps>
export type HomeActivationSection = BaseSection<"home_activation", HomeActivationSectionProps>
export type HomeBusinessSection = BaseSection<"home_business", HomeBusinessSectionProps>
export type HomeIntegrationsSection = BaseSection<"home_integrations", HomeIntegrationsSectionProps>
export type HomeAutonomySection = BaseSection<"home_autonomy", HomeAutonomySectionProps>
export type HomeSupportSection = BaseSection<"home_support", HomeSupportSectionProps>
export type NotificationClubSection = BaseSection<"notification_club", NotificationClubSectionProps>
export type LegalDocumentSection = BaseSection<"legal_document", LegalDocumentSectionProps>
export type AboutHeroSection = BaseSection<"about_hero", AboutHeroSectionProps>
export type AboutSeparatorSection = BaseSection<"about_separator", AboutSeparatorSectionProps>
export type AboutUsSection = BaseSection<"about_us", AboutUsSectionProps>
export type AboutStatsSection = BaseSection<"about_stats", AboutStatsSectionProps>
export type AboutTeamSection = BaseSection<"about_team", AboutTeamSectionProps>
export type AudiencesTabsSection = BaseSection<"audiences_tabs", AudiencesTabsSectionProps>
export type HeroProductSection = BaseSection<"hero_product", HeroProductSectionProps>
export type ProductDetailSection = BaseSection<"product_detail", ProductDetailSectionProps>
export type ProductStepsSection = BaseSection<"product_steps", ProductStepsSectionProps>
export type PricingClubAiSection = BaseSection<
  "pricing_club_ai",
  PricingClubAiSectionProps
>
export type ProductMechanicsSection = BaseSection<"product_mechanics", ProductMechanicsSectionProps>
export type ProductHowItWorksSection = BaseSection<"product_how_it_works", ProductHowItWorksSectionProps>
export type ProductDashboardSection = BaseSection<"product_dashboard", ProductDashboardSectionProps>
export type ProductCtaImageSection = BaseSection<"product_cta_image", ProductCtaImageSectionProps>
export type ProductClubBenefitsSection = BaseSection<
  "product_club_benefits",
  ProductClubBenefitsSectionProps
>

/** Union of every supported section type. Extend this to add new section kinds. */
export type PageSection =
  | HeroSection
  | HeroClubSection
  | FeatureLinksSection
  | StatsSection
  | TestimonialsSection
  | FAQSection
  | ContactFormSection
  | CTASection
  | PricingSection
  | ProductPricingSection
  | ClubCardsSection
  | HomeProductsSection
  | HomeSolutionsSection
  | BrandMarqueeSection
  | StepsClubSection
  | CommonCTASection
  | ClubActivationSection
  | HomeActivationSection
  | NotificationClubSection
  | HomeBusinessSection
  | HomeIntegrationsSection
  | HomeAutonomySection
  | HomeSupportSection
  | LegalDocumentSection
  | AboutHeroSection
  | AboutSeparatorSection
  | AboutUsSection
  | AboutStatsSection
  | AboutTeamSection
  | AudiencesTabsSection
  | HeroProductSection
  | ProductDetailSection
  | ProductStepsSection
  | PricingClubAiSection
  | ProductMechanicsSection
  | ProductHowItWorksSection
  | ProductDashboardSection
  | ProductCtaImageSection
  | ProductClubBenefitsSection

/**
 * Fallback type for sections that come from the DB but whose `type` is not
 * (yet) known to the client bundle. The renderer will skip these gracefully.
 */
export type UnknownSection = BaseSection<string, Record<string, unknown>>

export type AnyPageSection = PageSection | UnknownSection

export type Page = {
  id: string
  slug: string
  type: string | null
  title: string
  sections: AnyPageSection[]
  status: string | null
  seo_title: string | null
  seo_description: string | null
  created_at: string | null
  updated_at: string | null
}

export type PageVersion = {
  id: string
  page_id: string
  title: string
  slug: string
  sections: AnyPageSection[]
  status: string | null
  seo_title: string | null
  seo_description: string | null
  page_created_at: string | null
  page_updated_at: string | null
  snapshot_at: string
  created_by: string | null
}

/**
 * Shape used by the admin "create / edit page" dialog. Sections are managed
 * by their own dedicated editor, so this form only covers page metadata.
 */
export type PageFormValues = {
  title: string
  slug: string
  status: "draft" | "published"
  seo_title: string
  seo_description: string
}
