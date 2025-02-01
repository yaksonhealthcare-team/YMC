import { Tag } from "./Tag"
import calculateDday from "utils/calculateDday"

type StatusType = "upcoming" | "completed" | "cancelled" | "progressing" | null

const TAG_VARIANTS = {
  upcoming: {
    type: "red",
    title: (date: Date) => `D-${calculateDday(date)}`,
  },
  completed: {
    type: "used",
    title: "방문완료",
  },
  cancelled: {
    type: "used",
    title: "예약취소",
  },
  progressing: {
    type: "red",
    title: "D-Day",
  },
} as const

interface ReserveTagProps {
  status: StatusType
  reservationDate: Date
}

const ReserveTag = ({ status, reservationDate }: ReserveTagProps) => {
  if (!status) return null

  const variant = TAG_VARIANTS[status]
  const title =
    typeof variant.title === "function"
      ? variant.title(reservationDate)
      : variant.title

  return <Tag type={variant.type} title={title} className="rounded-full" />
}

export default ReserveTag
