import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import BlogsPageTemplate from '@/components/blogs/blogs-page-template'
import { Post } from '@/lib/types/Posts'

export default function BlogsPage() {
    return (
        <Suspense
            fallback={<div className="container mx-auto">Loading...</div>}
        >
            <BlogsContent />
        </Suspense>
    )
}

async function BlogsContent() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('posts').select('*')

    if (error) {
        return <div className="container mx-auto">Error: {error.message}</div>
    }

    return <BlogsPageTemplate posts={data as Post[]} />
}