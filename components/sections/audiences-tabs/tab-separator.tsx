"use client"

type Props = {
  label?: string
  separatorText: string
}

export function AudienceTabSeparator({ label, separatorText }: Props) {
  if (!separatorText) return null

  return (
    <div className="flex flex-col gap-4 rounded-[28px] bg-background p-8 sm:rounded-[32px] lg:p-15">
      {label ? (
        <div className="flex items-center gap-2">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect width="10" height="10" rx="2" fill="#F8F5EF" />
          </svg>
          <span className="text-foreground">{label}</span>
        </div>
      ) : null}
      <p className="text-xl font-bold text-foreground sm:text-[60px]">
        {separatorText}
      </p>
    </div>
  )
}
