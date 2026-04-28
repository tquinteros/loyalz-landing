"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { ArrowRightIcon } from 'lucide-react'

const Header = () => {
    return (
        <header className="w-full flex justify-center text-black border-b border-b-foreground/10 h-20 sticky top-0 bg-[#F8F5EF] z-50">
            <div className="w-full flex justify-between items-center p-3 px-5 lg:px-20 text-sm">
                <div className="flex items-center gap-5">
                    <Link href="/">
                        <Image src="/logo.svg" alt="logo" width={32} height={32} />
                    </Link>
                    <div className="flex gap-5 items-center font-semibold">
                        <Link href="/">Empresa</Link>
                        <Link href="/blogs">Productos</Link>
                        <Link href="/blogs">Tipos de Negocio</Link>
                        <Link href="/admin" prefetch={false}>Admin</Link>
                    </div>
                </div>
                <div>
                    <Button variant="outline" className="text-white py-5">
                        Consultá por tu negocio <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header