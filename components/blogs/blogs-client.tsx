"use client"

import { useQuery } from '@tanstack/react-query'
import { getPublicPosts } from '@/lib/actions/blog'
import BlogsPageTemplate from '@/components/blogs/blogs-page-template'
import { Post } from '@/lib/types/Posts'

export default function BlogsClient() {
    const { data = [], isLoading, error } = useQuery({
        queryKey: ['blogs'],
        queryFn: getPublicPosts,
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <p className="p-10 text-destructive">{error.message}</p>

    return <BlogsPageTemplate posts={data as Post[]} />
}