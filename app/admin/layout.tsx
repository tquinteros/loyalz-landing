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
    <Suspense fallback={<AdminShellFallback />}>
      <AdminAccessGuard>{children}</AdminAccessGuard>
    </Suspense>
  )
}

function AdminShellFallback() {
  return (
    <AdminShell>
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Verificando acceso…
      </div>
    </AdminShell>
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
