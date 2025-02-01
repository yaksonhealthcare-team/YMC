import { ReservationStatus } from "types/Reservation"
import ReserveTag from "./ReserveTag"
import { Button } from "./Button"
import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { Reservation } from "../types/Reservation"

interface ReserveCardProps {
  reservation: Reservation
  className?: string
}

export const ReserveCard = ({ reservation, className = "" }: ReserveCardProps) => {
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

    const statusType = classifyReservationStatus(reservation.status)

    if (!statusType || statusType === "upcoming") return null
    if (!statusType || statusType === "cancelled") return null

    return (
      <Button variantType="primary" sizeType="xs">
        {buttonTexts[statusType]}
      </Button>
    )
  }

  return (
    <div
      className={`flex flex-col gap-4 bg-white p-5 rounded-[20px] border border-gray-100 ${className}`}
      onClick={() => navigate(`/reservation/${reservation.id}`)}
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-14px">{reservation.store}</span>
        <span className="text-primary font-m text-14px">
          {reservation.status}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-b text-16px">{reservation.programName}</span>
        <span className="text-gray-600 text-14px">
          {reservation.date.toLocaleDateString()} {reservation.duration}분 ({reservation.visit}회차)
        </span>
      </div>
      <div className="flex flex-col justify-between items-end">
        <ReserveTag
          status={classifyReservationStatus(reservation.status)}
          reservationDate={reservation.date}
        />
        {getButton()}
      </div>
    </div>
  )
}

export type { ReserveCardProps }
