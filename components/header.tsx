"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, GlobeIcon, MenuIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet"
import { useLanguage, useT, type Locale } from "@/providers/language-provider"
import type { LocalizedString } from "@/lib/types/Pages"

const LANGUAGE_OPTIONS: ReadonlyArray<{ value: Locale; label: string; short: string }> = [
  { value: "es", label: "Español", short: "ES" },
  { value: "en", label: "English", short: "EN" },
]

const HEADER_COPY = {
  company: { es: "Empresa", en: "Company" },
  products: { es: "Productos", en: "Products" },
  businessTypes: { es: "Tipos de Negocio", en: "Business types" },
  admin: { es: "Admin", en: "Admin" },
  ctaConsult: {
    es: "Consulta por tu negocio",
    en: "Inquire about your business",
  },
  openMenu: { es: "Abrir menú", en: "Open menu" },
  menuTitle: { es: "Menú", en: "Menu" },
  changeLanguage: { es: "Cambiar idioma", en: "Change language" },
} satisfies Record<string, LocalizedString>

type HeaderProductCard = {
  /** Stable key for React lists (does not change with locale). */
  id: string
  title: LocalizedString
  description: LocalizedString
  cta: LocalizedString
  href: string
  bgColor: string
  image: string
}

const PRODUCT_CARDS: ReadonlyArray<HeaderProductCard> = [
  {
    id: "club",
    title: { es: "Loyalz club", en: "Loyalz club" },
    description: {
      es: "El sistema de fidelizacion para que siempre vuelvan.",
      en: "The loyalty system that keeps them coming back.",
    },
    cta: { es: "Conoce mas", en: "Learn more" },
    href: "/club",
    bgColor: "#754390",
    image: "/club.png",
  },
  {
    id: "reviews",
    title: { es: "Loyalz reviews", en: "Loyalz reviews" },
    description: {
      es: "La herramienta que convierte experiencias en resenas.",
      en: "The tool that turns experiences into reviews.",
    },
    cta: { es: "Conoce mas", en: "Learn more" },
    href: "/blogs",
    bgColor: "#EC491E",
    image: "/club.png",
  },
  {
    id: "pos",
    title: { es: "Loyalz pos", en: "Loyalz pos" },
    description: {
      es: "El punto de venta que ordena y simplifica tu dia.",
      en: "The point of sale that organizes and simplifies your day.",
    },
    cta: { es: "Conoce mas", en: "Learn more" },
    href: "/blogs",
    bgColor: "#8C7F1F",
    image: "/club.png",
  },
  {
    id: "ai",
    title: { es: "Loyalz ai", en: "Loyalz ai" },
    description: {
      es: "La inteligencia que optimiza tu negocio en automatico.",
      en: "The intelligence that optimizes your business automatically.",
    },
    cta: { es: "Conoce mas", en: "Learn more" },
    href: "/blogs",
    bgColor: "#013662",
    image: "/club.png",
  },
]

