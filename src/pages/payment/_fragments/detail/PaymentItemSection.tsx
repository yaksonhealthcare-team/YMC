import { format } from "date-fns"
import { PaymentHistoryDetail } from "../../../../types/Payment.ts"
import PaymentItemList from "../PaymentItemList.tsx"
import { useNavigate } from "react-router-dom"
import clsx from "clsx"

interface PaymentItemSectionProps {
  payment: PaymentHistoryDetail
  hideButton?: boolean
  className?: string
}

const PaymentItemSection = ({
  payment,
  hideButton = false,
  className,
}: PaymentItemSectionProps) => {
  const navigate = useNavigate()
  return (
    <section
      className={clsx("flex flex-col gap-4", className)}
      aria-label={`${format(payment.paidAt, "yyyy.MM.dd")} 결제 내역`}
    >
      <header className="flex gap-2 items-center">
        <time dateTime={payment.paidAt.toISOString()} className="font-sb">
          {format(payment.paidAt, "yyyy.MM.dd")}
        </time>
        <span
          className={clsx(
            "font-m text-12px text-gray-500 bg-gray-50",
            "rounded py-0.5 px-1.5",
          )}
          role="status"
        >
          {payment.type}
        </span>
      </header>
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
    </section>
  )
}

export default PaymentItemSection
