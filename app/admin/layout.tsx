import type { ReactNode } from "react"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminShell } from "@/components/admin/admin-shell"

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense fallback={<AdminAccessFallback />}>
      <AdminAccessGuard>{children}</AdminAccessGuard>
    </Suspense>
  )
}

/**
 * Fallback shown while `AdminAccessGuard` awaits the Supabase auth call.
 *
 * Must NOT render `AdminShell` — it's a client component that calls
 * `usePathname()`, which `cacheComponents: true` treats as uncached dynamic
 * data. If the shell appears in a Suspense fallback, Next can't prerender
 * the static shell of any admin route (fails with
 * "Uncached data was accessed outside of <Suspense>").
 */
function AdminAccessFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Verificando acceso…
    </div>
  )
}

async function AdminAccessGuard({ children }: AdminLayoutProps) {
  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.getClaims()

  if (authError || !authData?.claims) {
    redirect("/auth/login")
  }

  const userId = authData.claims.sub
  if (typeof userId !== "string" || !userId) {
    redirect("/auth/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle()

  if (profileError || profile?.role !== "admin") {
    redirect("/")
  }

  return <AdminShell>{children}</AdminShell>
}
