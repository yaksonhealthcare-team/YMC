import { Button } from "@components/Button"
import { Divider } from "@mui/material"
import { Number } from "@components/Number"
import CaretDownIcon from "@assets/icons/CaretDownIcon.svg?react"
import { useState } from "react"

const MembershipDetailBottomSheetContent = () => {
  const [count30, setCount30] = useState(1)
  const [count10, setCount10] = useState(2)

  return (
    <>
      {/* Select Dropdown */}
      <div className="px-5">
        <button className="w-full flex justify-between items-center px-4 py-3 border border-gray-200 rounded-xl">
          <span className="font-r text-16px text-gray-400">
            관리 횟수를 선택해주세요
          </span>
          <CaretDownIcon className="w-4 h-4 text-gray-900" />
        </button>
      </div>

      {/* Options */}
      <div className="px-5 mt-5">
        <div className="flex flex-col gap-4">
          {/* 30회 옵션 */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="font-m text-16px text-gray-900">30회</span>
              {/* 체크박스로 변경 필요 */}
              <div className="w-5 h-5 rounded-sm bg-gray-300" />
            </div>
            <div className="flex justify-between items-center">
              <Number
                count={count30}
                onClickMinus={() => setCount30((prev) => Math.max(0, prev - 1))}
                onClickPlus={() => setCount30((prev) => prev + 1)}
              />
              <div className="flex items-center gap-2">
                <div className="flex items-baseline gap-0.5">
                  <span className="font-sb text-16px text-gray-900">
                    1,032,000
                  </span>
                  <span className="font-r text-14px text-gray-900">원</span>
                </div>
                <span className="font-r text-14px text-gray-400 line-through">
                  240,000원
                </span>
              </div>
            </div>
          </div>

          <Divider className={"border-gray-200"} />

          {/* 10회 옵션 */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="font-m text-16px text-gray-900">10회</span>
              <div className="w-5 h-5 rounded-sm bg-gray-300" />
            </div>
            <div className="flex justify-between items-center">
              <Number
                count={count10}
                onClickMinus={() => setCount10((prev) => Math.max(0, prev - 1))}
                onClickPlus={() => setCount10((prev) => prev + 1)}
              />
              <div className="flex items-center gap-2">
                <div className="flex items-baseline gap-0.5">
                  <span className="font-sb text-16px text-gray-900">
                    1,032,000
                  </span>
                  <span className="font-r text-14px text-gray-900">원</span>
                </div>
                <span className="font-r text-14px text-gray-400 line-through">
                  240,000원
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="mt-5 px-5 py-5 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="font-r text-16px text-gray-900">총</span>
            <span className="font-b text-18px text-primary">
              {count30 + count10}개
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-r text-16px text-gray-900">총</span>
            <span className="font-b text-18px text-primary">2,310,000원</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pt-3">
        <div className="flex gap-2">
          <Button variantType="line" sizeType="l" className="flex-1">
            장바구니 담기
          </Button>
          <Button variantType="primary" sizeType="l" className="flex-1">
            바로구매
          </Button>
        </div>
      </div>
    </>
  )
}

export default MembershipDetailBottomSheetContent
