"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ReactNode } from "react"
import { FileText, Images, Layers, LayoutDashboard, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { ThemeSwitcher } from "../theme-switcher"
import { LogoutButton } from "../logout-button"

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1)
  return path
}

/** Dashboard is only active on `/admin`, not on deeper `/admin/...` routes. */
function isActiveNavItem(pathname: string, href: string) {
  const p = normalizePath(pathname)
  const h = normalizePath(href)
  if (h === "/admin") return p === "/admin"
  return p === h || p.startsWith(`${h}/`)
}

const mainNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Páginas", href: "/admin/pages", icon: Layers },
  { title: "Blogs", href: "/admin/blogs", icon: FileText },
  { title: "Imágenes", href: "/admin/media-library", icon: Images },
] as const

const settingsNavItems = [
  { title: "Configuración", href: "/admin/settings", icon: Settings },
] as const

type AdminShellProps = {
  children: ReactNode
}

function AdminNavigation({ pathname }: { pathname: string }) {
  const { isMobile, setOpenMobile } = useSidebar()

  function handleNavClick() {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Contenido Principal</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActiveNavItem(pathname, item.href)}
                >
                  <Link href={item.href} onClick={handleNavClick}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Configuración</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {settingsNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActiveNavItem(pathname, item.href)}
                >
                  <Link href={item.href} onClick={handleNavClick}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()

  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
        <SidebarHeader className="h-14 border-b border-sidebar-border">
          <div className="flex h-full items-center justify-between px-2">
            <Link href="/" className="text-sm font-semibold tracking-tight">LoyalZ Admin</Link>
            <ThemeSwitcher />
          </div>
        </SidebarHeader>

        <AdminNavigation pathname={pathname} />
        <SidebarFooter className="mt-auto border-t border-sidebar-border">
          <LogoutButton />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-sidebar-border bg-background px-4">
          <SidebarTrigger />
          <div className="h-4 w-px bg-border" />
          <p className="text-sm font-medium">Panel de administración</p>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}