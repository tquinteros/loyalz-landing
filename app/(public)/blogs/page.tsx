import { Suspense } from "react"
import { fetchPublicPostsCached } from "@/lib/queries/blog.server"
import BlogsClient from "@/components/blogs/blogs-client"
import { BlogsSkeleton } from "@/components/blogs/blogs-skeleton"

export default async function BlogsPage() {
    const posts = await fetchPublicPostsCached()

    return (
        <Suspense fallback={<BlogsSkeleton />}>
            <BlogsClient initialData={posts} />
        </Suspense>
    )
}
