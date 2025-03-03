import clsx from "clsx"
import { ReservationStatusCode } from "types/Reservation"
import { Button } from "./Button"
import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { Reservation } from "../types/Reservation"
import DateAndTime from "./DateAndTime"
import { useCompleteVisit } from "queries/useReservationQueries"
import { useOverlay } from "contexts/ModalContext"
import ReserveTag from "./ReserveTag"

interface ReserveCardProps {
  reservation: Reservation
  className?: string
}

export const ReserveCard = ({
  reservation,
  className = "",
}: ReserveCardProps) => {
  const navigate = useNavigate()
  const { mutate: completeVisit } = useCompleteVisit()
  const { openModal } = useOverlay()

  const classifyReservationStatus = (status: ReservationStatusCode) => {
    const statusGroups = {
      upcoming: ["001"],
      completed: ["000", "002"],
      cancelled: ["003"],
      progressing: ["008"],
    }

    if (statusGroups.upcoming.includes(status)) return "upcoming"
    if (statusGroups.completed.includes(status)) return "completed"
    if (statusGroups.cancelled.includes(status)) return "cancelled"
    if (statusGroups.progressing.includes(status)) return "progressing"
    return null
  }

  const handleCompleteVisit = (e: React.MouseEvent) => {
    e.stopPropagation()
    openModal({
      title: "방문 완료",
      message: "방문을 완료하시겠습니까?",
      onConfirm: () => {
        completeVisit(reservation.id)
      },
    })
  }

  const handleSatisfactionClick = (e: React.MouseEvent) => {
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

  const getButton = (): ReactNode => {
    const statusType = classifyReservationStatus(reservation.status)
    const now = new Date()
    const reservationEndTime = new Date(reservation.date)
    const [hours, minutes] = (reservation.duration ?? "00:00")
      .split(":")
      .map(Number)
    reservationEndTime.setHours(reservationEndTime.getHours() + (hours ?? 0))
    reservationEndTime.setMinutes(
      reservationEndTime.getMinutes() + (minutes ?? 0),
    )

    switch (statusType) {
      case "completed":
        return (
          <Button
            variantType="primary"
            sizeType="xs"
            onClick={handleSatisfactionClick}
          >
            만족도 작성
          </Button>
        )

      case "upcoming":
        if (reservation.status === "002" || reservation.status === "008") {
          if (now > reservationEndTime) {
            return (
              <Button
                variantType="primary"
                sizeType="xs"
                onClick={handleCompleteVisit}
              >
                방문 완료
              </Button>
            )
          }
        }
        return null

      default:
        return null
    }
  }

  return (
    <button
      className={clsx(
        `flex justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px] w-full text-left`,
        className,
      )}
      onClick={() => navigate(`/reservation/${reservation.id}`)}
      tabIndex={0}
      aria-label={`${reservation.store} ${reservation.programName} 예약 상세보기`}
    >
      <div className="flex flex-col w-full">
        <div className="flex w-full items-center gap-1.5">
          <span className="font-b text-16px text-gray-700">
            {reservation.store}
          </span>
        </div>
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
      <div className="flex flex-col justify-between items-end min-w-[90px] h-full gap-6">
        <ReserveTag
          status={classifyReservationStatus(reservation.status)}
          reservationDate={reservation.date}
        />
        {getButton()}
      </div>
    </button>
  )
}

export type { ReserveCardProps }
