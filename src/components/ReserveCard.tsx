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
              className={
                isModalOpen ? "opacity-50 cursor-not-allowed" : "min-w-[73px]"
              }
              disabled={isModalOpen}
            >
              만족도 작성
            </Button>
          )
        }
        return null

      case "upcoming":
        // 예약 시작 시간이 지났고, 상태가 예약완료(001)인 경우에만 방문 완료 버튼 표시
        if (isReservationDatePassed && reservation.statusCode === "001") {
          return (
            <Button
              variantType="primary"
              sizeType="xs"
              onClick={handleCompleteVisit}
              className={
                isModalOpen ? "opacity-50 cursor-not-allowed" : "min-w-[73px]"
              }
              disabled={isModalOpen}
            >
              방문 완료
            </Button>
          )
        }
        return null

      case "progressing":
        // 관리중 상태에서도 방문 완료 버튼 표시
        return (
          <Button
            variantType="primary"
            sizeType="xs"
            onClick={handleCompleteVisit}
            className={
              isModalOpen ? "opacity-50 cursor-not-allowed" : "min-w-[73px]"
            }
            disabled={isModalOpen}
          >
            방문 완료
          </Button>
        )

      default:
        return null
    }
  }

  return (
    <button
      className={clsx(
        `flex flex-col gap-[12px] bg-white p-5 border border-gray-100 shadow-card rounded-[20px] w-full text-left cursor-pointer relative`,
        className,
      )}
      onClick={() => navigate(`/reservation/${reservation.id}`)}
      aria-label={`${reservation.store} ${reservation.programName} ${reservation.statusCode !== "003" ? `${reservation.visit}회차` : ""} 예약`}
      role="button"
    >
      <div className="inline-flex flex-col justify-center items-start gap-1">
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="flex justify-start items-baseline gap-1.5">
            <div className="justify-start text-neutral-800 text-base font-bold font-['Pretendard'] leading-normal">
              {reservation.store}
            </div>
          </div>

          <ReserveTag
            status={classifyReservationStatus(reservation.statusCode)}
            remainingDays={reservation.remainingDays!}
          />
        </div>
        <div className="self-stretch inline-flex justify-start items-baseline gap-1.5">
          <div className="justify-start text-neutral-800 text-sm font-normal font-['Pretendard'] leading-tight">
            {reservation.programName}
          </div>
          {reservation.statusCode !== "003" && (
            <div className="justify-start text-red-400 text-sm font-semibold font-['Pretendard'] leading-tight">
              {reservation.visit}회차
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-end text-gray-500 text-sm w-full">
        <div className={clsx(getButton() && "mr-[72px]")}>
          <DateAndTime date={reservation.date} />
        </div>
        <div className="absolute right-0">{getButton()}</div>
      </div>
    </button>
  )
}

export type { ReserveCardProps }
