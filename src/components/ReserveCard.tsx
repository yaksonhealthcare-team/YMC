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

  const getButton = (): ReactNode => {
    const isUpcoming = [
      ReservationStatus.CONFIRMED,
      ReservationStatus.APPROVED,
      ReservationStatus.PENDING,
    ].includes(status)

    const isCompleted = [
      ReservationStatus.COMPLETED,
      ReservationStatus.IN_PROGRESS,
    ].includes(status)

    const isCancelled = [
      ReservationStatus.CUSTOMER_CANCELLED,
      ReservationStatus.STORE_CANCELLED,
      ReservationStatus.NO_SHOW,
    ].includes(status)

    if (isUpcoming) {
      return (
        <Button variantType="primary" sizeType="xs">
          방문예정
        </Button>
      )
    }

    if (isCompleted) {
      return (
        <Button variantType="primary" sizeType="xs">
          방문완료
        </Button>
      )
    }

    if (isCancelled) {
      return (
        <Button variantType="primary" sizeType="xs">
          예약취소
        </Button>
      )
    }

    return null
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
          {/* <ReserveTag status={status} reservationDate={new Date(date)} /> */}
          {getButton()}
        </div>
      </div>
    </>
  )
}
