import { ReactNode } from "react"
import clsx from "clsx"
import { Radio } from "@mui/material"

interface RadioCardProps {
  children: ReactNode
  checked: boolean
  value: number | string
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export const RadioCard = ({
  children,
  checked,
  value,
  className,
  disabled = false,
  onClick,
}: RadioCardProps) => {
  return (
    <label
      className={clsx(
        "w-full p-5 bg-white rounded-xl border justify-between items-center inline-flex cursor-pointer",
        checked ? "border-primary" : "border-gray-100",
        className,
      )}
    >
      <div className="flex-1">{children}</div>
      <div className="relative h-full">
        <Radio
          checked={checked}
          value={value}
          sx={{
            opacity: 0,
            position: "absolute",
            width: "20px",
            height: "20px",
          }}
          disabled={disabled}
          onClick={onClick}
        />
        <div className={clsx("w-5 h-5 relative", disabled && "hidden")}>
          {checked ? (
            <>
              <div className="w-5 h-5 left-0 top-0 absolute bg-primary rounded-full" />
              <div className="w-2 h-2 left-[6px] top-[6px] absolute bg-white rounded-full" />
            </>
          ) : (
            <div className="w-5 h-5 left-0 top-0 absolute rounded-full border-2 border-gray-200" />
          )}
        </div>
      </div>
    </label>
  )
}
