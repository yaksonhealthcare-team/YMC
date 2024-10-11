import clsx from "clsx"

interface DividerProps {
  type: "m" | "s_100" | "s_200" | "r"
}

export const Divider = (props: DividerProps) => {
  const { type } = props

  const dividerStyles = {
    m: `w-[375px] h-2 bg-gray-50`,
    s_100: `w-[335px] h-[1px] rounded-[1px] bg-gray-100`,
    s_200: `w-[335px] h-[1px] rounded-[1px] bg-gray-200`,
    r: `w-[52px] h-1.5 rounded-[100px] bg-gray-200`,
  }

  return (
    <>
      <div className={clsx(``, dividerStyles[type])}></div>
    </>
  )
}
