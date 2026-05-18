import { checkIsAdmin } from "@/lib/actions/admin-guard"
import { AdminModeGate } from "@/components/admin/admin-mode-gate"

/**
 * Async server component — must be rendered inside <Suspense> so
 * `checkIsAdmin()` does not block the public layout shell.
 */
export async function AdminModeLoader() {
  const isAdmin = await checkIsAdmin()
  return <AdminModeGate isAdmin={isAdmin} />
}
