import { Button } from "@components/Button"

interface CancelConfirmBottomSheetContentProps {
  onConfirm: () => void
}

const CancelConfirmBottomSheetContent = ({
  onConfirm,
}: CancelConfirmBottomSheetContentProps) => {
  return (
    <>
      <div className="px-5 py-4">
        <div className="pt-5 pb-6 flex flex-col items-center gap-2">
          <h3 className="font-sb text-18px text-gray-700">
            취소가 완료되었습니다.
          </h3>
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
      </div>
    </>
  )
}

export default CancelConfirmBottomSheetContent
