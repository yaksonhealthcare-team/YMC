import clsx from "clsx"
import CaretRightIcon from "@assets/icons/CaretRight.svg?react"

interface TitleProps {
  type?: "arrow"
  title: string
  count?: number
  onClick?: () => void
}

export const Title = (props: TitleProps) => {
  const { type = "default", title, count, onClick } = props

  const buttonStyles = {
    default: ``,
    arrow: ``,
  }

  return (
    <>
      <div
        onClick={onClick}
        className={clsx(`flex justify-between`, buttonStyles[type])}
      >
        <div>
          <span className="font-b text-18px text-gray-700">{title}</span>
          {count && (
            <span className="ml-1.5 font-b text-18px text-primary">
              {count}건
            </span>
          )}
        </div>
        {type === "arrow" && onClick && (
          <button>
            <CaretRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  )
}
