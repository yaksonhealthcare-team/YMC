import { Divider } from "@mui/material"
import { PaymentCompleteState } from "../../../types/Payment"

const BANK_CODE_MAP: { [key: string]: string } = {
  "02": "한국산업은행",
  "03": "기업은행",
  "04": "국민은행",
  "05": "하나은행",
  "07": "수협은행",
  "11": "농협은행",
  "20": "우리은행",
  "23": "SC제일은행",
  "27": "씨티은행",
  "31": "대구은행",
  "32": "부산은행",
  "34": "광주은행",
  "35": "제주은행",
  "37": "전북은행",
  "39": "경남은행",
  "45": "새마을금고",
  "48": "신협",
  "50": "상호저축은행",
  "64": "산림조합",
  "71": "우체국",
  "81": "하나은행",
  "88": "신한은행",
  "89": "케이뱅크",
  "90": "카카오뱅크",
  "92": "토스뱅크",
}

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
    const bankName = state.vbankInfo?.bankCode
      ? BANK_CODE_MAP[state.vbankInfo.bankCode] || "확인불가"
      : "확인불가"

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
                {bankName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-m text-14px text-gray-500">계좌번호</span>
              <span className="font-sb text-14px text-gray-700">
                {state.vbankInfo?.account || "확인불가"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-m text-14px text-gray-500">예금주</span>
              <span className="font-sb text-14px text-gray-700">
                {state.vbankInfo?.accountName || "확인불가"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-m text-14px text-gray-500">입금기한</span>
              <span className="font-sb text-14px text-error">
                {state.vbankInfo?.limitDate || "확인불가"}
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
