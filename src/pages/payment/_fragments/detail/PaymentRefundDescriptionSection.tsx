import { PaymentHistoryDetail } from "../../../../types/Payment.ts"

const PaymentRefundDescriptionSection = ({
  payment,
}: {
  payment: PaymentHistoryDetail
}) => {
  const payMethod = payment.items[0].cancel.payMethod
  const price = payment.items.reduce(
    (acc, curr) => acc + curr.cancel.canceledPrice,
    0,
  )
  const points = payment.items.reduce(
    (acc, curr) => acc + curr.cancel.usedPoint,
    0,
  )

  return (
    <div className={"flex flex-col"}>
      <div className={"flex justify-between items-center"}>
        <p className={"text-14px font-m text-gray-500"}>{"환불 수단"}</p>
        <p className={"text-14px font-sb"}>{payMethod}</p>
      </div>
      <div className={"flex justify-between mt-3 items-center"}>
        <p className={"text-14px font-m text-gray-500"}>{"주문 금액"}</p>
        <p className={"text-14px font-sb"}>
          {payment.totalPrice.toLocaleString()}원
        </p>
      </div>
      <div className={"flex justify-between mt-3 items-center"}>
        <p className={"text-14px font-m text-gray-500"}>{"포인트 사용"}</p>
        <p className={"text-14px font-sb"}>-{points.toLocaleString()}P</p>
      </div>
      <div className={"h-[1px] bg-gray-100 mt-4"} />
      <div className={"flex justify-between mt-4 items-center"}>
        <p className={"font-m text-gray-700"}>{"총 환불 금액"}</p>
        <p className={"text-20px font-b text-gray-700"}>
          {price.toLocaleString()}원
        </p>
      </div>
    </div>
  )
}

export default PaymentRefundDescriptionSection
