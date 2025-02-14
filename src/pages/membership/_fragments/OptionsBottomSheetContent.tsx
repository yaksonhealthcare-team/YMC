import { useMemo, useState } from "react"
import XCircleIcon from "@components/icons/XCircleIcon.tsx"
import { MembershipOption } from "../../../types/Membership"
import clsx from "clsx"
import { Number } from "@components/Number.tsx"
import CaretDownIcon from "@assets/icons/CaretDownIcon.svg?react"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import { Button } from "@components/Button"
import { useMembershipOptionsStore } from "../../../hooks/useMembershipOptions.ts"
import { usePaymentStore } from "../../../hooks/usePaymentStore.ts"
import { Divider } from "@mui/material"
import { addCart } from "../../../apis/cart.api"
import { queryClient } from "../../../queries/clients"
import { queryKeys } from "../../../queries/query.keys"
import { useOverlay } from "../../../contexts/ModalContext"
import { MembershipBranchSelectModal } from "./MembershipBranchSelectModal.tsx"
import { Branch } from "types/Branch.ts"
import { useNavigate } from "react-router-dom"
import { formatPrice, parsePrice } from "utils/format"
import { toNumber } from "utils/number"

interface SelectedOption {
  option: MembershipOption
  count: number
}

interface Props {
  serviceType?: string
  options: MembershipOption[]
  membershipId: string
  brand: string
  title: string
  duration: number
  brandCode: string
}

