import dayjs from "dayjs"

const PaymentCancelReasonSection = ({
  canceledAt,
  reason,
}: {
  canceledAt: Date
  reason: string
}) => {
  return (
    <div className={"flex flex-col gap-3"}>
      <p className={"text-14px font-m text-gray-600"}>{reason}</p>
      <div className={"h-[1px] bg-gray-100"} />
      <div className={"flex justify-between mt-3 items-center"}>
        <p className={"text-14px font-m text-gray-500"}>{"결제 취소일"}</p>
        <p className={"text-14px font-sb"}>
          {dayjs(canceledAt).format("YYYY.MM.DD")}
        </p>
      </div>
    </div>
  )
}

export default PaymentCancelReasonSection
