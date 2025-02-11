import clsx from "clsx"
import { ReservationStatusCode } from "types/Reservation"
import ReserveTag from "./ReserveTag"
import { Button } from "./Button"
import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { Reservation } from "../types/Reservation"
import DateAndTime from "./DateAndTime"
import { useCompleteVisit } from "queries/useReservationQueries"
import { useOverlay } from "contexts/ModalContext"

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
      upcoming: ["001", "002"],
      completed: ["000"],
      cancelled: ["003"],
      progressing: ["001"],
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

  const getButton = (): ReactNode => {
    const statusType = classifyReservationStatus(reservation.status)

    switch (statusType) {
      case "completed":
        return (
          <Button
            variantType="primary"
            sizeType="xs"
            onClick={(e) => {
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
            }}
          >
            만족도 작성
          </Button>
        )

      case "progressing":
        return (
          <Button
            variantType="primary"
            sizeType="xs"
            onClick={handleCompleteVisit}
          >
            방문 완료
          </Button>
        )

      default:
        return null
    }
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
            reservation.status as ReservationStatusCode,
          )}
          reservationDate={reservation.date}
        />
        {getButton()}
      </div>
    </div>
  )
}

export type { ReserveCardProps }
