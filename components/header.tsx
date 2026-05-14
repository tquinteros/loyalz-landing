"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, GlobeIcon, MenuIcon, ChevronDownIcon } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet"
import { useLanguage, useT, type Locale } from "@/providers/language-provider"
import type { LocalizedString } from "@/lib/types/Pages"
import HeaderAdminLink from "@/components/admin/header-admin"

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
    image: "https://tkbdqmgjqfwwkrfvwolr.supabase.co/storage/v1/object/public/loyalz-landing/media/1778557263292-g41wuvp9gvr.png",
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
    image: "https://tkbdqmgjqfwwkrfvwolr.supabase.co/storage/v1/object/public/loyalz-landing/media/1778557584034-92crq1z7zcs.png",
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
    image: "https://tkbdqmgjqfwwkrfvwolr.supabase.co/storage/v1/object/public/loyalz-landing/media/1778558783917-67yl2yx7m1f.png",
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
    image: "https://tkbdqmgjqfwwkrfvwolr.supabase.co/storage/v1/object/public/loyalz-landing/media/1778557551558-1mi70bu528ai.png",
  },
]

const megamenuVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: "easeInOut" as const },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18, ease: "easeInOut" as const },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.22, ease: "easeOut" as const },
  }),
}

function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage()
  const current = LANGUAGE_OPTIONS.find((opt) => opt.value === locale) ?? LANGUAGE_OPTIONS[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-9 gap-2 px-2 text-sm font-semibold text-black hover:bg-black/5 focus-visible:ring-black/20 ${className ?? ""}`}
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
            <DropdownMenuRadioItem
              key={opt.value}
              value={opt.value}
              className="gap-2 hover:bg-transparent! hover:text-background!"
            >
              <span className="text-xs font-semibold text-muted-foreground">{opt.short}</span>
              <span>{opt.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


function MegaMenu({ onClose }: { onClose: () => void }) {
  const t = useT()

  return (
    <motion.div
      key="megamenu"
      variants={megamenuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute left-0 top-full w-full border-b border-border/30 bg-background shadow-sm"
    >
      <div className="grid grid-cols-1 gap-5 px-5 py-7 sm:grid-cols-2 lg:px-16 xl:grid-cols-4">
        {PRODUCT_CARDS.map((card, i) => {
          const cardTitle = t(card.title)
          const [mainWord, ...secondaryWords] = cardTitle.split(" ")

          return (
            <motion.div
              key={card.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Link href={card.href} onClick={onClose} className="block h-full">
                <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-0 shadow-none transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="relative aspect-video w-full h-[200px]">
                    {/* <Image
                      src={card.image}
                      alt={cardTitle}
                      fill
                      priority
                      loading="eager"
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      className="object-cover"
                    /> */}
                    <Image
                      src={card.image}
                      alt={cardTitle}
                      width={1024}
                      height={1024}
                      className="object-cover h-[200px]"
                      priority={i === 0}
                    />
                  </div>
                  <CardContent
                    className="flex flex-1 flex-col gap-4 p-6 text-foreground"
                    style={{ backgroundColor: card.bgColor }}
                  >
                    <CardTitle className="text-3xl font-semibold leading-none tracking-tight">
                      <span>{mainWord}</span>
                      {secondaryWords.length > 0 ? (
                        <span className="opacity-50"> {secondaryWords.join(" ")}</span>
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
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Header ─────────────────────────────────────────────────────────────────

const MEGA_CLOSE_DELAY_MS = 150

const Header = () => {
  const t = useT()
  const [megaOpen, setMegaOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const megaCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearMegaCloseTimer = () => {
    if (megaCloseTimerRef.current) {
      clearTimeout(megaCloseTimerRef.current)
      megaCloseTimerRef.current = null
    }
  }

  const openMegaMenu = () => {
    clearMegaCloseTimer()
    setMegaOpen(true)
  }

  const scheduleCloseMegaMenu = () => {
    clearMegaCloseTimer()
    megaCloseTimerRef.current = setTimeout(() => {
      setMegaOpen(false)
      megaCloseTimerRef.current = null
    }, MEGA_CLOSE_DELAY_MS)
  }

  useEffect(() => () => clearMegaCloseTimer(), [])

  // Close megamenu when clicking outside
  useEffect(() => {
    if (!megaOpen) return
    const handleClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        clearMegaCloseTimer()
        setMegaOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [megaOpen])

  // Close on Escape
  useEffect(() => {
    if (!megaOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearMegaCloseTimer()
        setMegaOpen(false)
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [megaOpen])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-b-foreground/10 bg-[#F8F5EF] text-black"
    >
      {/* Main bar */}
      <div className="flex h-20 w-full items-center justify-between px-5 py-3 text-sm lg:px-16">
        {/* Left */}
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={36} height={36} />
          </Link>
          <Link href="/terms">Terminos</Link>
          <nav className="hidden items-center gap-5 font-semibold md:flex">
            <Link href="/" className="transition-opacity hover:opacity-70">
              {t(HEADER_COPY.company)}
            </Link>

            {/* Products trigger (hover opens megamenu) */}
            <div
              className="relative"
              onMouseEnter={openMegaMenu}
              onMouseLeave={scheduleCloseMegaMenu}
            >
              <button
                type="button"
                className="flex items-center gap-1 transition-opacity hover:opacity-70 focus:outline-none"
                aria-expanded={megaOpen}
                aria-haspopup="true"
              >
                {t(HEADER_COPY.products)}
                <motion.span
                  animate={{ rotate: megaOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  <ChevronDownIcon className="h-4 w-4" />
                </motion.span>
              </button>
            </div>

            <Link href="/blogs" className="transition-opacity hover:opacity-70">
              {t(HEADER_COPY.businessTypes)}
            </Link>
            <HeaderAdminLink className="transition-opacity hover:opacity-70">
              {t(HEADER_COPY.admin)}
            </HeaderAdminLink>
          </nav>
        </div>

        {/* Right */}
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <Button className="py-5">
            {t(HEADER_COPY.ctaConsult)} <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile */}
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
                    <HeaderAdminLink variant="sheet" className="block rounded-md px-2 py-2 hover:bg-black/5">
                      {t(HEADER_COPY.admin)}
                    </HeaderAdminLink>
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

      {/* Megamenu (desktop only) */}
      <div
        className="relative hidden md:block"
        onMouseEnter={openMegaMenu}
        onMouseLeave={scheduleCloseMegaMenu}
      >
        <AnimatePresence>
          {megaOpen && (
            <MegaMenu
              onClose={() => {
                clearMegaCloseTimer()
                setMegaOpen(false)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header