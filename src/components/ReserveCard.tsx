import clsx from "clsx"
import { ReservationStatus } from "types/Reservation"
import ReserveTag from "./ReserveTag"
import { Button } from "./Button"
import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import DateAndTime from "./DateAndTime"

interface ReserveCardProps {
  id: string
  status: ReservationStatus
  store: string
  title: string
  count: number
  date: Date
  className?: string
}

export const ReserveCard = (props: ReserveCardProps) => {
  const { id, status, store, title, count, date, className } = props

  const navigate = useNavigate()
  const classifyReservationStatus = (status: ReservationStatus) => {
    const statusGroups = {
      upcoming: [
        ReservationStatus.CONFIRMED,
        ReservationStatus.APPROVED,
        ReservationStatus.PENDING,
      ],
      completed: [ReservationStatus.COMPLETED],
      cancelled: [
        ReservationStatus.CUSTOMER_CANCELLED,
        ReservationStatus.STORE_CANCELLED,
        ReservationStatus.NO_SHOW,
      ],
      proressing: [ReservationStatus.IN_PROGRESS],
    }

    if (statusGroups.upcoming.includes(status)) return "upcoming"
    if (statusGroups.completed.includes(status)) return "completed"
    if (statusGroups.cancelled.includes(status)) return "cancelled"
    if (statusGroups.proressing.includes(status)) return "progressing"
    return null
  }

  const getButton = (): ReactNode => {
    const buttonTexts = {
      completed: "만족도 작성",
      progressing: "방문 완료",
    }

    const statusType = classifyReservationStatus(status)

    if (!statusType || statusType === "upcoming") return null
    if (!statusType || statusType === "cancelled") return null

    return (
      <Button variantType="primary" sizeType="xs">
        {buttonTexts[statusType]}
      </Button>
    )
  }

  return (
    <>
      <div
        className={clsx(
          `flex justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px]`,
          className,
        )}
        onClick={() => navigate(`/reservation/${id}`)}
      >
        <div>
          <span className="font-b text-16px text-gray-700">{store}</span>
          <div className="mt-1">
            <span className="font-r text-14px text-gray-700">{title}</span>
            <span className="ml-1.5 font-sb text-14px text-primary">
              {count}회차
            </span>
          </div>
          <DateAndTime date={date} className="mt-3" />
        </div>
        <div className="flex flex-col justify-between items-end">
          <ReserveTag
            status={classifyReservationStatus(status)}
            reservationDate={date}
          />
          {getButton()}
        </div>
      </div>
    </>
  )
}
