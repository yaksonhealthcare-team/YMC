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
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export const Title = ({
  type = "default",
  title,
  count,
  onClick,
  className,
  headingLevel = "h2",
}: TitleProps) => {
  const HeadingTag = headingLevel

  return (
    <header
      className={clsx("flex justify-between items-center", className)}
      role="banner"
    >
      <div>
        <HeadingTag className={TITLE_STYLES.title}>{title}</HeadingTag>
        {count && (
          <span className={TITLE_STYLES.count} aria-label={`${count}개의 항목`}>
            {count}
          </span>
        )}
      </div>
      {type === "arrow" && onClick && (
        <button
          onClick={onClick}
          className={clsx(
            "flex justify-between p-1",
            className,
            "focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2 rounded-lg",
          )}
          aria-label={`${title} ${count ? `${count}개의` : ""} 전체 목록 보기`}
        >
          <CaretRightIcon className={TITLE_STYLES.arrow} aria-hidden="true" />
        </button>
      )}
    </header>
  )
}

Title.displayName = "Title"
