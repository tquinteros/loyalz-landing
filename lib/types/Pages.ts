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
    badges?: LocalizedString[]
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
export type NotificationClubSection = BaseSection<"notification_club", NotificationClubSectionProps>

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
