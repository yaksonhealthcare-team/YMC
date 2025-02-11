import { Divider } from "@mui/material"
import { PaymentCompleteState } from "../../../types/Payment"

interface PaymentSummaryProps {
  state: PaymentCompleteState
  isVirtual: boolean
}

const PaymentSummary = ({ state, isVirtual }: PaymentSummaryProps) => (
  <div className="p-5 flex flex-col gap-4">
    <p className="font-sb text-16px text-gray-700">결제 내역</p>
    <div className="flex flex-col gap-4 py-4 rounded-lg">
      <div className="flex justify-between">
        <span className="font-m text-14px text-gray-500">상품 금액</span>
        <span className="font-sb text-14px text-gray-700">
          {state.amount.toLocaleString()}원
        </span>
      </div>
      {(state.pointAmount ?? 0) > 0 && (
        <div className="flex justify-between">
          <span className="font-m text-14px text-gray-500">포인트 사용</span>
          <span className="font-sb text-14px text-success">
            -{state.pointAmount?.toLocaleString()}원
          </span>
        </div>
      )}
      <Divider />
      <div className="flex justify-between items-center">
        <span className="font-m text-16px text-gray-700">
          {isVirtual ? "입금금액" : "최종결제금액"}
        </span>
        <span className="font-b text-20px text-gray-700">
          {(state.amount - (state.pointAmount ?? 0)).toLocaleString()}원
        </span>
      </div>
      {isVirtual && (
        <p className="self-end text-error font-sb text-14px">결제미완료</p>
      )}
    </div>
    <div className="w-full h-[96px]" />
  </div>
)

export default PaymentSummary
