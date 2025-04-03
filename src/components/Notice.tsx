import MegaPhoneIcon from "@assets/icons/MegaPhoneIcon.svg?react"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import clsx from "clsx"

interface NoticeProps {
  title: string
  onClick: () => void
  className?: string
}

export const Notice = (props: NoticeProps) => {
  const { title, onClick, className } = props

  return (
    <button
      className={clsx(
        "h-10 flex justify-between items-center p-y-3 px-4 text-primary w-full",
        "focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2",
        "hover:bg-primary-50 transition-colors duration-200",
        "rounded-lg",
        className,
      )}
      onClick={onClick}
      aria-label={`${title} 공지사항 보기`}
      role="link"
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        <MegaPhoneIcon className="w-5 h-5 text-primary" aria-hidden="true" />
        <span className="font-m text-gray-900">{title}</span>
      </div>
      <CaretRightIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
    </button>
  )
}

Notice.displayName = "Notice"
