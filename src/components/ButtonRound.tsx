import clsx from "clsx"

interface ButtonRoundProps {
  title: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export const ButtonRound = (props: ButtonRoundProps) => {
  const { title, onClick, className, disabled = false } = props

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "h-9 flex flex-col justify-center items-center px-4 rounded-full font-sb text-12px whitespace-nowrap leading-[12px]",
        "focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2",
        "transition-colors duration-200",
        disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-primary text-white hover:bg-primary-400",
        className,
      )}
      aria-label={`${title}${disabled ? " (비활성화됨)" : ""}`}
      aria-disabled={disabled}
    >
      {title}
    </button>
  )
}
