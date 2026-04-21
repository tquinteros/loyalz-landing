import { getPublicPosts } from '@/lib/actions/blog'
import BlogsPageTemplate from '@/components/blogs/blogs-page-template'
import { Post } from '@/lib/types/Posts'

export default async function BlogsPage() {
    const result = await getPublicPosts()

    if ('error' in result) {
        return <p className="p-10 text-destructive">{result.error}</p>
    }

    return <BlogsPageTemplate posts={result as Post[]} />
}