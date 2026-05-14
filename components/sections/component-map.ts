import type { ComponentType } from "react"
import HeroSection from "./hero-section"
import HeroClubSection from "./hero-club-section"
import FeatureLinksSection from "./feature-links-section"
import StatsSection from "./stats-section"
import TestimonialsSection from "./testimonials-section"
import FAQSection from "./faq-section"
import ContactFormSection from "./contact-form-section"
import type { PageSection } from "@/lib/types/Pages"
import CTASection from "./cta-section"
import PricingSection from "./pricing-section"
import ProductPricingSection from "./product-pricing-section"
import ClubCardsSection from "./club-cards-section"
import HomeProductsSection from "./home-products-section"
import HomeSolutionsSection from "./home-solutions-section"
import BrandMarqueeSection from "./brand-marquee-section"
import StepsClubSection from "./steps-club-section"
import CommonCTASection from "./common-cta-section"
import ClubActivationSection from "./club-activation-section"
import HomeActivationSection from "./home-activation-section"
import NotificationClubSection from "./notification-club-section"
import HomeBusinessSection from "./home-business-section"
import HomeAutonomySection from "./home-autonomy-section"
import HomeSupportSection from "./home-support-section"

/**
 * Deterministic factory for a new section of a given type. Used by the admin
 * "Add section" picker so every new entry has a fully-populated `props`
 * object that matches the component's expected shape.
 */
type SectionFor<T extends PageSection["type"]> = Extract<PageSection, { type: T }>

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `sec-${Math.random().toString(36).slice(2, 10)}`
}

