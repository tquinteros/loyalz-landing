"use server"

import { createClient } from "@/lib/supabase/server"

type AdminGuardResult =
  | { userId: string; error?: never }
  | { userId?: never; error: string }

/**
 * Verifies the current request comes from an authenticated admin.
 * Use at the top of every admin-only server action.
 *
 * Returns `{ userId }` on success or `{ error }` on failure.
 * Callers should return early when `error` is present:
 *
 *   const guard = await requireAdmin()
 *   if (guard.error) return { error: guard.error }
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.getClaims()

  const userId = authData?.claims?.sub
  if (authError || typeof userId !== "string" || !userId) {
    return { error: "No autorizado." }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle()

  if (profileError || profile?.role !== "admin") {
    return { error: "No autorizado." }
  }

  return { userId }
}

/**
 * Lightweight check for use in server components and layouts.
 * Returns `true` if the current user is an authenticated admin.
 */
export async function checkIsAdmin(): Promise<boolean> {
  const result = await requireAdmin()
  return !result.error
}
