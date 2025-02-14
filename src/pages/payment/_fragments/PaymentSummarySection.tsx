import { Divider } from "@mui/material"
import { formatPriceWithUnit } from "utils/format"

interface PaymentSummarySectionProps {
  totalAmount: number
  discountAmount: number
  pointAmount: number
  finalAmount: number
}

const PaymentSummarySection = ({
  totalAmount,
  discountAmount,
  pointAmount,
  finalAmount,
}: PaymentSummarySectionProps) => {
  return (
    <div className="p-5 border-b-8 border-gray-50">
      <h2 className="text-gray-700 font-sb text-16px mb-4">결제 금액</h2>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <span className="text-gray-500 text-14px font-m">상품 금액</span>
          <span className="text-gray-700 font-sb text-14px">
            {formatPriceWithUnit(totalAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-14px font-m">상품할인금액</span>
          <span className="text-success font-sb text-14px">
            -{formatPriceWithUnit(discountAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-14px font-m">포인트 사용</span>
          <span className="text-success font-sb text-14px">
            -{formatPriceWithUnit(pointAmount)}
          </span>
        </div>
      </div>
      <Divider className="my-4" />
      <div className="flex justify-between items-center">
        <span className="text-gray-700 text-16px font-m">최종결제금액</span>
        <span className="text-gray-700 font-b text-20px">
          {formatPriceWithUnit(finalAmount)}
        </span>
      </div>
    </div>
  )
}

export default PaymentSummarySection
