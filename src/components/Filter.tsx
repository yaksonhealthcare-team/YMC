import { Button } from "@mui/material"
import CaretDownIcon from "@assets/icons/CaretDownIcon.svg?react"
import ReloadIcon from "@components/icons/ReloadIcon"

type FilterProps = {
  label?: string
  type?: "default" | "arrow" | "reload"
  state?: "default" | "active"
  onClick?: () => void
}

export const Filter = (props: FilterProps) => {
  const { label, type = "default", state = "default", onClick } = props

  const stateClasses = {
    default: "border border-gray-200 font-r text-14px text-gray-500",
    active: "border border-primary font-sb text-14px text-primary",
  }

  return (
    <>
      <Button
        variant="outlined"
        className={`${stateClasses[state]} rounded-full px-3 py-1 min-w-0 h-8`}
        onClick={onClick}
        endIcon={type === "arrow" && <CaretDownIcon />}
      >
        {type === "reload" ? <ReloadIcon /> : label}
      </Button>
    </>
  )
}
