import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getPublicPosts } from '@/lib/actions/blog'
import BlogsClient from '@/components/blogs/blogs-client'

export default async function BlogsPage() {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['blogs'],
        queryFn: getPublicPosts,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <BlogsClient />
        </HydrationBoundary>
    )
}