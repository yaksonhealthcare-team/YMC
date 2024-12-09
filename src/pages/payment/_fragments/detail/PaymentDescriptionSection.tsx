import { PaymentHistoryDetail } from "../../../../types/Payment.ts"

const PaymentDescriptionSection = ({
  payment,
}: {
  payment: PaymentHistoryDetail
}) => {
  return (
    <div className={"flex flex-col"}>
      <div className={"flex justify-between items-center"}>
        <p className={"text-14px font-m text-gray-500"}>{"결제 수단"}</p>
        <p className={"text-14px font-sb"}>{payment.payMethod}</p>
      </div>
      <div className={"flex justify-between mt-3 items-center"}>
        <p className={"text-14px font-m text-gray-500"}>{"총 주문 금액"}</p>
        <p className={"text-14px font-sb"}>
          {payment.totalPrice.toLocaleString()}원
        </p>
      </div>
      <div className={"flex justify-between mt-3 items-center"}>
        <p className={"text-14px font-m text-gray-500"}>{"포인트 사용"}</p>
        <p className={"text-14px font-sb"}>
          -{payment.usedPoint.toLocaleString()}P
        </p>
      </div>
      <div className={"h-[1px] bg-gray-100 mt-4"} />
      <div className={"flex justify-between mt-4 items-center"}>
        <p className={"font-m text-gray-700"}>{"최종 결제 금액"}</p>
        <p className={"text-20px font-b text-gray-700"}>
          {payment.actualPrice.toLocaleString()}원
        </p>
      </div>
    </div>
  )
}

export default PaymentDescriptionSection
