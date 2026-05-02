import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionWrapper } from "./section-wrapper"
import type { HeroClubSectionProps } from "@/lib/types/Pages"
import Image from "next/image"
import AppStoreButton from "../ui/app-store-button"
import AndroidButton from "../ui/android-button"

type Props = HeroClubSectionProps & {
  backgroundImage?: string | null
  className?: string | null
}

export default function HeroClubSection({
  title,
  subtitle,
  image,
  primaryCta,
  backgroundImage,
  className,
}: Props) {
  return (
    <SectionWrapper
      backgroundImage={backgroundImage}
      className={className}
      innerClassName="!bg-background"
    >
      <div className="grid grid-cols-12 py-24">
        <div className="col-span-7 flex flex-col justify-between h-full bg-white p-12 rounded-[32px]">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-chart-5">
              {title}
            </h1>
            {subtitle ? (
              <p className="font-bold text-4xl max-w-2xl text-chart-5">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex gap-3">
              <AppStoreButton />
              <AndroidButton />
            </div>
            {primaryCta?.href && primaryCta.label ? (
              <Button asChild size="lg" className="w-fit h-12">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div className="col-span-2 bg-chart-5 flex items-center justify-center rounded-[32px]">
          <svg width="97" height="99" viewBox="0 0 97 99" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1_11120)">
              <path fillRule="evenodd" clipRule="evenodd" d="M43.963 1.41064C46.2885 1.41064 48.2154 3.1171 48.5599 5.34612C48.5599 5.31649 48.5605 5.37562 48.5599 5.34612L48.6147 15.0611C48.6147 15.0907 48.6139 15.0316 48.6133 15.0611C48.6133 17.6256 50.6928 19.6751 53.2574 19.6751L94.4839 19.0384C94.6843 19.0384 94.8787 19.0639 95.0642 19.1116C95.1013 19.1211 95.138 19.1316 95.1744 19.1429C96.0831 19.4256 96.7525 20.2515 96.8026 21.2408C96.8046 21.2803 96.8057 21.3201 96.8057 21.3602V94.6892C96.8057 95.9715 95.7662 97.0109 94.4839 97.0109L52.8043 97.6476V97.6442C50.2353 97.6442 48.1526 95.5615 48.1526 92.9924L48.1495 83.4102C48.1495 80.8456 46.0706 78.7667 43.506 78.7667H2.24387C0.961605 78.7667 -0.0778808 77.7272 -0.0778809 76.4449V3.73239C-0.0778809 3.69235 -0.0768611 3.65253 -0.0748574 3.61298C-0.0247362 2.62367 0.644655 1.79778 1.5534 1.5151C1.58975 1.50379 1.62649 1.49335 1.66359 1.4838C1.83054 1.44084 2.00475 1.41593 2.18402 1.4114C2.20391 1.41089 2.22386 1.41064 2.24387 1.41064H43.963ZM25.2498 19.6751C22.6808 19.6751 20.5981 21.7577 20.5981 24.3268V55.8505C20.5981 58.4196 22.6808 60.5022 25.2498 60.5022L42.7924 60.5687H43.963C46.5321 60.5687 48.6147 62.6513 48.6147 65.2204L48.6139 74.1232C48.6144 74.0937 48.6139 74.1528 48.6139 74.1232C48.6139 76.6877 50.6928 78.7667 53.2574 78.7667H71.5135C74.0826 78.7667 76.1652 76.684 76.1652 74.1149V42.5912C76.1652 40.0221 74.0826 37.9395 71.5135 37.9395H53.8825L52.8043 37.9235C50.2353 37.9235 48.1526 35.8409 48.1526 33.2718V31.6776H48.1495V24.3186C48.1495 21.754 46.0706 19.6751 43.506 19.6751H25.2498Z" fill="#DBC5E8" />
            </g>
            <defs>
              <clipPath id="clip0_1_11120">
                <rect width="96.8663" height="98.9827" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="col-span-3 rounded-[32px]">
          {image ? (
            <Image
              src={image}
              alt={title}
              width={500}
              height={500}
              className="h-full bg-background w-full rounded-[32px] object-cover"
            />
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  )
}
