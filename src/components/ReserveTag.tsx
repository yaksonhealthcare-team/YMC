import { ReservationStatus } from "types/Reservation"
import { Tag } from "./Tag"
import calculateDday from "utils/calculateDday"

const TAG_VARIANTS = {
  [ReservationStatus.UPCOMING]: {
    type: "red",
    title: (date: Date) => `D${calculateDday(date)}`,
  },
  [ReservationStatus.CANCELED]: {
    type: "used",
    title: "예약취소",
  },
  [ReservationStatus.IN_PROGRESS]: {
    type: "red",
    title: "D-Day",
  },
  [ReservationStatus.COMPLETED]: {
    type: "used",
    title: "방문완료",
  },
  [ReservationStatus.COUNSELING_CONFIRMED]: {
    type: "red",
    title: (date: Date) => `D${calculateDday(date)}`,
  },
  [ReservationStatus.COUNSELING_CANCELED]: {
    type: "used",
    title: "예약취소",
  },
} as const

interface ReserveTagProps {
  status: ReservationStatus
  reservationDate: Date
}

const ReserveTag = ({ status, reservationDate }: ReserveTagProps) => {
  const variant = TAG_VARIANTS[status]
  const title =
    typeof variant.title === "function"
      ? variant.title(reservationDate)
      : variant.title

  return <Tag type={variant.type} title={title} className="rounded-full" />
}

export default ReserveTag
