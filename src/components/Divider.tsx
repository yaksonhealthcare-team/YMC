import clsx from "clsx"

interface DividerProps {
  type: "m" | "s_100" | "s_200"
}

export const Divider = (props: DividerProps) => {
  const { type } = props

  const dividerStyles = {
    m: `h-2 bg-gray-50`,
    s_100: `h-[1px] rounded-[1px] bg-gray-100`,
    s_200: `h-[1px] rounded-[1px] bg-gray-200`,
  }

  return (
    <>
      <div className={clsx(``, dividerStyles[type])}></div>
    </>
  )
}
