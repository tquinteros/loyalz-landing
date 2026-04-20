import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import BlogsPageTemplate from '@/components/blogs/blogs-page-template'
import { Post } from '@/lib/types/Posts'
import { getPublicPosts } from '@/lib/actions/blog'
import { error } from 'console'

export default function BlogsPage() {
    return (
        <Suspense
            fallback={<div className="container mx-auto py-10">Loading...</div>}
        >
            <BlogsContent />
        </Suspense>
    )
}

async function BlogsContent() {
    const blogs = await getPublicPosts()
    return <BlogsPageTemplate posts={blogs as Post[]} />
}