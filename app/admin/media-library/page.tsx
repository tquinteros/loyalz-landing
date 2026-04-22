import MediaLibraryTemplate from "@/components/admin/media-library/media-library-template"
import { getMediaItems } from "@/lib/actions/media"

export default async function AdminMediaLibraryPage() {
  const { data, error } = await getMediaItems()

  if (error) {
    return <MediaLibraryTemplate items={[]} error={error as string} />
  }

  return <MediaLibraryTemplate items={data ?? []} />
}
