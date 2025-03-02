import { RadioGroup } from "@mui/material"
import { RadioCard } from "./RadioCard"
import { Gender, getGenderDisplay } from "../utils/gender"

interface GenderSelectProps {
  value: Gender
  onChange?: (gender: Gender) => void
  disabled?: boolean
  className?: string
}

export function GenderSelect({
  value,
  onChange,
  disabled,
  className = "",
}: GenderSelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value as Gender)
  }

  if (disabled) {
    return (
      <div className="flex gap-2">
        {["F", "M"].map((gender) => (
          <button
            key={gender}
            className={`flex-1 h-[52px] px-5 rounded-xl border flex justify-between items-center cursor-not-allowed opacity-75 ${
              value === gender
                ? "bg-[#FEF2F1] border-primary"
                : "border-[#ECECEC] bg-gray-50"
            } ${className}`}
            disabled
          >
            <span
              className={`text-16px ${value === gender ? "font-semibold" : "text-gray-500"}`}
            >
              {getGenderDisplay(gender as Gender)}
            </span>
            <div
              className={`w-5 h-5 rounded-full ${
                value === gender
                  ? "bg-primary flex items-center justify-center opacity-75"
                  : "border-2 border-[#DDDDDD] bg-gray-100"
              }`}
            >
              {value === gender && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <RadioGroup value={value} onChange={handleChange}>
      <div className={`flex gap-2 ${className}`}>
        {["F", "M"].map((gender) => (
          <RadioCard
            key={gender}
            value={gender}
            checked={value === gender}
            className={`flex-1 !min-h-[52px] !py-4 !px-4 !rounded-[12px] ${
              value === gender ? "!bg-[#FEF2F1] !border-primary" : ""
            }`}
          >
            <p className="text-[16px] font-semibold leading-[20px]">
              {getGenderDisplay(gender as Gender)}
            </p>
          </RadioCard>
        ))}
      </div>
    </RadioGroup>
  )
}
