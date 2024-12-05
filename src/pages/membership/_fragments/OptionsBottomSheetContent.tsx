import { Button } from "@components/Button"
import { Number } from "@components/Number"
import CaretDownIcon from "@assets/icons/CaretDownIcon.svg?react"
import { useMemo, useState } from "react"
import XCircleIcon from "@components/icons/XCircleIcon.tsx"
import { MembershipOption } from "types/Membership"
import clsx from "clsx"

interface OptionsBottomSheetContentProps {
  options: MembershipOption[]
}

interface SelectedOption {
  option: MembershipOption
  count: number
}

const OptionsBottomSheetContent = ({
  options,
}: OptionsBottomSheetContentProps) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const totalAmount = useMemo(() => {
    return selectedOptions.reduce((acc, curr) => {
      const price = parseInt(
        curr.option.subscriptionPrice.replace(/,/g, ""),
        10,
      )
      return acc + price * curr.count
    }, 0)
  }, [selectedOptions])

  const totalCount = useMemo(
    () => selectedOptions.reduce((acc, curr) => acc + curr.count, 0),
    [selectedOptions],
  )

  const handleSelectOption = (option: MembershipOption) => {
    setSelectedOptions((prev) => {
      const existingOption = prev.find(
        (selected) =>
          selected.option.subscriptionIndex === option.subscriptionIndex,
      )

      if (existingOption) {
        return prev.map((item) =>
          item.option.subscriptionIndex === option.subscriptionIndex
            ? { ...item, count: item.count + 1 }
            : item,
        )
      }

      return [...prev, { option, count: 1 }]
    })
  }

  const handleCountChange = (optionIndex: string, newCount: number) => {
    if (newCount <= 0) {
      handleRemoveOption(optionIndex)
      return
    }

    setSelectedOptions((prev) =>
      prev.map((item) =>
        item.option.subscriptionIndex === optionIndex
          ? { ...item, count: newCount }
          : item,
      ),
    )
  }

  const handleRemoveOption = (optionIndex: string) => {
    setSelectedOptions((prev) =>
      prev.filter((item) => item.option.subscriptionIndex !== optionIndex),
    )
  }

  return (
    <div className="flex flex-col h-[610px] ">
      {/* Select Dropdown */}
      <div className="w-full mx-auto relative flex-1">
        <button
          className={clsx(
            "w-full h-[52px] px-4 py-3 bg-white flex justify-between items-center",
            isDropdownOpen
              ? "rounded-t-xl border border-[#ebebeb] border-b-0"
              : "rounded-xl border border-[#ebebeb]",
          )}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <span className="text-[#bdbdbd] text-base font-normal leading-normal">
            관리 횟수를 선택해주세요
          </span>
          <CaretDownIcon
            className={`w-4 h-4 text-gray-900 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute w-full bg-white rounded-b-xl border border-[#dddddd] flex flex-col">
            {options.map((option, index) => (
              <button
                key={option.subscriptionIndex}
                className={`w-full px-4 py-3.5 text-left text-[#212121] text-sm font-normal border-b border-[#ebebeb] hover:bg-gray-50 
            ${index === options.length - 1 ? "rounded-b-xl border-b-0" : ""}`}
                onClick={() => {
                  handleSelectOption(option)
                  setIsDropdownOpen(false)
                }}
              >
                {option.subscriptionCount}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Options */}
      <div className="px-5 mt-5">
        <div className="flex flex-col gap-4">
          {selectedOptions.map(({ option, count }) => (
            <div key={option.subscriptionIndex} className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="font-m text-16px text-gray-900">
                  {option.subscriptionCount}
                </span>
                <XCircleIcon
                  className="w-5 cursor-pointer"
                  onClick={() => handleRemoveOption(option.subscriptionIndex)}
                />
              </div>
              <div className="flex justify-between items-center">
                <Number
                  count={count}
                  onClickMinus={() =>
                    handleCountChange(option.subscriptionIndex, count - 1)
                  }
                  onClickPlus={() =>
                    handleCountChange(option.subscriptionIndex, count + 1)
                  }
                />
                <div className="flex items-center gap-2">
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-sb text-16px text-gray-900">
                      {option.subscriptionPrice}
                    </span>
                    <span className="font-r text-14px text-gray-900">원</span>
                  </div>
                  {option.subscriptionOriginalPrice && (
                    <span className="font-r text-14px text-gray-400 line-through">
                      {option.subscriptionOriginalPrice}원
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mt-5 px-5 py-5 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="font-r text-16px text-gray-900">총</span>
            <span className="font-b text-18px text-primary">
              {totalCount}개
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-r text-16px text-gray-900">총</span>
            <span className="font-b text-18px text-primary">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pt-3">
        <div className="flex gap-2">
          <Button
            variantType="line"
            sizeType="l"
            className="flex-1"
            disabled={selectedOptions.length === 0}
          >
            장바구니 담기
          </Button>
          <Button
            variantType="primary"
            sizeType="l"
            className="flex-1"
            disabled={selectedOptions.length === 0}
          >
            바로구매
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OptionsBottomSheetContent
