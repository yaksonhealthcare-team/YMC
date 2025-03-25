import React from "react"
import { Button } from "@components/Button"
import { useOverlay } from "contexts/ModalContext"

interface ReservationCancelBottomSheetContentProps {
  onConfirm: () => void
}

const ReservationCancelBottomSheetContent = ({
  onConfirm,
}: ReservationCancelBottomSheetContentProps) => {
  const { closeOverlay } = useOverlay()

  const handleConfirm = () => {
    closeOverlay()
    onConfirm()
  }

  return (
    <div className="flex flex-col">
      <p className="mx-5 mt-5 font-sb text-18px">취소 금액 안내</p>
      <p className="mx-5 mt-2 font-r text-16px text-gray-900">
        예약 취소 시 차감된 상담 횟수는 복원됩니다.
      </p>
      <div className="mt-10 border-t border-gray-50 flex gap-2 py-3 px-5">
        <Button className="w-full" variantType="line" onClick={handleConfirm}>
          확인
        </Button>
        <Button className="w-full" variantType="primary" onClick={closeOverlay}>
          돌아가기
        </Button>
      </div>
    </div>
  )
}

export default ReservationCancelBottomSheetContent
