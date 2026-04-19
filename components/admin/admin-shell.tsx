"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ReactNode } from "react"
import { FileText, LayoutDashboard, Settings, Users } from "lucide-react"

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
} from "@/components/ui/sidebar"

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
  { title: "Blogs", href: "/admin/blogs", icon: FileText },
  // { title: "Pages", href: "/admin/pages", icon: FileText },
  { title: "Users", href: "/admin/users", icon: Users },
] as const

const settingsNavItems = [
  { title: "Settings", href: "/admin/settings", icon: Settings },
] as const

type AdminShellProps = {
  children: ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()

  return (
    <SidebarProvider defaultOpen>
      <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="px-2 py-1">
            <Link href="/" className="text-sm font-semibold tracking-tight">LoyalZ Admin</Link>
            <p className="text-xs text-sidebar-foreground/70">Content management</p>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActiveNavItem(pathname, item.href)}
                    >
                      <Link href={item.href}>
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
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActiveNavItem(pathname, item.href)}
                    >
                      <Link href={item.href}>
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

        <SidebarFooter className="border-t border-sidebar-border">
          <p className="px-2 text-xs text-sidebar-foreground/70">Admin Panel v1</p>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />
          <div className="h-4 w-px bg-border" />
          <p className="text-sm font-medium">Admin Dashboard</p>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}