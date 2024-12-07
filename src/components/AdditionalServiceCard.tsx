import ClockIcon from "@assets/icons/ClockIcon.svg?react"
import { Button } from "@components/Button.tsx"

interface AdditionalServiceCardProps {
  id: string
  title: string
  duration: number
  price: number
  onDelete: () => void
}

const AdditionalServiceCard = ({
  title,
  duration,
  price,
  onDelete,
}: AdditionalServiceCardProps) => {
  return (
    <div className="mb-4 p-5 bg-white rounded-[20px] border border-gray-200">
      <div className="flex flex-col gap-5">
        {/* 헤더 */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="px-1.5 py-0.5 bg-gray-100 rounded inline-flex">
              <span className="text-gray-500 text-12px font-m">추가 관리</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5 text-primary" />
              <span className="text-gray-500 text-14px font-r">
                {duration}분 소요
              </span>
            </div>
          </div>
          <h3 className="text-gray-700 text-16px font-sb">{title}</h3>
        </div>

        {/* 가격 */}
        <div className="flex justify-end items-center">
          <div className="flex items-center gap-1">
            <span className="text-gray-700 text-16px font-sb">
              {price.toLocaleString()}
            </span>
            <span className="text-gray-700 text-14px font-r">원</span>
          </div>
        </div>
      </div>

      {/* 삭제 버튼 */}
      <Button
        variantType="gray"
        sizeType="s"
        onClick={onDelete}
        className="w-full mt-6"
      >
        삭제하기
      </Button>
    </div>
  )
}

export default AdditionalServiceCard
