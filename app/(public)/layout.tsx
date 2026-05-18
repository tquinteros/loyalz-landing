import type { ReactNode } from "react"
import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AdminModeProvider } from "@/components/admin/admin-mode-context"
import { AdminModeLoader } from "@/components/admin/admin-mode-loader"

/**
 * Layout shell stays synchronous so Header, page content, and Footer
 * stream immediately. The Supabase admin check runs only inside
 * <AdminModeLoader>, behind Suspense.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <AdminModeProvider>
      <div className="theme-landing bg-foreground min-h-screen text-background">
        <Header />
        {children}
        <Footer />
      </div>
      <Suspense fallback={null}>
        <AdminModeLoader />
      </Suspense>
    </AdminModeProvider>
  )
}
