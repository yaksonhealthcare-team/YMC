import { Number } from "@components/Number"
import ClockIcon from "@assets/icons/ClockIcon.svg?react"
import XCircleIcon from "@components/icons/XCircleIcon.tsx"
import { CartItemOption } from "../types/Cart.ts"

interface PaymentCardProps {
  brand: string
  branchType: string
  title: string
  duration: number
  options: CartItemOption[]
  onCountChange: (cartId: string, newCount: number) => void
  onDelete: () => void
  onDeleteOption?: (cartIds: string[]) => void
}

const PaymentCard = ({
  brand,
  branchType,
  title,
  duration,
  options,
  onCountChange,
  onDelete,
  onDeleteOption,
}: PaymentCardProps) => {
  return (
    <div className="p-5 bg-white rounded-[20px] border border-[#DDDDDD]">
      {/* 상단 정보 */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="px-1.5 py-0.5 bg-[#ECECEC] rounded">
              <span className="text-[#757575] text-12px font-m">
                {branchType}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[#757575] text-14px font-r">
              {duration}분 소요
            </span>
          </div>
        </div>

        {/* 브랜드명과 상품명 */}
        <div className="flex flex-col gap-1">
          <p className="text-[#212121] text-14px font-r">{brand}</p>
          <p className="text-[#212121] text-16px font-sb">{title}</p>
        </div>
      </div>

      {/* 옵션 목록 */}
      <div className="mt-5 flex flex-col gap-4">
        {options
          .sort((lhs, rhs) => rhs.sessions - lhs.sessions)
          .map((option, idx) => {
            const count = option.items.reduce(
              (prev, acc) => prev + acc.count,
              0,
            )
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#212121] text-16px font-m">
                    {option.sessions}회
                  </span>
                  <button
                    onClick={() =>
                      onDeleteOption?.(
                        option.items.flatMap((item) => item.cartId),
                      )
                    }
                  >
                    <XCircleIcon className="w-5 h-5 text-[#9E9E9E]" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
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
                  <div className="flex items-center gap-2">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[#212121] text-16px font-sb">
                        {(option.price * count).toLocaleString()}
                      </span>
                      <span className="text-[#212121] text-14px font-r">
                        원
                      </span>
                    </div>
                    {option.originalPrice !== option.price && (
                      <span className="text-[#BDBDBD] text-14px font-r line-through">
                        {(option.originalPrice * count).toLocaleString()}원
                      </span>
                    )}
                  </div>
                </div>
                {idx < options.length - 1 && (
                  <div className="w-full h-[1px] bg-[#ECECEC] my-4" />
                )}
              </div>
            )
          })}
      </div>

      {/* 삭제 버튼 */}
      <button
        onClick={onDelete}
        className="w-full h-10 mt-6 bg-[#ECECEC] rounded-lg text-[#212121] text-14px font-sb"
      >
        삭제하기
      </button>
    </div>
  )
}

export default PaymentCard
