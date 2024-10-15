import clsx from "clsx"

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "default" | "finish" | "strong"
  title: string
  onClick?: () => void
}

export const Chip = (props: ChipProps) => {
  const { type = "default", title } = props

  const styles = {
    default: `bg-tag-redBg text-primary`,
    finish: `bg-gray-100 text-gray-400`,
    strong: `bg-primary text-white`,
  }

  return (
    <>
      <div
        className={clsx(
          "py-[3px] px-2 font-m text-12px rounded-full",
          styles[type],
        )}
      >
        <span>{title}</span>
      </div>
    </>
  )
}
