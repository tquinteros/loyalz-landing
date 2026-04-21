import PagesTemplate, {
  type AdminPageRow,
} from "@/components/admin/pages/pages-template"
import { getAdminPages } from "@/lib/actions/pages"

export default async function AdminPagesPage() {
  const { data, error } = await getAdminPages()

  if (error) {
    return <PagesTemplate pages={[]} error={error as string} />
  }

  return <PagesTemplate pages={data as AdminPageRow[]} />
}
