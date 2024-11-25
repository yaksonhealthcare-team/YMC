import { Button } from "@components/Button"

interface CounselingCancelBottomSheetContentProps {
  onConfirm: () => void
  onCancel: () => void
}

const CounselingCancelBottomSheetContent = ({
  onConfirm,
  onCancel,
}: CounselingCancelBottomSheetContentProps) => {
  return (
    <>
      <div className="px-5 py-4">
        <div className="pt-5 pb-6 flex flex-col items-center gap-2">
          <h3 className="font-sb text-18px text-gray-700">취소하시겠습니까?</h3>
          <p className="font-r text-16px text-gray-700 text-center leading-normal">
            예약 취소 시 차감된 상담 횟수는 복원됩니다.
          </p>
        </div>
      </div>

      <div className="flex gap-[8px] pt-3 bg-white border-t border-gray-50">
        <Button
          className="flex-1 rounded-xl"
          variantType="line"
          onClick={() => {
            onCancel()
            onConfirm()
          }}
        >
          취소하기
        </Button>
        <Button className="flex-1 rounded-xl" onClick={onCancel}>
          돌아가기
        </Button>
      </div>
    </>
  )
}

export default CounselingCancelBottomSheetContent
