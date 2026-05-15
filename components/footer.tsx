"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useT } from "@/providers/language-provider"
import type { LocalizedString } from "@/lib/types/Pages"

const FOOTER: Record<string, LocalizedString> = {
    newsletterLead: {
        es: "Suscríbete a nuestro boletín para mantenerte al día con las novedades y lanzamientos.",
        en: "Subscribe to our newsletter to stay up to date with news and releases.",
    },
    emailPlaceholder: {
        es: "Dejanos tu mail",
        en: "Leave us your email",
    },
    subscribe: {
        es: "Suscribite",
        en: "Subscribe",
    },
    navHome: { es: "Home", en: "Home" },
    navCompany: { es: "Empresa", en: "Company" },
    navBlog: { es: "Blog", en: "Blog" },
    productsTitle: { es: "Productos", en: "Products" },
    businessesTitle: { es: "Negocios", en: "Businesses" },
    restaurants: { es: "Restaurantes", en: "Restaurants" },
    cafes: { es: "Cafés", en: "Cafés" },
    deliveryFirst: { es: "Delivery-first", en: "Delivery-first" },
    rightsReserved: {
        es: "Todos los derechos reservados.",
        en: "All rights reserved.",
    },
    privacy: { es: "Política de privacidad", en: "Privacy policy" },
    terms: { es: "Términos y condiciones", en: "Terms and conditions" },
    cookies: { es: "Configuración de cookies", en: "Cookie settings" },
}

/** Shared 3-column grid so nav, legal links, and footer meta align vertically. */
const FOOTER_COLS =
    "grid w-full min-w-0 grid-cols-3 gap-x-8 sm:gap-x-12 md:gap-x-16"

/** Right column width matches between top nav and bottom meta on large screens. */
const FOOTER_ASIDE = "w-full xl:w-[min(100%,36rem)] xl:shrink-0"

const linkBold = "text-lg font-bold leading-tight hover:opacity-80 transition-opacity"
const linkSub = "text-sm leading-snug hover:opacity-80 transition-opacity"
const colTitle = "text-lg font-bold leading-tight"

function SocialIcons() {
    return (
        <div className="flex gap-4">
            <a
                className="transition-opacity hover:opacity-75"
                href="https://www.instagram.com/loyalz.ar/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16 3.24268H8C5.23858 3.24268 3 5.48126 3 8.24268V16.2427C3 19.0041 5.23858 21.2427 8 21.2427H16C18.7614 21.2427 21 19.0041 21 16.2427V8.24268C21 5.48126 18.7614 3.24268 16 3.24268ZM19.25 16.2427C19.2445 18.0353 17.7926 19.4872 16 19.4927H8C6.20735 19.4872 4.75549 18.0353 4.75 16.2427V8.24268C4.75549 6.45003 6.20735 4.99817 8 4.99268H16C17.7926 4.99817 19.2445 6.45003 19.25 8.24268V16.2427ZM16.75 8.49268C17.3023 8.49268 17.75 8.04496 17.75 7.49268C17.75 6.9404 17.3023 6.49268 16.75 6.49268C16.1977 6.49268 15.75 6.9404 15.75 7.49268C15.75 8.04496 16.1977 8.49268 16.75 8.49268ZM12 7.74268C9.51472 7.74268 7.5 9.7574 7.5 12.2427C7.5 14.728 9.51472 16.7427 12 16.7427C14.4853 16.7427 16.5 14.728 16.5 12.2427C16.5027 11.0484 16.0294 9.90225 15.1849 9.05776C14.3404 8.21327 13.1943 7.74002 12 7.74268ZM9.25 12.2427C9.25 13.7615 10.4812 14.9927 12 14.9927C13.5188 14.9927 14.75 13.7615 14.75 12.2427C14.75 10.7239 13.5188 9.49268 12 9.49268C10.4812 9.49268 9.25 10.7239 9.25 12.2427Z"
                        fill="currentColor"
                    />
                </svg>
            </a>
            <a
                className="transition-opacity hover:opacity-75"
                href="https://www.x.com/loyalz.ar/"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                        d="M17.1761 4.24268H19.9362L13.9061 11.0201L21 20.2427H15.4456L11.0951 14.6493L6.11723 20.2427H3.35544L9.80517 12.9935L3 4.24268H8.69545L12.6279 9.3553L17.1761 4.24268ZM16.2073 18.6181H17.7368L7.86441 5.78196H6.2232L16.2073 18.6181Z"
                        fill="currentColor"
                    />
                </svg>
            </a>
            <a
                className="transition-opacity hover:opacity-75"
                href="https://www.youtube.com/@loyalz"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                        d="M21.5933 7.20301C21.4794 6.78041 21.2568 6.39501 20.9477 6.08518C20.6386 5.77534 20.2537 5.55187 19.8313 5.43701C18.2653 5.00701 12.0003 5.00001 12.0003 5.00001C12.0003 5.00001 5.73633 4.99301 4.16933 5.40401C3.74725 5.52415 3.36315 5.75078 3.0539 6.06214C2.74464 6.3735 2.52062 6.75913 2.40333 7.18201C1.99033 8.74801 1.98633 11.996 1.98633 11.996C1.98633 11.996 1.98233 15.26 2.39233 16.81C2.62233 17.667 3.29733 18.344 4.15533 18.575C5.73733 19.005 11.9853 19.012 11.9853 19.012C11.9853 19.012 18.2503 19.019 19.8163 18.609C20.2388 18.4943 20.6241 18.2714 20.934 17.9622C21.2439 17.653 21.4677 17.2682 21.5833 16.846C21.9973 15.281 22.0003 12.034 22.0003 12.034C22.0003 12.034 22.0203 8.76901 21.5933 7.20301ZM9.99633 15.005L10.0013 9.00501L15.2083 12.01L9.99633 15.005Z"
                        fill="currentColor"
                    />
                </svg>
            </a>
        </div>
    )
}

