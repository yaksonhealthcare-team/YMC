import clsx from "clsx"
import { ReservationStatus } from "types/Reservation"
import ReserveTag from "./ReserveTag"
import { Button } from "./Button"
import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { Reservation } from "../types/Reservation"
import DateAndTime from "./DateAndTime"

interface ReserveCardProps {
  reservation: Reservation
  className?: string
}

export const ReserveCard = ({
  reservation,
  className = "",
}: ReserveCardProps) => {
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
    const statusType = classifyReservationStatus(reservation.status)

    if (statusType !== "completed") return null

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      navigate(`/reservation/${reservation.id}/satisfaction`, {
        state: {
          r_idx: reservation.id,
          r_date: reservation.date.toISOString(),
          b_name: reservation.store,
          ps_name: reservation.programName,
          review_items: [
            { rs_idx: "1", rs_type: "시술만족도" },
            { rs_idx: "2", rs_type: "친절도" },
            { rs_idx: "3", rs_type: "청결도" },
          ],
        },
      })
    }

    return (
      <Button variantType="primary" sizeType="xs" onClick={handleClick}>
        만족도 작성
      </Button>
    )
  }

  return (
    <div
      className={clsx(
        `flex justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px]`,
        className,
      )}
      onClick={() => navigate(`/reservation/${reservation.id}`)}
    >
      <div>
        <span className="font-b text-16px text-gray-700">
          {reservation.store}
        </span>
        <div className="mt-1">
          <span className="font-r text-14px text-gray-700">
            {reservation.programName}
          </span>
          <span className="ml-1.5 font-sb text-14px text-primary">
            {reservation.visit}회차
          </span>
        </div>
        <DateAndTime date={reservation.date} className="mt-3" />
      </div>
      <div className="flex flex-col justify-between items-end">
        <ReserveTag
          status={classifyReservationStatus(
            reservation.status as ReservationStatus,
          )}
          reservationDate={reservation.date}
        />
        {getButton()}
      </div>
    </div>
  )
}

export type { ReserveCardProps }