function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage()
  const current = LANGUAGE_OPTIONS.find((opt) => opt.value === locale) ?? LANGUAGE_OPTIONS[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-9 gap-2 px-2 text-sm font-semibold text-black hover:bg-black/5 ${className ?? ""}`}
          aria-label={t(HEADER_COPY.changeLanguage)}
        >
          <GlobeIcon className="h-4 w-4" />
          <span>{current.short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => setLocale(value as Locale)}
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value} className="gap-2 hover:bg-transparent! hover:text-background!">
              <span className="text-xs font-semibold text-muted-foreground">{opt.short}</span>
              <span>{opt.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const Header = () => {
  const t = useT()

  return (
    <header className="sticky top-0 z-50 h-20 w-full border-b border-b-foreground/10 bg-[#F8F5EF] text-black">
      <div className="flex h-full w-full items-center justify-between px-5 py-3 text-sm lg:px-16">
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={36} height={36} />
          </Link>

          <div className="hidden items-center gap-5 font-semibold md:flex">
            <Link href="/">{t(HEADER_COPY.company)}</Link>

            <NavigationMenu
              className="z-50"
              viewportWrapperClassName="fixed top-20 left-0 right-0 z-[60] w-full max-w-[100vw] justify-center"
              viewportClassName="mt-0 h-[var(--radix-navigation-menu-viewport-height)] w-full max-w-[100vw] overflow-hidden rounded-none border-x-0 border-b border-t-0 border-border/30 bg-background shadow-none md:mt-0 md:w-screen md:max-w-none"
            >
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto bg-transparent px-0 py-0 text-sm font-semibold hover:bg-transparent focus:bg-transparent data-[state=open]:text-black data-[state=open]:bg-transparent">
                    {t(HEADER_COPY.products)}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-full max-w-none rounded-none border-0 bg-transparent p-0 md:left-0 md:w-full">
                    <div className="grid auto-rows-fr grid-cols-1 gap-5 px-5 py-7 sm:grid-cols-2 lg:px-16 xl:grid-cols-4">
                      {PRODUCT_CARDS.map((card) => {
                        const cardTitle = t(card.title)
                        const [mainWord, ...secondaryWords] = cardTitle.split(" ")
                        return (
                          <NavigationMenuLink
                            key={card.id}
                            asChild
                            className="h-full rounded-xl p-0 transition-none hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit"
                          >
                            <Link href={card.href}>
                              <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-0 shadow-none">
                                <div className="relative aspect-video w-full">
                                  <Image
                                    src={card.image}
                                    alt={cardTitle}
                                    fill
                                    priority
                                    loading="eager"
                                    sizes="(max-width: 1024px) 100vw, 25vw"
                                    className="object-cover"
                                  />
                                </div>
                                <CardContent
                                  className="flex flex-1 flex-col gap-4 p-6 text-foreground"
                                  style={{ backgroundColor: card.bgColor }}
                                >
                                  <CardTitle className="text-3xl font-semibold leading-none tracking-tight">
                                    <span>{mainWord}</span>
                                    {secondaryWords.length > 0 ? (
                                      <span className="opacity-50">
                                        {" "}
                                        {secondaryWords.join(" ")}
                                      </span>
                                    ) : null}
                                  </CardTitle>
                                    <CardDescription className="flex-1 text-base leading-snug text-foreground/95">
                                    {t(card.description)}
                                  </CardDescription>
                                  <span className="inline-flex h-auto w-fit rounded-lg border border-foreground/60 bg-transparent px-5 py-2 text-sm font-semibold text-foreground">
                                    {t(card.cta)}
                                  </span>
                                </CardContent>
                              </Card>
                            </Link>
                          </NavigationMenuLink>
                        )
                      })}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/blogs">{t(HEADER_COPY.businessTypes)}</Link>
            <Link href="/admin" prefetch={false}>
              {t(HEADER_COPY.admin)}
            </Link>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <Button  className="py-5">
            {t(HEADER_COPY.ctaConsult)} <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg text-black hover:bg-black/5"
                aria-label={t(HEADER_COPY.openMenu)}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] bg-[#F8F5EF] p-0 text-black">
              <div className="flex h-full flex-col">
                <div className="border-b border-black/10 px-6 py-5">
                  <SheetTitle className="text-base text-black">{t(HEADER_COPY.menuTitle)}</SheetTitle>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <nav className="space-y-2 text-base font-semibold text-black">
                    <SheetClose asChild>
                      <Link className="block rounded-md px-2 py-2 hover:bg-black/5" href="/">
                        {t(HEADER_COPY.company)}
                      </Link>
                    </SheetClose>

                    <Accordion type="single" collapsible>
                      <AccordionItem value="productos" className="border-b-0">
                        <AccordionTrigger className="rounded-md px-2 py-2 text-base font-semibold text-black hover:no-underline">
                          {t(HEADER_COPY.products)}
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <div className="space-y-1 pl-2">
                            {PRODUCT_CARDS.map((card) => (
                              <SheetClose asChild key={card.id}>
                                <Link
                                  href={card.href}
                                  className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-black/5"
                                >
                                  {t(card.title)}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <SheetClose asChild>
                      <Link className="block rounded-md px-2 py-2 hover:bg-black/5" href="/blogs">
                        {t(HEADER_COPY.businessTypes)}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link className="block rounded-md px-2 py-2 hover:bg-black/5" href="/admin" prefetch={false}>
                        {t(HEADER_COPY.admin)}
                      </Link>
                    </SheetClose>
                  </nav>
                </div>

                <div className="border-t border-black/10 p-6">
                  <SheetClose asChild>
                    <Button className="h-11 w-full">
                      {t(HEADER_COPY.ctaConsult)} <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
