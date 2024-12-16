import { Button } from "@mui/material"
import clsx from "clsx"
import CaretDownIcon from "@assets/icons/CaretDownIcon.svg?react"
import ReloadIcon from "@components/icons/ReloadIcon"

const FILTER_STYLES = {
  default: "border border-gray-200 font-r text-14px text-gray-500",
  active: "border border-primary font-sb text-14px text-primary",
  defaultNoShrink:
    "border border-gray-200 font-r text-14px text-gray-500 flex-shrink-0",
  activeNoShrink:
    "border border-primary font-sb text-14px text-primary flex-shrink-0",
} as const

const BUTTON_BASE_STYLES = "rounded-full px-3 py-1 min-w-0 h-8"

interface FilterProps {
  label?: string
  type?: "default" | "arrow" | "reload"
  state?: keyof typeof FILTER_STYLES
  onClick?: () => void
}

export const Filter = ({
  label,
  type = "default",
  state = "default",
  onClick,
}: FilterProps) => (
  <Button
    variant="outlined"
    className={clsx(FILTER_STYLES[state], BUTTON_BASE_STYLES)}
    onClick={onClick}
    endIcon={type === "arrow" ? <CaretDownIcon /> : undefined}
  >
    {type === "reload" ? <ReloadIcon /> : label}
  </Button>
)

Filter.displayName = "Filter"
