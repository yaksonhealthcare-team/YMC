import { Tag } from "./Tag"

type StatusType = "upcoming" | "completed" | "cancelled" | "progressing" | null

const TAG_VARIANTS = {
  upcoming: {
    type: "red",
    title: "remainingDays",
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
  remainingDays: string
}

const ReserveTag = ({ status, remainingDays }: ReserveTagProps) => {
  if (!status) return null

  const variant = TAG_VARIANTS[status]
  const title = status === "upcoming" ? remainingDays : variant.title

  return (
    <Tag
      type={variant.type}
      title={title}
      className="rounded-full min-w-fit px-[8px]"
    />
  )
}

export default ReserveTag
