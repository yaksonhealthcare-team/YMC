import ReserveTag from "@components/ReserveTag"
import { ReservationStatus, reservationStatusLabel } from "types/Reservation"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import { Divider } from "@mui/material"

interface ReservationSummaryProps {
  reservationStatus: ReservationStatus
}

const ReservationSummary = ({ reservationStatus }: ReservationSummaryProps) => {
  return (
    <div className="p-[20px] rounded-[20px] shadow-card bg-white">
      <div className="flex gap-[8px] items-center">
        <p className="text-[18px] font-b text-gray-700">
          {reservationStatusLabel[reservationStatus]}
        </p>
        <ReserveTag
          status={reservationStatus}
          reservationDate={new Date("2022-12-25")}
        />
      </div>
      <div className="mt-3 flex items-center">
        <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
        <span className="font-r text-12px text-gray-500 ml-1.5">
          2024년 10월 26일 (토)
        </span>
        <span className="text-12px text-gray-500 mx-1.5">|</span>
        <span className="font-r text-12px text-gray-500">오전 11:00</span>
      </div>
      <Divider className="my-[20px] border-gray-100" />
      <div>
        <p className="text-gray-500 font-sb text-[14px]">관리 프로그램</p>
        <p className="font-r text-[14px] text-gray-700 mt-[6px]">
          K-beauty 연예인 관리 A 코스
        </p>
      </div>
      <div className="mt-[16px]">
        <p className="text-gray-500 font-sb text-[14px]">소요시간</p>
        <p className="font-r text-[14px] text-gray-700 mt-[6px]">120분</p>
      </div>
      <div className="mt-[16px]">
        <p className="text-gray-500 font-sb text-[14px]">추가관리</p>
        <p className="font-r text-[14px] text-gray-700 mt-[6px]">
          얼굴 집중 케어 / 콜라겐 집중 관리 / 붓기 관리
        </p>
        <p className="text-gray-700 font-sb text-[14px] mt-[6px]">
          총 100,000원
        </p>
      </div>
      <div className="mt-[16px]">
        <p className="text-gray-500 font-sb text-[14px]">요청사항</p>
        <p className="font-r text-[14px] text-gray-700 mt-[6px]">
          한달 전 턱 보톡스를 맞았어요! 참고 부탁드립니다 :-)
        </p>
      </div>
    </div>
  )
}

export default ReservationSummary
