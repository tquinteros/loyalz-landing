import React from 'react'

const AppStoreButton = ({fill = "#754390"}: {fill?: string}) => {
    return (
        <a href="https://apps.apple.com/ar/app/loyalz/id6756419011" target="_blank" className={`hover:opacity-80 transition-opacity duration-300 flex items-center rounded border-2 border-[#754390] w-56 p-1.5 px-3 justify-center gap-2`}>
            <svg width="30" height="36" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.4523 19.1072C24.4143 14.5698 28.1732 12.3581 28.3482 12.2593C26.2176 9.15836 22.9152 8.73274 21.751 8.70234C18.9737 8.41356 16.2876 10.3593 14.8723 10.3593C13.4341 10.3593 11.2578 8.73274 8.90659 8.77838C5.88568 8.82394 3.06266 10.5721 1.51799 13.2778C-1.67791 18.8032 0.703819 26.9203 3.77034 31.3893C5.29974 33.5782 7.08799 36.0179 9.43165 35.9343C11.722 35.8431 12.5819 34.475 15.344 34.475C18.0833 34.475 18.8899 35.9343 21.2792 35.8811C23.737 35.8431 25.2893 33.6846 26.7655 31.4805C28.5385 28.9724 29.2461 26.5023 29.2766 26.3807C29.2157 26.3427 24.498 24.5415 24.4523 19.1072ZM19.94 5.76102C21.1727 4.21817 22.0173 2.1281 21.7814 0C20.0009 0.0759625 17.7637 1.23122 16.4854 2.73612C15.3516 4.06616 14.3319 6.23982 14.5983 8.28434C16.5919 8.42872 18.654 7.27347 19.94 5.76102Z" fill={fill} />
            </svg>
            <div className="flex flex-col gap-0">
                <span className={`text-[9px] ${fill === "#754390" ? "text-chart-5" : "text-background"} font-semibold`}>
                   Descargá loyalz en
                </span>
                <span className={`text-2xl -mt-1 font-medium ${fill === "#754390" ? "text-chart-5" : "text-background"}`}>
                    App Store
                </span>
            </div>
        </a>
    )
}

export default AppStoreButton