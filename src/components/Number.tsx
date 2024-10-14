import clsx from "clsx"
import MinusIcon from "@assets/icons/MinusIcon.svg?react"
import PlusIcon from "@assets/icons/PlusIcon.svg?react"

interface NumberProps {
  count: number
  disabled?: boolean
  onClickMinus: () => void
  onClickPlus: () => void
}

export const Number = (props: NumberProps) => {
  const { count, disabled, onClickMinus, onClickPlus } = props

  const isMinusDisabled = disabled || count === 0

  return (
    <>
      <div className="flex items-center">
        <button
          className="flex justify-center items-center w-6 h-6 border rounded-l"
          onClick={onClickMinus}
          disabled={isMinusDisabled}
        >
          <MinusIcon
            className={clsx("w-4 h-4", { "text-gray-300": isMinusDisabled })}
          />
        </button>
        <span
          className={clsx(
            "w-8 h-6 font-sb text-14px text-gray-700 border-y flex justify-center",
            { "text-gray-300": disabled },
          )}
        >
          {count}
        </span>
        <button
          className="flex justify-center items-center w-6 h-6 border rounded-r"
          onClick={onClickPlus}
          disabled={disabled}
        >
          <PlusIcon
            className={clsx("w-4 h-4", {
              "text-gray-300": disabled,
            })}
          />
        </button>
      </div>
    </>
  )
}
