import clsx from "clsx"
import { ReservationStatus } from "types/Reservation"
import ReserveTag from "./ReserveTag"
import { Button } from "./Button"
import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import DateAndTime from "./DateAndTime"

interface ReserveCardProps {
  id: number
  status: ReservationStatus
  store: string
  title: string
  count: number
  date: Date
  time: string
  className?: string
}

export const ReserveCard = (props: ReserveCardProps) => {
  const { id, status, store, title, count, date, time, className } = props

  const navigate = useNavigate()

  const getButton = (): ReactNode => {
    switch (status) {
      case ReservationStatus.UPCOMING:
        return null
      case ReservationStatus.IN_PROGRESS:
        return (
          <Button variantType="primary" sizeType="xs">
            방문완료
          </Button>
        )
      case ReservationStatus.COMPLETED:
        return (
          <Button variantType="primary" sizeType="xs">
            만족도 작성
          </Button>
        )
      default:
        return null
    }
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
          <ReserveTag status={status} reservationDate={new Date(date)} />
          {getButton()}
        </div>
      </div>
    </>
  )
}
