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
import { useState, useEffect } from "react"

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
  const { openModal, overlayState } = useOverlay()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 오버레이 상태 감지
  useEffect(() => {
    if (overlayState.isOpen && overlayState.type === "modal") {
      setIsModalOpen(true)
    } else {
      setIsModalOpen(false)
    }
  }, [overlayState])

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
    const statusType = classifyReservationStatus(reservation.statusCode)
    const now = new Date()

    // 원본 날짜를 복제하여 사용
    const reservationDate = new Date(reservation.date)

    // 날짜가 올바르게 파싱되었는지 확인
    if (isNaN(reservationDate.getTime())) {
      console.error("예약 날짜가 유효하지 않습니다:", reservation.date)
      return null
    }

    // 소요 시간을 파싱
    let hours = 0
    let minutes = 0
    if (reservation.duration) {
      const durationParts = reservation.duration.split(":")
      hours = parseInt(durationParts[0], 10) || 0
      minutes = parseInt(durationParts[1], 10) || 0
    }

    // 예약 종료 시간 계산 (별도의 변수로 저장)
    const reservationEndTime = new Date(reservationDate)
    reservationEndTime.setHours(reservationEndTime.getHours() + hours)
    reservationEndTime.setMinutes(reservationEndTime.getMinutes() + minutes)

    // 현재 시간이 예약 날짜보다 이후인지 확인
    const isReservationDatePassed = now.getTime() > reservationDate.getTime()

    switch (statusType) {
      case "completed":
        if (reservation.reviewPositiveYn === "Y") {
          return (
            <Button
              variantType="primary"
              sizeType="xs"
              onClick={handleSatisfactionClick}
              className={isModalOpen ? "opacity-50 cursor-not-allowed" : ""}
              disabled={isModalOpen}
            >
              만족도 작성
            </Button>
          )
        }
        return null

      case "upcoming":
        if (
          reservation.statusCode === "002" ||
          reservation.statusCode === "008"
        ) {
          if (isReservationDatePassed) {
            return (
              <Button
                variantType="primary"
                sizeType="xs"
                onClick={handleCompleteVisit}
                className={isModalOpen ? "opacity-50 cursor-not-allowed" : ""}
                disabled={isModalOpen}
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
        `flex justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px] w-full text-left cursor-pointer`,
        `focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2`,
        className,
      )}
      onClick={() => navigate(`/reservation/${reservation.id}`)}
      aria-label={`${reservation.store} ${reservation.programName} ${reservation.visit}회차 예약 상세보기. ${classifyReservationStatus(reservation.statusCode) === "upcoming" ? "예정된 예약" : classifyReservationStatus(reservation.statusCode) === "completed" ? "완료된 예약" : classifyReservationStatus(reservation.statusCode) === "cancelled" ? "취소된 예약" : "진행 중인 예약"}. ${reservation.remainingDays ? `남은 일수: ${reservation.remainingDays}일` : ""}`}
      aria-pressed={
        classifyReservationStatus(reservation.statusCode) === "progressing"
      }
      role="button"
    >
      <div className="flex flex-col w-full">
        <div className="flex w-full items-center gap-1.5">
          <span className="font-b text-16px text-gray-700" aria-hidden="true">
            {reservation.store}
          </span>
        </div>
        <div className="mt-1">
          <span className="font-r text-14px text-gray-700" aria-hidden="true">
            {reservation.programName}
          </span>
          <span
            className="ml-1.5 font-sb text-14px text-primary"
            aria-hidden="true"
          >
            {reservation.visit}회차
          </span>
        </div>
        <DateAndTime date={reservation.date} className="mt-3" />
      </div>
      <div className="flex flex-col justify-between items-end min-w-[90px] h-full gap-6">
        <ReserveTag
          status={classifyReservationStatus(reservation.statusCode)}
          remainingDays={reservation.remainingDays!}
        />
        {getButton()}
      </div>
    </button>
  )
}

export type { ReserveCardProps }
