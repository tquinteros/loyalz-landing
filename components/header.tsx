"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, MenuIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet"

const PRODUCT_CARDS = [
  {
    title: "Loyalz club",
    description: "El sistema de fidelizacion para que siempre vuelvan.",
    href: "/club",
    cta: "Conoce mas",
    bgColor: "#754390",
    image: "/club.png"
  },
  {
    title: "Loyalz reviews",
    description: "La herramienta que convierte experiencias en resenas.",
    href: "/blogs",
    cta: "Conoce mas",
    bgColor: "#EC491E",
    image: "/club.png"
  },
  {
    title: "Loyalz pos",
    description: "El punto de venta que ordena y simplifica tu dia.",
    href: "/blogs",
    cta: "Conoce mas",
    bgColor: "#8C7F1F",
    image: "/club.png"
  },
  {
    title: "Loyalz ai",
    description: "La inteligencia que optimiza tu negocio en automatico.",
    href: "/blogs",
    cta: "Conoce mas",
    bgColor: "#013662",
    image: "/club.png"
  },
]

const Header = () => {
  return (
    <header className="sticky top-0 z-50 h-20 w-full border-b border-b-foreground/10 bg-[#F8F5EF] text-black">
      <div className="flex h-full w-full items-center justify-between px-5 py-3 text-sm lg:px-16">
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={36} height={36} />
          </Link>

          <div className="hidden items-center gap-5 font-semibold md:flex">
            <Link href="/">Empresa</Link>

            <NavigationMenu className="z-50">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto bg-transparent px-0 py-0 text-sm font-semibold hover:bg-transparent focus:bg-transparent data-[state=open]:text-black data-[state=open]:bg-transparent">
                    Productos
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[min(1200px,92vw)] rounded-xl bg-[#F8F5EF] p-7 border-none">
                    <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                      {PRODUCT_CARDS.map((card) => {
                        const [mainWord, ...secondaryWords] = card.title.split(" ")
                        return (
                          <NavigationMenuLink
                            key={card.title}
                            asChild
                            className="h-full rounded-xl p-0 transition-none hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit"
                          >
                            <Link href={card.href}>
                              <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-0 shadow-none">
                                <div className="relative aspect-video w-full">
                                  <Image
                                    src={card.image}
                                    alt={card.title}
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
                                    {card.description}
                                  </CardDescription>
                                  <span className="inline-flex h-auto w-fit rounded-lg border border-foreground/60 bg-transparent px-5 py-2 text-sm font-semibold text-foreground">
                                    {card.cta}
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

            <Link href="/blogs">Tipos de Negocio</Link>
            <Link href="/admin" prefetch={false}>
              Admin
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <Button  className="py-5">
            Consulta por tu negocio <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg text-black hover:bg-black/5"
                aria-label="Abrir menu"
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] bg-[#F8F5EF] p-0 text-black">
              <div className="flex h-full flex-col">
                <div className="border-b border-black/10 px-6 py-5">
                  <SheetTitle className="text-base text-black">Menu</SheetTitle>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <nav className="space-y-2 text-base font-semibold text-black">
                    <SheetClose asChild>
                      <Link className="block rounded-md px-2 py-2 hover:bg-black/5" href="/">
                        Empresa
                      </Link>
                    </SheetClose>

                    <Accordion type="single" collapsible>
                      <AccordionItem value="productos" className="border-b-0">
                        <AccordionTrigger className="rounded-md px-2 py-2 text-base font-semibold text-black hover:no-underline">
                          Productos
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <div className="space-y-1 pl-2">
                            {PRODUCT_CARDS.map((card) => (
                              <SheetClose asChild key={card.title}>
                                <Link
                                  href={card.href}
                                  className="block rounded-md px-2 py-2 text-sm font-medium hover:bg-black/5"
                                >
                                  {card.title}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <SheetClose asChild>
                      <Link className="block rounded-md px-2 py-2 hover:bg-black/5" href="/blogs">
                        Tipos de Negocio
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link className="block rounded-md px-2 py-2 hover:bg-black/5" href="/admin" prefetch={false}>
                        Admin
                      </Link>
                    </SheetClose>
                  </nav>
                </div>

                <div className="border-t border-black/10 p-6">
                  <SheetClose asChild>
                    <Button className="h-11 w-full">
                      Consulta por tu negocio <ArrowRightIcon className="h-4 w-4" />
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