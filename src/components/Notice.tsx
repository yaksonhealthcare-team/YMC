import MegaPhoneIcon from "@assets/icons/MegaPhoneIcon.svg?react"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"

interface NoticeProps {
  title: string
  onClick: () => void
}

export const Notice = (props: NoticeProps) => {
  const { title, onClick } = props

  return (
    <>
      <div className="h-10 flex justify-between items-center p-y-3 px-4 text-primary">
        <div className="flex items-center gap-2">
          <MegaPhoneIcon className="w-5 h-5" />
          <span>{title}</span>
        </div>
        <button onClick={onClick}>
          <CaretRightIcon className="w-4 h-4" />
        </button>
      </div>
    </>
  )
}
