import { ReservationStatus } from "types/Reservation"
import { Tag, TagType } from "./Tag"
import calculateDday from "utils/calculateDday"

interface ReserveTagProps {
  status: ReservationStatus
  reservationDate: Date
}

const ReserveTag = ({ status, reservationDate }: ReserveTagProps) => {
  const getTagContent = (): string => {
    switch (status) {
      case ReservationStatus.UPCOMING:
        return `D${calculateDday(reservationDate)}`
      case ReservationStatus.CANCELLED:
        return "예약취소"
      case ReservationStatus.IN_PROGRESS:
        return "D-Day"
      case ReservationStatus.COMPLETED:
        return "방문완료"
      case ReservationStatus.COUNSELING_CONFIRMED:
        return `D${calculateDday(reservationDate)}`
      default:
        return ""
    }
  }

  const getTagType = (): TagType => {
    switch (status) {
      case ReservationStatus.UPCOMING:
        return "red"
      case ReservationStatus.CANCELLED:
        return "used"
      case ReservationStatus.IN_PROGRESS:
        return "red"
      case ReservationStatus.COMPLETED:
        return "used"
      case ReservationStatus.COUNSELING_CONFIRMED:
        return "red"
      default:
        return "red"
    }
  }

  return (
    <Tag type={getTagType()} title={getTagContent()} className="rounded-full" />
  )
}

export default ReserveTag
