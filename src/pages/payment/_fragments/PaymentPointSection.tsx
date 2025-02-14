import { Button } from "@components/Button"

interface PaymentPointSectionProps {
  availablePoints: number
  usedPoints: number
  onPointChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUseAllPoints: () => void
}

const PaymentPointSection = ({
  availablePoints,
  usedPoints,
  onPointChange,
  onUseAllPoints,
}: PaymentPointSectionProps) => {
  return (
    <div className="p-5 border-b-8 border-gray-50">
      <h2 className="text-gray-700 font-sb text-16px mb-4">포인트</h2>
      <div className="flex gap-2 mb-2">
        <input
          type="number"
          value={usedPoints || ""}
          onChange={onPointChange}
          placeholder="0"
          className="flex-1 p-3 border border-gray-100 rounded-xl font-r text-16px"
        />
        <Button
          variantType="secondary"
          sizeType="s"
          onClick={onUseAllPoints}
          disabled={availablePoints === 0}
          className="!px-[20px] shrink-0 h-[52px] text-[16px]"
        >
          전액 사용
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-14px font-m">사용 가능 포인트</span>
        <span className="text-primary text-14px font-m">
          {availablePoints.toLocaleString()}P
        </span>
      </div>
    </div>
  )
}

export default PaymentPointSection
