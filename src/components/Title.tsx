import clsx from "clsx"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"

const TITLE_STYLES = {
  title: "font-b text-18px text-gray-700",
  count: "ml-1.5 font-b text-18px text-primary",
  arrow: "w-4 h-4",
} as const

interface TitleProps {
  type?: "default" | "arrow"
  title: string
  count?: string
  onClick?: () => void
  className?: string
}

export const Title = ({
  type = "default",
  title,
  count,
  onClick,
  className,
}: TitleProps) => (
  <div onClick={onClick} className={clsx("flex justify-between", className)}>
    <div>
      <span className={TITLE_STYLES.title}>{title}</span>
      {count && <span className={TITLE_STYLES.count}>{count}</span>}
    </div>
    {type === "arrow" && onClick && (
      <button>
        <CaretRightIcon className={TITLE_STYLES.arrow} />
      </button>
    )}
  </div>
)

Title.displayName = "Title"