export function createDefaultSection<T extends PageSection["type"]>(
  type: T,
): SectionFor<T> {
  const base = {
    id: makeId(),
    enabled: true,
    backgroundImage: null,
    className: null,
  }
  switch (type) {
    case "hero":
      return {
        ...base,
        type: "hero",
        props: {
          title: {
            es: "El sistema all-in-one para hacer crecer tu negocio.",
            en: "The all-in-one system to grow your business.",
          },
          images: ["/club.png", "/club.png", "/club.png", "/club.png", "/club.png"],
          ctaLabel: { es: "Demo Gratis", en: "Free Demo" },
          ctaHref: "/contact",
        },
      } as SectionFor<T>
    case "hero_club":
      return {
        ...base,
        type: "hero_club",
        props: {
          title: { es: "Nueva sección Hero Club", en: "New Hero Club section" },
          subtitle: { es: "", en: "" },
          image: "",
          primaryCta: {
            label: { es: "Empezar", en: "Get started" },
            href: "/contact",
          },
        },
      } as SectionFor<T>
    case "feature_links":
      return {
        ...base,
        type: "feature_links",
        props: {
          title: { es: "Funcionalidades", en: "Features" },
          subtitle: { es: "", en: "" },
          items: [
            {
              icon: "sparkles",
              title: { es: "Funcionalidad uno", en: "Feature one" },
              description: { es: "", en: "" },
            },
            {
              icon: "zap",
              title: { es: "Funcionalidad dos", en: "Feature two" },
              description: { es: "", en: "" },
            },
          ],
        },
      } as SectionFor<T>
    case "stats":
      return {
        ...base,
        type: "stats",
        props: {
          title: { es: "Nuestros números", en: "Our numbers" },
          items: [
            { value: "100+", label: { es: "Clientes", en: "Customers" } },
            { value: "24/7", label: { es: "Soporte", en: "Support" } },
          ],
        },
      } as SectionFor<T>
    case "testimonials":
      return {
        ...base,
        type: "testimonials",
        props: {
          title: {
            es: "Lo que dicen nuestros clientes",
            en: "What people are saying",
          },
          items: [
            {
              logo: "",
              backgroundImage: "",
              summary: {
                es: "Un producto increíble.",
                en: "An amazing product.",
              },
              author: "Jane Doe",
              place: { es: "Acme", en: "Acme" },
              avatar: "",
            },
          ],
        },
      } as SectionFor<T>
    case "faq":
      return {
        ...base,
        type: "faq",
        props: {
          title: {
            es: "Preguntas frecuentes",
            en: "Frequently asked questions",
          },
          image: "",
          helpTitle: {
            es: "¿Aún tenés dudas?",
            en: "Still have questions?",
          },
          helpDescription: {
            es: "Hablá con nuestro equipo y descubrí todo sobre Loyalz.",
            en: "Talk to our team and learn everything about Loyalz.",
          },
          helpCtaLabel: { es: "Contactanos", en: "Contact us" },
          helpCtaHref: "/contact",
          items: [
            {
              question: {
                es: "¿Una pregunta común?",
                en: "A common question?",
              },
              answer: { es: "La respuesta.", en: "The answer." },
            },
          ],
        },
      } as SectionFor<T>
    case "contact_form":
      return {
        ...base,
        type: "contact_form",
        props: {
          title: { es: "Hablá con nosotros", en: "Get in touch" },
          subtitle: { es: "", en: "" },
          submitLabel: { es: "Enviar", en: "Send" },
        },
      } as SectionFor<T>
    case "cta":
      return {
        ...base,
        type: "cta",
        props: {
          title: {
            es: "¿Listo para empezar?",
            en: "Ready to get started?",
          },
          label: { es: "Contactanos", en: "Contact us" },
        },
      } as SectionFor<T>
    case "pricing":
      return {
        ...base,
        type: "pricing",
        props: {
          label: { es: "Planes", en: "Plans" },
          title: {
            es: "Precios simples para cada equipo",
            en: "Simple pricing for every team",
          },
          description: {
            es: "Elegí el plan que mejor se adapta a tu negocio.",
            en: "Pick the plan that best fits your business.",
          },
          bottomMessage: {
            es: "POS + Pay están incluidos en todos los planes.",
            en: "POS + Pay are included in all plans.",
          },
          cards: [
            {
              title: { es: "Starter", en: "Starter" },
              price: "$79",
              shops: { es: "Hasta 1 local", en: "Up to 1 shop" },
              savings: "19%",
              features: [
                { es: "Club", en: "Club" },
                { es: "Reviews", en: "Reviews" },
                { es: "POS", en: "POS" },
                { es: "Pay", en: "Pay" },
              ],
            },
            {
              title: { es: "Growth", en: "Growth" },
              price: "$349",
              shops: { es: "Hasta 3 locales", en: "Up to 3 shops" },
              savings: "22%",
              features: [
                { es: "Club", en: "Club" },
                { es: "Reviews", en: "Reviews" },
                { es: "POS", en: "POS" },
                { es: "Pay", en: "Pay" },
                { es: "AI Pro", en: "AI Pro" },
              ],
            },
          ],
        },
      } as SectionFor<T>
    case "productpricing":
      return {
        ...base,
        type: "productpricing",
        props: {
          label: { es: "Nuestros productos", en: "Our products" },
          title: {
            es: "Los precios claros. Como todo en Loyalz.",
            en: "Clear pricing. Just like everything at Loyalz.",
          },
          description: {
            es: "Empeza con lo que necesitas hoy. Escala cuando quieras.",
            en: "Start with what you need today. Scale whenever you want.",
          },
          cards: [
            {
              price: 19,
              title: { es: "Loyalz club", en: "Loyalz club" },
              description: {
                es: "Mantené más visitas de tus clientes con la fidelizacion.",
                en: "Keep your customers coming back with loyalty.",
              },
              href: "/club",
              ctaLabel: { es: "Explorar Club", en: "Explore Club" },
              color: "#754390",
            },
            {
              price: 19,
              title: { es: "Loyalz reviews", en: "Loyalz reviews" },
              description: {
                es: "Más reseñas positivas en Google sin tener que pedirlas.",
                en: "More positive Google reviews without having to ask.",
              },
              href: "/reviews",
              ctaLabel: { es: "Explorar Reviews", en: "Explore Reviews" },
              color: "#8C7F1F",
            },
            {
              price: 0,
              title: { es: "Loyalz pos", en: "Loyalz pos" },
              description: {
                es: "Obtené los datos de tus clientes de forma automatica.",
                en: "Get your customers' data automatically.",
              },
              href: "/pos",
              ctaLabel: { es: "Explorar Pos", en: "Explore Pos" },
              color: "#EC491E",
            },
            {
              price: 19,
              title: { es: "Loyalz ai", en: "Loyalz ai" },
              description: {
                es: "Tu asistente que responde, reactiva y vende 24/7.",
                en: "Your assistant that replies, re-engages and sells 24/7.",
              },
              href: "/ai",
              ctaLabel: { es: "Explorar AI", en: "Explore AI" },
              color: "#013662",
            },
          ],
        },
      } as SectionFor<T>
    case "club_cards":
      return {
        ...base,
        type: "club_cards",
        props: {
          label: { es: "Club", en: "Club" },
          title: { es: "Título de sección", en: "Section title" },
          subtitle: { es: "Subtítulo de sección", en: "Section subtitle" },
          cards: [
            {
              title: { es: "Título de tarjeta", en: "Card title" },
              description: {
                es: "Descripción de tarjeta",
                en: "Card description",
              },
            },
          ],
        },
      } as SectionFor<T>
    case "home_products":
      return {
        ...base,
        type: "home_products",
        props: {
          label: { es: "Productos", en: "Products" },
          title: {
            es: "Todo lo que necesitás para vender más",
            en: "Everything you need to sell more",
          },
          products: [
            {
              title: { es: "Loyalz Club", en: "Loyalz Club" },
              subtitle: { es: "Fidelización", en: "Loyalty" },
              description: {
                es: "Convertí compras en clientes que siempre vuelven.",
                en: "Turn purchases into customers who keep coming back.",
              },
              color: "#754390",
              image: "",
            },
            {
              title: { es: "Loyalz Reviews", en: "Loyalz Reviews" },
              subtitle: { es: "Reseñas", en: "Reviews" },
              description: {
                es: "Pedí y mostrá reseñas reales en tus canales.",
                en: "Request and showcase real reviews on your channels.",
              },
              color: "#EC491E",
              image: "",
            },
          ],
        },
      } as SectionFor<T>
    case "home_solutions":
      return {
        ...base,
        type: "home_solutions",
        props: {
          label: { es: "Soluciones", en: "Solutions" },
          title: {
            es: "¿Cómo funcionan nuestras soluciones?",
            en: "How do our solutions work?",
          },
          images: [
            {
              url: "",
              caption: {
                es: "Tan solo escaneando el QR",
                en: "Just by scanning the QR",
              },
            },
            {
              url: "",
              caption: {
                es: "Crecé en retención hasta un 30%",
                en: "Grow retention by up to 30%",
              },
            },
            {
              url: "",
              caption: {
                es: "Escaneá la tarjeta",
                en: "Scan the card",
              },
            },
          ],
          primaryCtaLabel: { es: "Prueba GRATIS", en: "Try for FREE" },
          primaryCtaHref: "/contact",
          secondaryCtaLabel: { es: "Agendar DEMO", en: "Book a DEMO" },
          secondaryCtaHref: "/contact",
        },
      } as SectionFor<T>
    case "brand_marquee":
      return {
        ...base,
        type: "brand_marquee",
        props: {
          title: {
            es: "Marcas que confían en nosotros",
            en: "Brands that trust us",
          },
          brands: [
            { name: "Marca 1", logo: "" },
            { name: "Marca 2", logo: "" },
            { name: "Marca 3", logo: "" },
            { name: "Marca 4", logo: "" },
            { name: "Marca 5", logo: "" },
          ],
        },
      } as SectionFor<T>
    case "steps_club":
      return {
        ...base,
        type: "steps_club",
        props: {
          title: { es: "Cómo funciona", en: "How it works" },
          steps: [
            {
              title: { es: "Paso 1", en: "Step 1" },
              description: {
                es: "Descripción del paso.",
                en: "Step description.",
              },
              image: "",
            },
          ],
        },
      } as SectionFor<T>
    case "common_cta":
      return {
        ...base,
        type: "common_cta",
        props: {
          backgroundColor: "#754390",
          title: { es: "Tu próximo paso", en: "Your next step" },
          description: {
            es: "Breve texto que acompaña el llamado a la acción.",
            en: "Short copy accompanying the call to action.",
          },
          firstCta: {
            label: { es: "Empezar", en: "Get started" },
            href: "/contact",
          },
          secondCta: {
            label: { es: "Saber más", en: "Learn more" },
            href: "/club",
          },
          image: "",
        },
      } as SectionFor<T>
    case "club_activation":
      return {
        ...base,
        type: "club_activation",
        props: {
          title: { es: "Activaciones", en: "Activations" },
          activationCards: [
            {
              image: "",
              stat: "+4x",
              title: {
                es: "Frecuencia en clientes",
                en: "Customer frequency",
              },
              description: {
                es: "Texto opcional bajo el título.",
                en: "Optional copy below the title.",
              },
            },
            {
              image: "",
              stat: "12",
              title: { es: "Segundo bloque", en: "Second block" },
              description: { es: "", en: "" },
            },
            {
              image: "",
              stat: "24/7",
              title: { es: "Tercer bloque", en: "Third block" },
            },
          ],
          bottomLabel: { es: "Pie de sección", en: "Section footer" },
        },
      } as SectionFor<T>
    case "home_activation":
      return {
        ...base,
        type: "home_activation",
        props: {
          title: { es: "Activaciones", en: "Activations" },
          activationCards: [
            {
              image: "",
              stat: "+4x",
              title: {
                es: "Frecuencia en clientes",
                en: "Customer frequency",
              },
              description: {
                es: "Texto opcional bajo el título.",
                en: "Optional copy below the title.",
              },
            },
            {
              image: "",
              stat: "12",
              title: { es: "Segundo bloque", en: "Second block" },
              description: { es: "", en: "" },
            },
            {
              image: "",
              stat: "24/7",
              title: { es: "Tercer bloque", en: "Third block" },
            },
          ],
          brands: [
            { name: "Marca 1", logo: "" },
            { name: "Marca 2", logo: "" },
            { name: "Marca 3", logo: "" },
          ],
          bottomLabel: { es: "Pie de sección", en: "Section footer" },
        },
      } as SectionFor<T>
    case "notification_club":
      return {
        ...base,
        type: "notification_club",
        props: {
          title: {
            es: "Notificaciones Push",
            en: "Push Notifications",
          },
          description: {
            es: "Reactivá clientes sin costo. Mandales promociones, recordatorios o mensajes de cumpleaños directo al celular.",
            en: "Re-engage customers for free. Send them promos, reminders or birthday messages right to their phone.",
          },
          badges: [
            {
              brand: "AIR COFFEE",
              message: {
                es: "¡Disfrutá un 50% de descuento en nuestro local hoy! ☕️",
                en: "Enjoy 50% off at our shop today! ☕️",
              },
            },
            {
              brand: "INNAMORATO",
              message: {
                es: "¡Bienvenido a INNsaciables! Un club de beneficios para los incomprendidos 🍦😍",
                en: "Welcome to INNsaciables! A perks club for the unique 🍦😍",
              },
            },
            {
              brand: "COFI JAUS",
              message: {
                es: "Hola 🙌 ¡Estas cerca de Cofi, pasa por el local y recordá que cada 6 te regalamos 1 Café ☕️🫶",
                en: "Hi 🙌 You're near Cofi — drop by, and remember every 6 visits we treat you to 1 free coffee ☕️🫶",
              },
            },
          ],
        },
      } as SectionFor<T>
    case "home_autonomy":
      return {
        ...base,
        type: "home_autonomy",
        props: {
          title: {
            es: "Más autonomía y personalización para tomar decisiones.",
            en: "More autonomy and personalization to make decisions.",
          },
          stats: [
            {
              title: { es: "Reservas", en: "Reservations" },
              statText: { es: "7 mesas", en: "7 tables" },
            },
            {
              title: { es: "Consultas resueltas", en: "Resolved inquiries" },
              description: { es: "20 pendientes", en: "20 pending" },
              statText: { es: "1536", en: "1536" },
            },
            {
              title: { es: "Consultas resueltas", en: "Resolved inquiries" },
              description: { es: "20 pendientes", en: "20 pending" },
              statText: { es: "1536", en: "1536" },
            },
            {
              title: { es: "Reservas", en: "Reservations" },
              statText: { es: "7 mesas", en: "7 tables" },
            },
          ],
        },
      } as SectionFor<T>
    case "home_business":
      return {
        ...base,
        type: "home_business",
        props: {
          label: { es: "Negocios", en: "Business" },
          title: { es: "No importa el tamaño de tu negocio, estamos para hacerlo crecer.", en: "No matter the size of your business, we're here to help it grow." },
          description: { es: "Llevá tu negocio al siguiente nivel con funciones creadas a medida.", en: "Take your business to the next level with tailor-made features." },
          businessCards: [
            {
              image: "",
              title: { es: "Restaurantes", en: "Restaurants" },
              description: { es: "Gestioná picos de demanda con una interfaz ágil que no detiene tu servicio.", en: "Manage demand peaks with an agile interface that keeps your service running." },
            },
            {
              image: "",
              title: { es: "Cafés", en: "Cafés" },
              description: { es: "Convertí el café de la mañana en un hábito diario.", en: "Turn the morning coffee into a daily habit." },
            },
            {
              image: "",
              title: { es: "Delivery-first", en: "Delivery-first" },
              description: { es: "Recuperá el control y transformá cada pedido en una relación directa, sin intermediarios.", en: "Regain control and turn every order into a direct relationship, no middlemen." },
            },
          ],
          primaryCta: { label: { es: "Prueba Gratis", en: "Free Trial" }, href: "/contact" },
          secondaryCta: { label: { es: "Agendar Demo", en: "Book a Demo" }, href: "/contact" },
          stats: [
            {
              image: "",
              title: { es: "Usuarios Registrados", en: "Registered Users" },
              stat: "+100k",
              backgroundColorCard: "#F8F5EF",
            },
            {
              image: "",
              title: { es: "Presencia en países", en: "Countries" },
              stat: "+13",
              backgroundColorCard: "#F8F5EF",
            },
            {
              image: "",
              title: { es: "de experiencia", en: "of experience" },
              stat: "+3 Años",
              backgroundColorCard: "#F8F5EF",
            },
          ],
        },
      } as SectionFor<T>
    case "home_support":
      return {
        ...base,
        type: "home_support",
        props: {
          title: {
            es: "Arrancás con todo el soporte. Sin costo extra.",
            en: "You start with full support. At no extra cost.",
          },
          subtitle: {
            es: "Equipo dedicado, material listo y capacitación incluida.",
            en: "Dedicated team, ready-made assets, and training included.",
          },
          supports: [
            {
              title: {
                es: "Armamos tu kit digital.",
                en: "We build your digital kit.",
              },
              description: {
                es: "Flyers, QR, material para redes, todo listo para que lances tu programa desde el día uno.",
                en: "Flyers, QR, social assets — everything ready so you can launch your program from day one.",
              },
            },
            {
              title: {
                es: "Entrenamos a tus empleados.",
                en: "We train your team.",
              },
              description: {
                es: "Capacitación rápida para que tu equipo sepa usar el scanner y gestionar el programa sin complicaciones.",
                en: "Quick training so your staff knows how to use the scanner and run the program without hassle.",
              },
            },
            {
              title: {
                es: "Consultoría para crecer.",
                en: "Growth consulting.",
              },
              description: {
                es: "Te asesoramos sobre cómo escalar tu programa, activar nuevas mecánicas y sacarle más jugo a tus datos.",
                en: "We advise you on scaling your program, activating new mechanics, and getting more from your data.",
              },
            },
          ],
        },
      } as SectionFor<T>
    default: {
      const _exhaustive: never = type
      throw new Error(`Unknown section type: ${String(_exhaustive)}`)
    }
  }
}

