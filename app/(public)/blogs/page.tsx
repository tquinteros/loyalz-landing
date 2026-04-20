// import { Suspense } from 'react'
// import { createClient } from '@/lib/supabase/server'
// import BlogsPageTemplate from '@/components/blogs/blogs-page-template'
// import { Post } from '@/lib/types/Posts'
// import { getPublicPosts } from '@/lib/actions/blog'
// import { error } from 'console'

// export default function BlogsPage() {
//     return (
//         <Suspense
//             fallback={<div className="container mx-auto py-10">Loading...</div>}
//         >
//             <BlogsContent />
//         </Suspense>
//     )
// }

// async function BlogsContent() {
//     const blogs = await getPublicPosts()
//     return <BlogsPageTemplate posts={blogs as Post[]} />
// }


"use client"

import BlogsPageTemplate from '@/components/blogs/blogs-page-template'
import { getPublicPosts } from '@/lib/actions/blog'
import { Post } from '@/lib/types/Posts'
import { useQuery } from '@tanstack/react-query'

const BlogsPage = () => {

    const { data, isLoading, error } = useQuery({
        queryKey: ['blogs'],
        queryFn: () => getPublicPosts()
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <BlogsPageTemplate posts={data as Post[]} />
    )
}

export default BlogsPage