export default function Footer() {
    const t = useT()

    return (
        <footer className="bg-background flex w-full max-w-full flex-col gap-12 overflow-x-hidden px-4 py-12 text-foreground sm:px-5 sm:py-16 lg:gap-16 lg:px-16">
            {/* Top: newsletter + nav columns (same 3-col grid on the right) */}
            <div className="flex w-full min-w-0 flex-col gap-10 xl:flex-row xl:items-start xl:justify-between xl:gap-12">
                <div className="flex w-full min-w-0 max-w-xl flex-col gap-6">
                    <span className="text-base leading-relaxed">{t(FOOTER.newsletterLead)}</span>
                    <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
                        <Input
                            type="email"
                            placeholder={t(FOOTER.emailPlaceholder)}
                            className="min-h-12 w-full min-w-0 flex-1 px-4 py-3 focus-visible:border-foreground/50 placeholder:text-foreground/50 focus-visible:ring-foreground/20 sm:py-6"
                        />
                        <Button
                            type="button"
                            className="w-full shrink-0 border border-foreground px-4 py-3 sm:w-auto sm:self-stretch sm:py-6"
                        >
                            {t(FOOTER.subscribe)}
                        </Button>
                    </div>
                </div>

                <nav className={`${FOOTER_COLS} ${FOOTER_ASIDE}`} aria-label="Footer">
                    <div className="flex flex-col gap-2">
                        <Link className={linkBold} href="/">
                            {t(FOOTER.navHome)}
                        </Link>
                        <Link className={linkBold} href="/about">
                            {t(FOOTER.navCompany)}
                        </Link>
                        <Link className={linkBold} href="/blog">
                            {t(FOOTER.navBlog)}
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className={colTitle}>{t(FOOTER.productsTitle)}</span>
                        <Link className={linkSub} href="/club">
                            Club
                        </Link>
                        <Link className={linkSub} href="/reviews">
                            Reviews
                        </Link>
                        <Link className={linkSub} href="/pos">
                            Pos
                        </Link>
                        <Link className={linkSub} href="/ai">
                            AI
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className={colTitle}>{t(FOOTER.businessesTitle)}</span>
                        <Link className={linkSub} href="/">
                            {t(FOOTER.restaurants)}
                        </Link>
                        <Link className={linkSub} href="/">
                            {t(FOOTER.cafes)}
                        </Link>
                        <Link className={linkSub} href="/about">
                            {t(FOOTER.deliveryFirst)}
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Bottom: logo left, meta + legal aligned to the same 3 columns */}
            <div className="flex w-full min-w-0 flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
                <svg
                    className="h-auto w-full max-w-full shrink-0 lg:max-w-[min(100%,42rem)] xl:max-w-[min(100%,46rem)]"
                    viewBox="0 0 737 175"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMinYMid meet"
                    aria-hidden
                >
                    <g clipPath="url(#clip0_footer_logo)">
                        <path d="M633.875 132.878C633.875 135.169 632.017 137.027 629.726 137.027H609.446C607.155 137.027 605.297 135.169 605.297 132.878V4.16123C605.297 1.86995 607.155 0.0125029 609.446 0.0125031L629.726 0.0125049C632.017 0.0125051 633.875 1.86995 633.875 4.16124V132.878Z" fill="#F8F5EF" />
                        <path d="M192.741 0C195.033 1.17206e-06 196.89 1.85745 196.89 4.14873L196.89 104.17C196.89 107.851 199.874 110.835 203.554 110.835H257.289C259.581 110.835 261.438 112.692 261.438 114.984V132.88C261.438 135.172 259.581 137.029 257.289 137.029H171.28C168.989 137.029 167.132 135.172 167.132 132.88L167.132 4.14873C167.132 1.85745 168.989 1.33682e-07 171.28 0H192.741Z" fill="#F8F5EF" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M317.247 25.647C328.502 25.647 338.264 27.9079 346.533 32.4315C354.802 36.9551 361.176 43.3839 365.655 51.7169C370.134 60.0499 372.374 69.9311 372.374 81.3593C372.374 92.6682 370.134 102.549 365.655 111.001C361.176 119.334 354.745 125.762 346.361 130.286C338.092 134.81 328.329 137.072 317.074 137.072C305.819 137.072 295.999 134.81 287.615 130.286C279.346 125.643 272.915 119.155 268.321 110.822C263.727 102.489 261.43 92.6085 261.43 81.1805C261.43 69.8714 263.669 60.0499 268.148 51.7169C272.742 43.3838 279.231 36.9552 287.615 32.4315C295.999 27.9079 305.877 25.647 317.247 25.647ZM317.074 51.3604C308.346 51.3605 301.627 54.0383 296.919 59.395C292.325 64.633 290.027 71.8951 290.027 81.1805C290.027 90.4659 292.325 97.8465 296.919 103.322C301.627 108.679 308.346 111.358 317.074 111.358C325.688 111.358 332.292 108.679 336.886 103.322C341.48 97.8465 343.776 90.4658 343.776 81.1805C343.776 71.8951 341.48 64.633 336.886 59.395C332.292 54.0381 325.688 51.3604 317.074 51.3604Z" fill="#F8F5EF" />
                        <path d="M735.378 30.0266C735.378 27.6475 733.521 25.7189 731.229 25.7189H649.646C647.355 25.7189 645.497 27.6475 645.497 30.0266V45.0234C645.497 47.4025 647.355 49.3312 649.646 49.3312L684.931 49.3331C690.623 49.3331 694.592 56.783 690.889 61.2722L646.621 117.687C646.036 118.26 645.474 119.475 645.474 120.54V125.214H645.495V132.719C645.495 135.098 647.353 137.026 649.644 137.026H731.258C733.549 137.026 735.406 135.098 735.406 132.719V117.722C735.406 115.343 733.549 113.414 731.258 113.414H695.673C690.159 113.193 687.247 106.414 690.889 101.998L699.196 91.928L734.451 47.7272C735.362 46.1863 735.403 46.4956 735.403 42.4054V33.3491H735.378V30.0266Z" fill="#F8F5EF" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M62.3 0C65.6317 0 68.3924 2.44482 68.8859 5.6383C68.8859 5.59585 68.8867 5.68056 68.8859 5.6383L68.9645 19.5568C68.9645 19.5992 68.9633 19.5145 68.9625 19.5568C68.9625 23.2309 71.9418 26.1672 75.6159 26.1672L134.681 25.2551C134.968 25.2551 135.246 25.2915 135.512 25.3599C135.565 25.3736 135.618 25.3885 135.67 25.4047C136.972 25.8097 137.931 26.993 138.003 28.4104C138.006 28.467 138.007 28.5241 138.007 28.5814V133.639C138.007 135.476 136.518 136.965 134.681 136.965L74.9669 137.877V137.872C71.2862 137.872 68.3024 134.889 68.3024 131.208L68.298 117.48C68.298 113.805 65.3195 110.827 61.6453 110.827H2.52959C0.692504 110.827 -0.796753 109.338 -0.796753 107.501V3.32634C-0.796753 3.26896 -0.795292 3.21193 -0.792421 3.15526C-0.720613 1.73789 0.238414 0.554642 1.54036 0.149647C1.59244 0.133444 1.64507 0.118487 1.69822 0.104811C1.93741 0.0432634 2.187 0.00757712 2.44384 0.00107752C2.47233 0.000356523 2.50092 2.38293e-08 2.52959 0H62.3ZM35.4899 26.1672C31.8093 26.1672 28.8255 29.151 28.8255 32.8316V77.9953C28.8255 81.6759 31.8093 84.6597 35.4899 84.6597L60.6229 84.755H62.3C65.9807 84.755 68.9645 87.7387 68.9645 91.4194L68.9633 104.174C68.9633 104.217 68.9641 104.132 68.9633 104.174C68.9633 107.848 71.9418 110.827 75.6159 110.827H101.771C105.452 110.827 108.436 107.843 108.436 104.162V58.9989C108.436 55.3182 105.452 52.3344 101.771 52.3344H76.5116L74.9669 52.3115C71.2862 52.3115 68.3024 49.3277 68.3024 45.6471V43.3631H68.298V32.8199C68.298 29.1457 65.3195 26.1672 61.6453 26.1672H35.4899Z" fill="#F8F5EF" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M534.354 25.6483C549.744 25.6483 561.458 29.0934 569.497 35.9843C577.652 42.8753 581.729 52.9246 581.729 66.1322V89.4139L581.609 104.737C581.59 107.041 583.453 108.918 585.757 108.918H591.245C593.43 109.036 595.167 110.846 595.167 113.061V132.933C595.167 135.224 593.309 137.081 591.018 137.081H570.373C568.082 137.081 566.225 135.224 566.225 132.933L566.224 123.431C566.224 119.675 560.816 117.64 558.601 120.896L557.006 123.243C553.721 127.465 549.615 129.456 544.69 132.203C538.718 135.419 531.253 137.026 522.294 137.026C510.121 137.026 500.588 134.097 493.698 128.24C486.807 122.268 483.36 114.458 483.36 104.811C483.36 94.5897 486.921 82.6708 494.041 77.158C501.162 71.6453 511.384 68.8882 524.707 68.8882H551.184C552.925 68.8882 554.337 67.4765 554.337 65.735V64.9262C554.337 53.7859 547.676 48.2161 534.354 48.2161C523.864 48.2161 517.132 51.503 514.155 58.0773C513.581 59.3458 512.383 60.2745 510.991 60.2745H488.765C486.773 60.2745 485.274 58.4451 485.807 56.5255C488.454 46.9929 493.496 39.6287 500.933 34.4334C509.317 28.5761 520.457 25.6483 534.354 25.6483ZM553.111 99.2653C555.818 95.6275 552.869 91.3468 548.336 91.4405L526.569 91.8906H522.908C512.571 91.8906 507.403 95.7378 507.402 103.433C507.402 107.223 508.838 110.151 511.709 112.219C514.58 114.286 518.485 115.32 523.424 115.32C528.822 115.32 533.588 114.344 537.723 112.391C539.864 111.38 541.773 110.2 543.452 108.85C547.351 106.027 550.653 102.569 553.111 99.2653Z" fill="#F8F5EF" />
                        <path d="M395.801 25.9205C397.075 25.9205 398.224 26.6863 398.713 27.8616L399.026 28.6153L421.159 87.9152C423.249 93.9452 432.531 93.9228 434.514 87.8567L456.336 29.4647L456.977 27.8863C457.46 26.6979 458.615 25.9205 459.899 25.9205H480.296C482.56 25.9205 483.697 28.3189 482.805 30.3981L461.89 81.9948L440.802 133.292L432.361 153.261C429.489 160.033 426.158 165.255 422.368 168.928C418.578 172.715 412.778 174.608 404.968 174.608H384.519C382.778 174.608 381.366 173.197 381.366 171.457V154.863C381.366 153.123 382.778 151.713 384.519 151.713H385.135C385.202 151.716 385.27 151.717 385.338 151.717H401.655C401.741 151.717 401.826 151.716 401.911 151.713H402.01C402.251 151.713 402.486 151.685 402.714 151.633C405.166 151.24 407.225 149.502 407.999 147.1L413.023 136.18C413.86 134.36 413.833 132.26 412.95 130.463L401.655 101.691L372.749 30.3031C371.843 28.222 373.369 25.8946 375.64 25.8946L395.801 25.9205Z" fill="#F8F5EF" />
                    </g>
                    <defs>
                        <clipPath id="clip0_footer_logo">
                            <rect width="737" height="174.49" fill="white" />
                        </clipPath>
                    </defs>
                </svg>

                <div className={`flex flex-col gap-16 ${FOOTER_ASIDE}`}>
                    <div className={FOOTER_COLS}>
                        <div className="flex flex-col gap-6">
                            <SocialIcons />
                        </div>
                        <div aria-hidden />
                        <div aria-hidden />
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="text-[10px] text-foreground">
                            © {2026} Loyalz. {t(FOOTER.rightsReserved)}
                        </p>
                        <div className={FOOTER_COLS}>
                            <Link className={`text-xs sm:text-[10px] text-foreground underline hover:opacity-75 duration-300 transition-all`} href="/privacy">
                                {t(FOOTER.privacy)}
                            </Link>
                            <Link className={`text-xs sm:text-[10px] text-foreground underline hover:opacity-75 duration-300 transition-all`} href="/terms">
                                {t(FOOTER.terms)}
                            </Link>
                            <Link className={`text-xs sm:text-[10px] text-foreground underline hover:opacity-75 duration-300 transition-all`} href="/cookies">
                                {t(FOOTER.cookies)}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
