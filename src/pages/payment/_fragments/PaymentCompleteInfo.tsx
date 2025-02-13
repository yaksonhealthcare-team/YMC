import { Divider } from "@mui/material"
import { PaymentCompleteState } from "../../../types/Payment"

interface PaymentInfoProps {
  state: PaymentCompleteState
}

const PaymentInfo = ({ state }: PaymentInfoProps) => {
  if (state.paymentMethod === "CARD") {
    return (
      <div className="px-5 py-6">
        <p className="text-gray-700 font-sb text-16px">
          신용카드 ({state.cardPaymentInfo?.cardName} /{" "}
          {state.cardPaymentInfo?.installment})
        </p>
      </div>
    )
  }

  if (state.paymentMethod === "BANK") {
    return (
      <div className="px-5 py-6">
        <p className="text-gray-700 font-sb text-16px">실시간계좌이체</p>
      </div>
    )
  }

  if (state.paymentMethod === "VBANK") {
    return (
      <>
        <div className="px-5 py-6">
          <p className="text-gray-700 font-sb text-16px">가상계좌</p>
        </div>
        <Divider />
        <div className="px-5 py-6 flex flex-col gap-4">
          <p className="text-center text-gray-700 font-sb text-16px">
            입금 정보
          </p>
          <div className="py-5 px-4 bg-gray-50 rounded-[20px] flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="font-m text-14px text-gray-500">입금은행</span>
              <span className="font-sb text-14px text-gray-700">
                {state.vbankInfo?.bankName} {state.vbankInfo?.account}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-m text-14px text-gray-500">예금주</span>
              <span className="font-sb text-14px text-gray-700">
                {state.vbankInfo?.accountName || "주식회사 약손명가"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-m text-14px text-gray-500">입금기한</span>
              <span className="font-sb text-14px text-error">
                {state.vbankInfo?.limitDate
                  ? new Date(state.vbankInfo.limitDate).toLocaleString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        weekday: "short",
                      },
                    )
                  : "-"}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-m text-16px text-gray-700">입금금액</span>
            <span className="font-b text-20px text-gray-700">
              {Number(state.amount_info.payment_amount).toLocaleString()}원
            </span>
          </div>
        </div>
      </>
    )
  }

  return null
}

export default PaymentInfo