export const OptionsBottomSheetContent = ({
  serviceType,
  options,
  membershipId,
  brand,
  title,
  duration,
  brandCode,
}: Props) => {
  const navigate = useNavigate()
  const {
    selectedOptions,
    setSelectedOptions,
    selectedBranch,
    setSelectedBranch,
  } = useMembershipOptionsStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { openModal, closeOverlay } = useOverlay()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { setItems: setPaymentItems, setBranch: setPaymentBranch } =
    usePaymentStore()

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

  const handleCountChange = (option: MembershipOption, count: number) => {
    setSelectedOptions((prev: SelectedOption[]) => {
      const newOptions = prev.filter(
        (item: SelectedOption) => item.option.ss_idx !== option.ss_idx,
      )
      if (count > 0) {
        newOptions.push({ option, count })
      }
      return newOptions
    })
  }

  const calculateTotalPrice = () => {
    return selectedOptions.reduce(
      (total, { option, count }) => total + parsePrice(option.ss_price) * count,
      0,
    )
  }

  const totalPrice = useMemo(() => calculateTotalPrice(), [selectedOptions])

  const handleAddToCart = async () => {
    try {
      let branchType: "전지점" | "지정지점"
      if (serviceType === "앱전용 회원권") {
        branchType = "전지점"
      } else if (serviceType === "지점 회원권") {
        branchType = "지정지점"
      } else {
        branchType = "지정지점"
      }

      const cartItems = selectedOptions.map(({ option, count }) => ({
        s_idx: parseInt(membershipId),
        ss_idx: parseInt(option.ss_idx),
        b_idx: selectedBranch ? parseInt(selectedBranch.b_idx) : 0,
        brand_code: brandCode,
        amount: count,
        b_type: branchType,
      }))

      await addCart(cartItems)
      await queryClient.refetchQueries({ queryKey: queryKeys.carts.all })

      openModal({
        title: "장바구니 담기 완료",
        message:
          "선택하신 상품이 장바구니에 담겼습니다.\n장바구니로 이동하시겠습니까?",
        onConfirm: () => {
          closeOverlay()
          navigate("/cart")
        },
        onCancel: () => {
          closeOverlay()
        },
      })
    } catch (error) {
      alert("장바구니 담기에 실패했습니다. 다시 시도해주세요.")
    }
  }

  const handlePurchase = async () => {
    try {
      // 결제 스토어에 선택한 정보 저장
      const paymentItems = selectedOptions.map(({ option, count }) => ({
        s_idx: parseInt(membershipId),
        ss_idx: parseInt(option.ss_idx),
        b_idx: selectedBranch ? parseInt(selectedBranch.b_idx) : 0,
        brand_code: brandCode,
        amount: count,
        b_type: "지정지점" as const,
        title,
        brand,
        branchType: serviceType === "앱전용 회원권" ? "전지점" : "지정 지점",
        duration,
        price: parseInt(option.ss_price.replace(/,/g, "")),
        originalPrice: option.original_price
          ? parseInt(option.original_price.replace(/,/g, ""))
          : undefined,
        sessions: parseInt(option.ss_count),
      }))

      // 지점 회원권이면서 selectedBranch가 없는 경우에만 return
      if (!selectedBranch && serviceType === "지점 회원권") {
        return
      }

      setPaymentItems(paymentItems)
      setPaymentBranch(
        selectedBranch || {
          b_idx: "0",
          brandCode: brandCode,
          name: brand,
          address: "",
          latitude: 0,
          longitude: 0,
          canBookToday: false,
          distanceInMeters: null,
          isFavorite: false,
          brand: "therapist" as const,
        },
      )

      // 스토어가 업데이트된 후에 네비게이션 실행
      navigate("/payment", { replace: true })

      // 네비게이션이 완료된 후에 오버레이 닫기
      closeOverlay()
    } catch (error) {
      alert("결제 진행 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  const handleClose = () => {
    // 선택된 옵션 초기화
    setSelectedOptions([])
    // 선택된 지점 초기화
    setSelectedBranch(null)
    // 드롭다운 닫기
    setIsDropdownOpen(false)
    // 모달 닫기
    setIsModalOpen(false)
    // 오버레이 닫기
    closeOverlay()
  }

  const handleCartButtonClick = () => {
    if (selectedOptions.length === 0) {
      handleClose()
    } else {
      handleAddToCart()
    }
  }

  const isButtonDisabled = useMemo(() => {
    if (selectedOptions.length === 0) return true
    if (serviceType === "지점 회원권") {
      return !selectedBranch
    }
    return false
  }, [selectedOptions.length, serviceType, selectedBranch])

  return (
    <div className="flex flex-col max-h-[610px] min-h-[500px]">
      {/* 콘텐츠 영역 */}
      <div className="flex-1 p-5">
        {serviceType === "지점 회원권" && (
          <button
            className={
              "w-full border border-gray-100 rounded-xl px-4 py-3 flex justify-between mb-3 items-center"
            }
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsModalOpen(true)
            }}
          >
            <span
              className={`${selectedBranch ? "" : "text-[#bdbdbd]"} text-base font-normal leading-normal`}
            >
              {selectedBranch ? selectedBranch.name : "지점을 선택해주세요"}
            </span>
            <CaretRightIcon className={"w-[18px] h-[18px] text-gray-900"} />
          </button>
        )}

        <div className="w-full relative">
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
        </div>

        {/* 선택된 옵션들 */}
        <div className="mt-5">
          <div className="flex flex-col gap-4">
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
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                      onClick={() => handleCountChange(option, count - 1)}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{count}</span>
                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                      onClick={() => handleCountChange(option, count + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-sb text-16px text-gray-900">
                        {formatPrice(option.ss_price)}
                      </span>
                      <span className="font-r text-14px text-gray-900">원</span>
                    </div>
                    {option.original_price && (
                      <span className="font-r text-14px text-gray-400 line-through">
                        {formatPrice(option.original_price)}원
                      </span>
                    )}
                  </div>
                </div>
                {index !== selectedOptions.length - 1 && (
                  <Divider className={"border-[#F8F8F8]"} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 고정 영역 */}
      <div className="border-t border-gray-100">
        <div className="px-5 py-5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1">
              <span className="font-r text-16px text-gray-900">총</span>
              <span className="font-b text-18px text-primary">
                {selectedOptions.length}개
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-r text-16px text-gray-900">총</span>
              <span className="font-b text-18px text-primary">
                {formatPrice(totalPrice)}원
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variantType={selectedOptions.length === 0 ? "grayLine" : "line"}
              sizeType="l"
              onClick={handleCartButtonClick}
              className={clsx(
                "flex-1",
                selectedOptions.length === 0 && "!text-[#BDBDBD]",
              )}
            >
              {selectedOptions.length === 0 ? "닫기" : "장바구니 담기"}
            </Button>
            <Button
              variantType="primary"
              sizeType="l"
              onClick={handlePurchase}
              className="flex-1"
              disabled={isButtonDisabled}
            >
              바로구매
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <MembershipBranchSelectModal
          onBranchSelect={(branch: Branch) => {
            setSelectedBranch(branch)
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default OptionsBottomSheetContent
