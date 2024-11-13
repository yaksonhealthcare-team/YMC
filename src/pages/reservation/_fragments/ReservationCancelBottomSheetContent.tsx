import { Button } from "@components/Button"

interface ReservationCancelBottomSheetContentProps {
  onConfirm: () => void
}

const ReservationCancelBottomSheetContent = ({
  onConfirm,
}: ReservationCancelBottomSheetContentProps) => {
  return (
    <>
      <div className="px-5 py-4">
        <div className="pt-5 pb-6 flex flex-col items-center gap-2">
          <h3 className="font-sb text-18px text-gray-700">취소 금액 안내</h3>
          <p className="font-r text-16px text-gray-700 text-center leading-normal">
            취소된 추가 관리 결제 금액은
            <br />
            영업일 기준 3일 이내에 환불처리 됩니다.
          </p>
        </div>
      </div>

      <div className="pt-3 bg-white border-t border-gray-50">
        <div className="px-5">
          <Button
            variantType="primary"
            sizeType="l"
            className="w-full"
            onClick={onConfirm}
          >
            확인
          </Button>
        </div>
        <div className="h-[30px] relative">
          <div className="w-[130px] h-[5px] absolute left-1/2 transform -translate-x-1/2 top-5 bg-[#131313] rounded-sm" />
        </div>
      </div>
    </>
  )
}

export default ReservationCancelBottomSheetContent
