import { format } from "date-fns"
import { PaymentHistoryDetail } from "../../../../types/Payment.ts"
import PaymentItemList from "../PaymentItemList.tsx"
import { useNavigate } from "react-router-dom"

const PaymentItemSection = ({
  payment,
  hideButton = false,
}: {
  payment: PaymentHistoryDetail
  hideButton?: boolean
}) => {
  const navigate = useNavigate()
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
        onClickShowCancelHistory={
          !hideButton
            ? () => {
                navigate(`/payment/${payment.index}/cancel-detail`)
              }
            : undefined
        }
      />
    </div>
  )
}

export default PaymentItemSection
