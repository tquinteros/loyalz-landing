import { Suspense } from "react"
import { fetchPublicPostsCached } from "@/lib/queries/blog.server"
import BlogsClient from "@/components/blogs/blogs-client"

export default async function BlogsPage() {
  const posts = await fetchPublicPostsCached()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogsClient initialData={posts} />
    </Suspense>
  )
}
