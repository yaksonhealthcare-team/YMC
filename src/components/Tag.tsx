import clsx from "clsx"
import { COLORS } from "@constants/ColorConstants"

const TAG_VARIANTS = {
  used: "rounded text-gray-400 bg-gray-100",
  unused: `rounded text-primary bg-[${COLORS.SECONDARY}]`,
  rect: "rounded text-gray-500 bg-gray-100",
  round: "text-gray-500 bg-gray-100 rounded-full px-2",
  green: "text-tag-green bg-tag-greenBg rounded-full px-2",
  blue: "text-tag-blue bg-tag-blueBg rounded-full px-2",
  red: "text-tag-red bg-tag-redBg rounded-full px-2",
} as const

const BASE_STYLES =
  "border border-transparent px-[6px] py-[2px] font-m text-12px h-[22px] flex items-center justify-center !leading-none"

interface TagProps {
  type: keyof typeof TAG_VARIANTS
  title: string
  className?: string
}

export const Tag = ({ type, title, className }: TagProps) => (
  <span className={clsx(BASE_STYLES, TAG_VARIANTS[type], className)}>
    {title}
  </span>
)

Tag.displayName = "Tag"
