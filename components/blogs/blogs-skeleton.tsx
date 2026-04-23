import React from 'react'
import { Skeleton } from '../ui/skeleton'
import Link from 'next/link'

export const BlogsSkeleton = () => {
    return (
        <div className="container mx-auto px-5 py-10 lg:px-8">
            <div className="mb-10 max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blogs</h1>
                <p className="mt-2 text-muted-foreground">
                    Blogs y actualizaciones del equipo.
                </p>
            </div>
            <ul className="grid list-none grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-0 m-0">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-52 w-full" />
                ))}
            </ul>
        </div>
    )
}
export const BlogsDetailSkeleton = () => {
    return (
        <div className="container mx-auto max-w-3xl px-5 py-10 lg:px-0">
            <div className='flex flex-col gap-4'>
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-6 w-72" />
            </div>
        </div>
    )
}
