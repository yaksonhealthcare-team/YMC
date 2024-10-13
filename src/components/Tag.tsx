import clsx from "clsx"
import { COLORS } from "@constants/ColorConstants"

interface TagProps {
  type: "used" | "unused" | "rect" | "round" | "green" | "blue" | "red"
  title: string
}

export const Tag = (props: TagProps) => {
  const { type, title } = props

  const tagStyles = {
    used: `rounded text-gray-400 bg-gray-100`,
    unused: `rounded text-primary bg-[${COLORS.SECONDARY}]`,
    rect: `rounded text-gray-500 bg-gray-100`,
    round: `text-gray-500 bg-gray-100 rounded-full px-2`,
    green: `text-tag-green bg-tag-greenBg rounded-full px-2`,
    blue: `text-tag-blue bg-tag-blueBg rounded-full px-2`,
    red: `text-tag-red bg-tag-redBg rounded-full px-2`,
  }

  return (
    <span
      className={clsx(
        "border border-transparent px-1.5 py-0.5 font-m text-12px",
        tagStyles[type],
      )}
    >
      {title}
    </span>
  )
}
