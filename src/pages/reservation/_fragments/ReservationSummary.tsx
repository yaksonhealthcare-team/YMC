import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import { Divider } from "@mui/material"
import { ReservationDetail } from "queries/useReservationQueries"
import { format, isValid } from "date-fns"
import { ko } from "date-fns/locale"

interface ReservationSummaryProps {
  reservation: ReservationDetail
}

const ReservationSummary = ({ reservation }: ReservationSummaryProps) => {
  const date = new Date(reservation.date)

  const formatDate = (date: Date) => {
    if (!isValid(date)) {
      return "날짜 정보 없음"
    }
    return format(date, "yyyy년 MM월 dd일 (E)", { locale: ko })
  }

  const formatTime = (date: Date) => {
    if (!isValid(date)) {
      return "시간 정보 없음"
    }
    return format(date, "a hh:mm", { locale: ko })
  }

  return (
    <div className="p-[20px] rounded-[20px] shadow-card bg-white">
      <div className="flex gap-[8px] items-center">
        <p className="text-[18px] font-b text-gray-700">{reservation.status}</p>
      </div>
      <div className="mt-3 flex items-center">
        <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
        <span className="font-r text-12px text-gray-500 ml-1.5">
          {formatDate(date)}
        </span>
        <span className="text-12px text-gray-500 mx-1.5">|</span>
        <span className="font-r text-12px text-gray-500">
          {formatTime(date)}
        </span>
      </div>
      <Divider className="my-[20px] border-gray-100" />
      <div>
        <p className="text-gray-500 font-sb text-[14px]">관리 프로그램</p>
        <p className="font-r text-[14px] text-gray-700 mt-[6px]">
          {reservation.programName}
        </p>
      </div>
      <div className="mt-[16px]">
        <p className="text-gray-500 font-sb text-[14px]">소요시간</p>
        <p className="font-r text-[14px] text-gray-700 mt-[6px]">
          {reservation.duration}분
        </p>
      </div>
      {reservation.additionalServices.length > 0 && (
        <div className="mt-[16px]">
          <p className="text-gray-500 font-sb text-[14px]">추가관리</p>
          <p className="font-r text-[14px] text-gray-700 mt-[6px]">
            {reservation.additionalServices
              .map((service) => service.name)
              .join(" / ")}
          </p>
          <p className="text-gray-700 font-sb text-[14px] mt-[6px]">
            총{" "}
            {reservation.additionalServices
              .reduce((sum, service) => sum + service.price, 0)
              .toLocaleString()}
            원
          </p>
        </div>
      )}
      {reservation.request && (
        <div className="mt-[16px]">
          <p className="text-gray-500 font-sb text-[14px]">요청사항</p>
          <p className="font-r text-[14px] text-gray-700 mt-[6px]">
            {reservation.request}
          </p>
        </div>
      )}
    </div>
  )
}

export default ReservationSummary
