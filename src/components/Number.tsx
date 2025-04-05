import clsx from "clsx"
import MinusIcon from "@assets/icons/MinusIcon.svg?react"
import PlusIcon from "@assets/icons/PlusIcon.svg?react"

interface NumberProps {
  count: number
  disabled?: boolean
  minimumCount?: number
  maximumCount?: number
  onClickMinus: () => void
  onClickPlus: () => void
}

export const Number = (props: NumberProps) => {
  const {
    count,
    disabled,
    minimumCount,
    maximumCount = 999,
    onClickMinus,
    onClickPlus,
  } = props

  const isMinusDisabled = disabled || count === (minimumCount || 0)
  const isPlusDisabled = disabled || count === maximumCount

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" && !isPlusDisabled) {
      onClickPlus()
    } else if (e.key === "ArrowDown" && !isMinusDisabled) {
      onClickMinus()
    }
  }

  return (
    <div
      className="flex items-center"
      role="spinbutton"
      aria-valuenow={count}
      aria-valuemin={minimumCount || 0}
      aria-valuemax={maximumCount}
      aria-label={`수량 조절, 현재 ${count}${disabled ? ", 비활성화됨" : ""}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <button
        className={clsx(
          "flex justify-center items-center w-6 h-6 border rounded-l",
          "",
          {
            "bg-gray-50 border-gray-100": isMinusDisabled,
            "hover:bg-gray-50": !isMinusDisabled,
          },
        )}
        onClick={onClickMinus}
        disabled={isMinusDisabled}
        aria-label={`수량 감소 (현재 ${count}${isMinusDisabled ? ", 최소 수량" : ""})`}
        aria-controls="current-count"
      >
        <MinusIcon
          className={clsx("w-4 h-4", { "text-gray-300": isMinusDisabled })}
          aria-hidden="true"
        />
      </button>
      <span
        id="current-count"
        className={clsx(
          "w-8 h-6 font-sb text-14px text-gray-700 border-y flex justify-center",
          { "text-gray-300": disabled },
        )}
        role="status"
        aria-live="polite"
        aria-label={`현재 수량 ${count}`}
      >
        {count}
      </span>
      <button
        className={clsx(
          "flex justify-center items-center w-6 h-6 border rounded-r",
          "",
          {
            "bg-gray-50 border-gray-100": isPlusDisabled,
            "hover:bg-gray-50": !isPlusDisabled,
          },
        )}
        onClick={onClickPlus}
        disabled={isPlusDisabled}
        aria-label={`수량 증가 (현재 ${count}${isPlusDisabled ? ", 최대 수량" : ""})`}
        aria-controls="current-count"
      >
        <PlusIcon
          className={clsx("w-4 h-4", {
            "text-gray-300": isPlusDisabled,
          })}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
