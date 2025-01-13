import { Number } from "@components/Number"
import ClockIcon from "@assets/icons/ClockIcon.svg?react"
import XCircleIcon from "@components/icons/XCircleIcon.tsx"
import { CartItemOption } from "../types/Cart.ts"

interface CartCardProps {
  brand: string
  branchType: string
  title: string
  duration: number
  options: CartItemOption[]
  onCountChange: (cartId: string, newCount: number) => void
  onDelete: () => void
  onDeleteOption: (cartIds: string[]) => void
}

const CartCard = ({
  brand,
  branchType,
  title,
  duration,
  options,
  onCountChange,
  onDelete,
  onDeleteOption,
}: CartCardProps) => {
  return (
    <div className="mb-4 p-5 bg-white rounded-[20px] border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <div className="px-1.5 py-0.5 bg-gray-100 rounded inline-flex">
          <span className="text-gray-500 text-12px font-m">{branchType}</span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <ClockIcon className="w-3.5 h-3.5 text-primary" />
          <span className="text-gray-500 text-14px font-r">
            {duration}분 소요
          </span>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-gray-700 text-14px font-r">{brand}</p>
        <p className="text-gray-700 text-16px font-sb mt-1">{title}</p>
      </div>

      {options
        .sort((lhs, rhs) => rhs.sessions - lhs.sessions)
        .map((option, idx) => {
          const count = option.items.reduce((prev, acc) => prev + acc.count, 0)
          return (
            <div key={idx} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 text-16px font-m">
                  {option.sessions}회
                </span>
                <button
                  onClick={() =>
                    onDeleteOption(option.items.flatMap((item) => item.cartId))
                  }
                >
                  <XCircleIcon className={"w-4"} />
                </button>
              </div>
              <div className="flex w-full justify-between items-center mb-4">
                <div className="flex w-full items-center justify-between gap-4">
                  <Number
                    count={count}
                    minimumCount={1}
                    onClickMinus={() => {
                      onCountChange(
                        option.items[0].cartId,
                        Math.max(0, option.items[0].count - 1),
                      )
                    }}
                    onClickPlus={() =>
                      onCountChange(
                        option.items[0].cartId,
                        option.items[0].count + 1,
                      )
                    }
                  />
                  <div className={"flex items-center gap-4"}>
                    <div>
                      <span className="text-gray-700 text-16px font-sb">
                        {(option.price * count).toLocaleString()}
                      </span>
                      <span className="text-gray-700 text-14px font-r ml-1">
                        원
                      </span>
                    </div>
                    {option.originalPrice !== option.price && (
                      <span className="text-gray-300 text-14px font-r line-through">
                        {(option.originalPrice * count).toLocaleString()}원
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {idx < options.length - 1 && (
                <div className="w-full h-[1px] bg-gray-100 my-4" />
              )}
            </div>
          )
        })}

      <button
        onClick={onDelete}
        className="w-full py-2.5 mt-4 bg-gray-100 rounded-lg text-gray-700 text-14px font-sb"
      >
        삭제하기
      </button>
    </div>
  )
}

export default CartCard
