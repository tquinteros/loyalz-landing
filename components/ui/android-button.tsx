import React from "react"

const AndroidButton = ({ fill = "#754390" }: { fill?: string }) => {
  return (
    <a
      href="https://play.google.com/store/apps/details?id=com.loyalz.app"
      target="_blank"
      rel="noreferrer"
      className="flex w-full max-w-[170px] items-center justify-center gap-1.5 rounded border-2 border-[#754390] p-1.5 px-2.5 transition-opacity duration-300 hover:opacity-80 sm:max-w-56 sm:gap-2 sm:px-3"
    >
      <svg
        width="34"
        height="37"
        viewBox="0 0 34 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-[26px] sm:h-9 sm:w-[34px]"
      >
        <path d="M0.847728 36.1283C0.282549 35.846 0 35.1404 0 34.4348C0 34.2936 0 34.0114 0 33.8703C0 23.4269 0 12.9835 0 2.68131C0 2.1168 0.141275 1.69347 0.282549 1.12896C0.423905 0.84666 0.706454 0.564443 0.989085 0.282227C7.06462 6.35062 12.9989 12.419 18.9331 18.4875C12.8576 24.1325 6.92334 30.0599 0.847728 36.1283Z" fill={fill} />
        <path d="M24.8669 12.278C23.1714 13.9715 21.3346 15.665 19.6391 17.4996C13.9874 11.7135 8.19443 5.92729 2.54272 0.141108C2.54272 0.141108 2.54272 0 2.684 0C10.0312 4.09263 17.3784 8.18535 24.8669 12.278Z" fill="#754390" />
        <path d="M2.54272 36.1285C8.19443 30.4834 13.9874 24.8384 19.6391 19.1934C21.1933 20.7457 22.8888 22.2982 24.7257 23.9916C17.3784 28.0843 10.0312 32.177 2.684 36.1285H2.54272Z" fill="#754390" />
        <path d="M25.7145 23.4267C23.8777 21.7333 22.1823 20.0397 20.3455 18.3462C22.1823 16.5116 24.0191 14.6769 25.8558 12.8423C26.421 13.1245 26.9862 13.4068 27.5513 13.8301C28.9643 14.6769 30.5185 15.3826 31.9314 16.2293C32.3553 16.3704 32.6379 16.6527 32.9204 17.076C33.4856 17.7816 33.4856 18.4874 32.9204 19.193C32.6379 19.4752 32.3553 19.7575 31.9314 19.8986C29.9533 21.1687 27.834 22.2978 25.7145 23.4267Z" fill={fill} />
      </svg>
      <div className="flex flex-col gap-0">
        <span className={`text-[8px] uppercase font-semibold leading-none sm:text-[9px] ${fill === "#754390" ? "text-chart-5" : "text-background"}`}>
          Descargá loyalz en
        </span>
        <span className={`text-base font-medium leading-none sm:mt-1 sm:text-2xl ${fill === "#754390" ? "text-chart-5" : "text-background"}`}>
          Google Play
        </span>
      </div>
    </a>
  )
}

export default AndroidButton