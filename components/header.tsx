"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "./ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"

const PRODUCT_CARDS = [
  {
    title: "Loyalz club",
    description: "El sistema de fidelizacion para que siempre vuelvan.",
    href: "/blogs",
  },
  {
    title: "Loyalz reviews",
    description: "La herramienta que convierte experiencias en resenas.",
    href: "/blogs",
  },
  {
    title: "Loyalz pos",
    description: "El punto de venta que ordena y simplifica tu dia.",
    href: "/blogs",
  },
  {
    title: "Loyalz ai",
    description: "La inteligencia que optimiza tu negocio en automatico.",
    href: "/blogs",
  },
]

const Header = () => {
  return (
    <header className="sticky top-0 z-50 h-20 w-full border-b border-b-foreground/10 bg-[#F8F5EF] text-black">
      <div className="flex h-full w-full items-center justify-between p-3 px-5 text-sm lg:px-20">
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={36} height={36} />
          </Link>
          <div className="flex items-center gap-5 font-semibold">
            <Link href="/">Empresa</Link>

            <NavigationMenu className="z-50">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto bg-transparent px-0 py-0 text-sm font-semibold hover:bg-transparent focus:bg-transparent data-[state=open]:text-black data-[state=open]:bg-transparent">
                    Productos
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[min(1200px,92vw)] rounded-xl border bg-background p-7 shadow-lg">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                      {PRODUCT_CARDS.map((card) => (
                        <NavigationMenuLink
                          key={card.title}
                          asChild
                          className="rounded-xl border p-5 transition-none hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit"
                        >
                          <Link href={card.href}>
                            <div className="mb-3 h-24 w-full rounded-md bg-muted" />
                            <p className="text-base font-semibold">{card.title}</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {card.description}
                            </p>
                            <span className="mt-4 inline-block text-sm font-medium">
                              Conoce mas
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      ))}
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
        <div>
          <Button variant="outline" className="py-5 text-white">
            Consulta por tu negocio <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header