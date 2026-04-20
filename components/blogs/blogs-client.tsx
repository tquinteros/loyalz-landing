"use client"

import { useQuery } from '@tanstack/react-query'
import { getPublicPosts } from '@/lib/actions/blog'
import BlogsPageTemplate from '@/components/blogs/blogs-page-template'
import { Post } from '@/lib/types/Posts'

export default function BlogsClient() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['blogs'], // misma key que el prefetch
        queryFn: getPublicPosts,
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return <BlogsPageTemplate posts={data as Post[]} />
}