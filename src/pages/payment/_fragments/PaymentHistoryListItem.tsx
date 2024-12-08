import { PaymentHistory } from "../../../types/Payment.ts"
import { format } from "date-fns"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import { Button } from "@components/Button.tsx"
import { useOverlay } from "../../../contexts/ModalContext.tsx"
import { usePointsEarn } from "../../../queries/usePointQueries.tsx"
import PaymentHistoryItemCard from "./PaymentItemList.tsx"

const PointCard = ({ point }: { point: number }) => (
  <div className={"bg-red-50 rounded-xl p-4"}>
    <p
      className={"text-14px font-m text-primary"}
    >{`+${point.toLocaleString()}P 적립되었습니다.`}</p>
  </div>
)

const ReceivePointBottomSheet = ({
  point,
  onClose,
}: {
  point: number
  onClose: () => void
}) => {
  return (
    <div className={"flex flex-col items-center"}>
      <div className={"flex items-center gap-2 mt-5"}>
        <span className={"bg-primary rounded-full font-b text-white w-6 h-6"}>
          P
        </span>
        <p
          className={"text-20px font-b text-primary"}
        >{`+${point.toLocaleString()}`}</p>
      </div>
      <p className={"mt-4"}>{"포인트가 적립되었습니다."}</p>
      <div className={"border-t border-gray-50 pt-3 px-5 mt-10 w-full"}>
        <Button className={"w-full"} variantType={"primary"} onClick={onClose}>
          확인
        </Button>
      </div>
    </div>
  )
}

const PaymentHistoryListItem = ({ payment }: { payment: PaymentHistory }) => {
  const { openBottomSheet, closeOverlay } = useOverlay()
  const { mutateAsync: earnPoints } = usePointsEarn()

  const handleReceivePoint = async () => {
    await earnPoints(payment.id)
    openBottomSheet(
      <ReceivePointBottomSheet point={payment.point} onClose={closeOverlay} />,
    )
  }

  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"flex justify-between items-center"}>
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
        <CaretRightIcon className="w-4 h-4" />
      </div>
      {payment.pointStatus === "done" && <PointCard point={payment.point} />}
      <PaymentHistoryItemCard payment={payment} />
      {payment.pointStatus === "yet" &&
        !payment.status.includes("취소") &&
        payment.type.includes("현장") && (
          <Button
            variantType={"gray"}
            className={"h-10"}
            onClick={handleReceivePoint}
          >
            <p className={"text-14px font-sb"}>{"포인트 받기"}</p>
          </Button>
        )}
    </div>
  )
}

export default PaymentHistoryListItem
