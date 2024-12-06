import { Number } from "@components/Number"
import ClockIcon from "@assets/icons/ClockIcon.svg?react"

interface CartOption {
  sessions: number
  count: number
  price: number
  originalPrice: number
}

interface CartCardProps {
  brand: string
  branchType: "전지점" | "지정 지점"
  title: string
  duration: number
  options: CartOption[]
  onCountChange: (optionIndex: number, newCount: number) => void
  onDelete: () => void
}

const CartCard = ({
  brand,
  branchType,
  title,
  duration,
  options,
  onCountChange,
  onDelete,
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

      {options.map((option, idx) => (
        <div key={idx} className="mb-4 last:mb-0">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-gray-700 text-16px font-m">
              {option.sessions}회
            </span>
          </div>
          <div className="flex w-full justify-between items-center mb-4">
            <div className="flex w-full items-center justify-between gap-4">
              <Number
                count={option.count}
                onClickMinus={() =>
                  onCountChange(idx, Math.max(0, option.count - 1))
                }
                onClickPlus={() => onCountChange(idx, option.count + 1)}
              />
              <div className={"flex items-center gap-4"}>
                <div>
                  <span className="text-gray-700 text-16px font-sb">
                    {option.price.toLocaleString()}
                  </span>
                  <span className="text-gray-700 text-14px font-r ml-1">
                    원
                  </span>
                </div>
                <span className="text-gray-300 text-14px font-r line-through">
                  {option.originalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
          {idx < options.length - 1 && (
            <div className="w-full h-[1px] bg-gray-100 my-4" />
          )}
        </div>
      ))}

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