/**
 * Registry of every section type the renderer understands.
 *
 * Keeping the component reference here makes it trivial to:
 * - add a new section (one file + one entry)
 * - drive the admin "add section" picker from the same source of truth
 *
 * Note: component props differ per section, so the registry uses the loose
 * `ComponentType<any>` on purpose. The `PageRenderer` narrows the union via
 * a switch so actual render sites are still fully type-safe.
 */
export type SectionType = PageSection["type"]

export type SectionRegistryEntry = {
  type: SectionType
  label: string
  description: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>
}

export const SECTION_REGISTRY: Record<SectionType, SectionRegistryEntry> = {
  hero: {
    type: "hero",
    label: "Hero",
    description: "Full-viewport hero — headline, five-thumb carousel, single CTA.",
    component: HeroSection,
  },
  hero_club: {
    type: "hero_club",
    label: "Hero Club",
    description: "Hero for the Club page — same layout as Hero.",
    component: HeroClubSection,
  },
  feature_links: {
    type: "feature_links",
    label: "Feature links",
    description: "Grid of feature cards that link to sub-pages.",
    component: FeatureLinksSection,
  },
  stats: {
    type: "stats",
    label: "Stats",
    description: "Large number + label grid.",
    component: StatsSection,
  },
  testimonials: {
    type: "testimonials",
    label: "Testimonials",
    description: "Customer quotes with author + role.",
    component: TestimonialsSection,
  },
  faq: {
    type: "faq",
    label: "FAQ",
    description: "Accordion of frequently asked questions.",
    component: FAQSection,
  },
  contact_form: {
    type: "contact_form",
    label: "Contact form",
    description: "Lead-capture form.",
    component: ContactFormSection,
  },
  cta: {
    type: "cta",
    label: "CTA",
    description: "Call to action section.",
    component: CTASection,
  },
  pricing: {
    type: "pricing",
    label: "Pricing",
    description: "Pricing cards with plans and features.",
    component: PricingSection,
  },
  productpricing: {
    type: "productpricing",
    label: "Product pricing",
    description: "Label, title, description and product cards with href.",
    component: ProductPricingSection,
  },
  club_cards: {
    type: "club_cards",
    label: "Club Cards",
    description: "Label, title, subtitle and cards grid.",
    component: ClubCardsSection,
  },
  home_products: {
    type: "home_products",
    label: "Home Products",
    description: "Label, title and hoverable products with image preview.",
    component: HomeProductsSection,
  },
  home_solutions: {
    type: "home_solutions",
    label: "Home Solutions",
    description: "Label, title, image gallery and primary + secondary CTAs.",
    component: HomeSolutionsSection,
  },
  brand_marquee: {
    type: "brand_marquee",
    label: "Brand Marquee",
    description: "Title and an infinite horizontal marquee of brand logos.",
    component: BrandMarqueeSection,
  },
  steps_club: {
    type: "steps_club",
    label: "Steps Club",
    description: "Title and steps with image, title and description (Club / product pages).",
    component: StepsClubSection,
  },
  common_cta: {
    type: "common_cta",
    label: "Common CTA",
    description: "Solid background, title, description, two CTAs and image.",
    component: CommonCTASection,
  },
  club_activation: {
    type: "club_activation",
    label: "Club activation",
    description: "Title, activation cards (image + stat + title), bottom label.",
    component: ClubActivationSection,
  },
  home_activation: {
    type: "home_activation",
    label: "Home activation",
    description: "Title, activation cards (image + stat + title), bottom label.",
    component: HomeActivationSection,
  },
  notification_club: {
    type: "notification_club",
    label: "Notification Club",
    description: "Push notifications — copy left, phone + glass badges right.",
    component: NotificationClubSection,
  },
  home_business: {
    type: "home_business",
    label: "Home Business",
    description: "Label, title, description, business cards grid and colored stats grid.",
    component: HomeBusinessSection,
  },
  home_autonomy: {
    type: "home_autonomy",
    label: "Home Autonomy",
    description: "iPad mockup with floating stats at the corners and a title band below.",
    component: HomeAutonomySection,
  },
  home_support: {
    type: "home_support",
    label: "Home Support",
    description:
      "Full-bleed background, title + optional subtitle left, infinite vertical marquee of support cards.",
    component: HomeSupportSection,
  },
}

/** Ordered list — handy for populating the admin UI. */
export const SECTION_TYPES = Object.keys(SECTION_REGISTRY) as SectionType[]

export function isKnownSectionType(type: string): type is SectionType {
  return type in SECTION_REGISTRY
}
