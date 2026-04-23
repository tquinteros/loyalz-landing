import MediaLibraryTemplate from "@/components/admin/media-library/media-library-template"
import { getMediaItemsPage } from "@/lib/actions/media"
import { MEDIA_PAGE_SIZE } from "@/lib/actions/media.constants"

export default async function AdminMediaLibraryPage() {
  const { data, error } = await getMediaItemsPage({ limit: MEDIA_PAGE_SIZE })

  if (error || !data) {
    return (
      <MediaLibraryTemplate
        items={[]}
        initialNextCursor={null}
        total={0}
        error={(error as string) ?? "No se pudieron cargar las imágenes."}
      />
    )
  }

  return (
    <MediaLibraryTemplate
      items={data.items}
      initialNextCursor={data.nextCursor}
      total={data.total}
    />
  )
}
