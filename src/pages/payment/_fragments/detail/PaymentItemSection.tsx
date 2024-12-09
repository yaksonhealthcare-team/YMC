import { format } from "date-fns"
import { PaymentHistoryDetail } from "../../../../types/Payment.ts"
import PaymentItemList from "../PaymentItemList.tsx"

const PaymentItemSection = ({ payment }: { payment: PaymentHistoryDetail }) => {
  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"flex gap-2 items-center"}>
        <p className={"font-sb"}>{format(payment.paidAt, "yyyy.MM.dd")}</p>
        <span
          className={
            "font-m text-12px text-gray-500 bg-gray-50 rounded py-0.5 px-1.5"
          }
        >
          {payment.type}
        </span>
      </div>
      <PaymentItemList
        payment={payment}
        onClickShowCancelHistory={() => {
          console.log("Show")
        }}
      />
    </div>
  )
}

export default PaymentItemSection
