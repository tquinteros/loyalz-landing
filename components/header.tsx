"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = () => {
    return (
        <header className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full container mx-auto flex justify-between items-center p-3 px-5 lg:px-0 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                    <Link href="/">Home</Link>
                    <Link href="/blogs">Blogs</Link>
                </div>
            </div>
        </header>
    )
}

export default Header