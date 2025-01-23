import { useMemo, useState, useEffect } from "react"
import XCircleIcon from "@components/icons/XCircleIcon.tsx"
import { MembershipOption } from "../../../types/Membership"
import clsx from "clsx"
import { Number } from "@components/Number.tsx"
import CaretDownIcon from "@assets/icons/CaretDownIcon.svg?react"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import { Button } from "@components/Button"
import {
  SelectedOption,
  useMembershipOptionsStore,
} from "../../../hooks/useMembershipOptions.ts"
import { Divider } from "@mui/material"
import { addCart } from "../../../apis/cart.api"
import { useOverlay } from "../../../contexts/ModalContext"
import { queryClient } from "../../../queries/clients"
import { queryKeys } from "../../../queries/query.keys"
import { useLayout } from "../../../contexts/LayoutContext"

interface Props {
  serviceType?: string
  options: MembershipOption[]
  onClickBranchSelect: () => void
  onAddToCartSuccess: () => void
  membershipId: string
}

export const OptionsBottomSheetContent = ({
  serviceType,
  options,
  onClickBranchSelect,
  onAddToCartSuccess,
  membershipId,
}: Props) => {
  const { closeOverlay } = useOverlay()
  const { selectedOptions, setSelectedOptions, selectedBranch } =
    useMembershipOptionsStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { setHeader } = useLayout()

  useEffect(() => {
    setHeader({
      left: "back",
      title: "옵션 선택",
    })
  }, [])

  const handleSelectOption = (option: MembershipOption) => {
    const existingOption = selectedOptions.find(
      (selectedOption) => selectedOption.option.ss_idx === option.ss_idx,
    )

    if (existingOption) {
      return
    }

    const newSelectedOptions = [
      {
        option,
        count: 1,
      },
      ...selectedOptions,
    ]
    setSelectedOptions(newSelectedOptions)
  }

  const handleRemoveOption = (optionId: string) => {
    const newSelectedOptions = selectedOptions.filter(
      (option) => option.option.ss_idx !== optionId,
    )
    setSelectedOptions(newSelectedOptions)
  }

  const handleCountChange = (optionId: string, newCount: number) => {
    if (newCount < 1) {
      return
    }

    const newSelectedOptions = selectedOptions.map((selectedOption) =>
      selectedOption.option.ss_idx === optionId
        ? { ...selectedOption, count: newCount }
        : selectedOption,
    )
    setSelectedOptions(newSelectedOptions)
  }

  const calculateTotalPrice = () => {
    return selectedOptions.reduce(
      (total, { option, count }) =>
        total + parseInt(option.ss_price.replace(/,/g, "")) * count,
      0,
    )
  }

  const totalPrice = useMemo(() => calculateTotalPrice(), [selectedOptions])

  const handleAddToCart = async () => {
    if (!selectedBranch) {
      alert("지점을 선택해주세요")
      return
    }

    try {
      const cartItems = selectedOptions.map(({ option, count }) => ({
        s_idx: parseInt(membershipId),
        ss_idx: parseInt(option.ss_idx),
        b_idx: parseInt(selectedBranch.id),
        brand_code: selectedBranch.brandCode,
        amount: count,
        b_type: "M" as const, // M: 회원권, P: 패키지
      }))

      await addCart(cartItems)
      await queryClient.refetchQueries({ queryKey: queryKeys.carts.all })
      closeOverlay()
      onAddToCartSuccess()
    } catch (error) {
      console.error("장바구니 담기 실패:", error)
      alert("장바구니 담기에 실패했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <div className="flex flex-col h-[610px]">
      <div className="flex flex-1 flex-col items-center p-3 pt-6">
        {serviceType?.includes("지점") && (
          <button
            className={
              "w-full border border-gray-100 rounded-xl px-4 py-3 flex justify-between mb-3 items-center"
            }
            onClick={onClickBranchSelect}
          >
            <span
              className={`${selectedBranch ? "" : "text-[#bdbdbd]"} text-base font-normal leading-normal`}
            >
              {selectedBranch ? selectedBranch.name : "지점을 선택해주세요"}
            </span>
            <CaretRightIcon className={"w-[18px] h-[18px] text-gray-900"} />
          </button>
        )}

        <div className="w-full mx-auto relative flex-1">
          <button
            className={clsx(
              "w-full h-[52px] px-4 py-3 bg-white flex justify-between items-center",
              isDropdownOpen
                ? "rounded-t-xl border border-[#ebebeb] border-b-0"
                : "rounded-xl border border-[#ebebeb]",
            )}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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

          {isDropdownOpen && (
            <div className="absolute z-10 w-full bg-white rounded-b-xl border border-[#dddddd] flex flex-col">
              {options.map((option, index) => (
                <button
                  key={option.ss_idx}
                  className={`w-full px-4 py-3.5 text-left text-[#212121] text-sm font-normal border-b border-[#ebebeb] hover:bg-gray-50 
            ${index === options.length - 1 ? "rounded-b-xl border-b-0" : ""}`}
                  onClick={() => {
                    handleSelectOption(option)
                    setIsDropdownOpen(false)
                  }}
                >
                  {option.ss_count}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4 mt-5 px-3">
            {selectedOptions.map(({ option, count }, index) => (
              <div key={option.ss_idx} className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-m text-16px text-gray-900">
                    {option.ss_count}
                  </span>
                  <XCircleIcon
                    className="w-5 cursor-pointer"
                    onClick={() => handleRemoveOption(option.ss_idx)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Number
                    count={count}
                    onClickMinus={() =>
                      handleCountChange(option.ss_idx, count - 1)
                    }
                    onClickPlus={() =>
                      handleCountChange(option.ss_idx, count + 1)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-sb text-16px text-gray-900">
                        {option.ss_price}
                      </span>
                      <span className="font-r text-14px text-gray-900">원</span>
                    </div>
                    {option.original_price && (
                      <span className="font-r text-14px text-gray-400 line-through">
                        {option.original_price}원
                      </span>
                    )}
                  </div>
                </div>
                {index !== selectedOptions.length - 1 && (
                  <Divider className={"border-[#F8F8F8"} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 px-5 py-5 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="font-r text-16px text-gray-900">총</span>
            <span className="font-b text-18px text-primary">
              {selectedOptions.length}개
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-r text-16px text-gray-900">총</span>
            <span className="font-b text-18px text-primary">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-3">
        <div className="flex gap-2">
          <Button
            variantType="line"
            sizeType="l"
            className="flex-1"
            disabled={selectedOptions.length === 0}
            onClick={handleAddToCart}
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
