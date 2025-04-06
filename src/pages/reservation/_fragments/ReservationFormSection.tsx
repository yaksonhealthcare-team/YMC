import { useTheme } from "@mui/material"
import CaretRigthIcon from "@assets/icons/CaretRightIcon.svg?react"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import CustomInputButton from "@components/CustomInputButton"
import CustomTextField from "@components/CustomTextField"
import { Dayjs } from "dayjs"
import { TimeSlot } from "types/Schedule"
import { Branch } from "types/Branch"
import { ReservationFormData } from "../../../stores/reservationFormStore"

interface ReservationFormSectionProps {
  data: ReservationFormData
  selectedBranch: Branch | null
  onOpenCalendar: () => void
  onChangeRequest: (value: string) => void
  onNavigateBranchSelect: () => void
  disableBranchSelection?: boolean
}

export const ReservationFormSection = ({
  data,
  selectedBranch,
  onOpenCalendar,
  onChangeRequest,
  onNavigateBranchSelect,
  disableBranchSelection = false,
}: ReservationFormSectionProps) => {
  const theme = useTheme()

  const formatReservationDateTime = (
    date: Dayjs | null,
    timeSlot: TimeSlot | null,
  ) => {
    if (!date || !timeSlot || !timeSlot.time) {
      return ""
    }

    try {
      const dateStr = date.format("YYYY.MM.DD")

      // 시간이 이미 "HH:MM" 형식인 경우
      if (/^\d{1,2}:\d{2}$/.test(timeSlot.time)) {
        const [hoursStr, minutesStr] = timeSlot.time.split(":")
        const hours = parseInt(hoursStr, 10)
        const minutes = parseInt(minutesStr, 10)

        const ampm = hours < 12 ? "오전" : "오후"
        const hour12 = hours % 12 || 12
        const formattedTime = `${dateStr} ${ampm} ${hour12}:${minutes.toString().padStart(2, "0")}`
        return formattedTime
      }
      // 이미 포맷된 시간 (오전/오후 포함)인지 확인
      else if (
        timeSlot.time.includes("오전") ||
        timeSlot.time.includes("오후")
      ) {
        return `${dateStr} ${timeSlot.time}`
      }
      // 알 수 없는 형식
      else {
        return `${dateStr} ${timeSlot.time}`
      }
    } catch (error) {
      return ""
    }
  }

  return (
    <section className="px-5 py-6 border-b-8 border-[#f7f7f7]">
      <div className="flex flex-col gap-6 [&_p:first-child]:text-16px [&_p:first-child]:font-sb">
        <CustomInputButton
          label="지점 선택"
          value={selectedBranch ? selectedBranch.name : ""}
          placeholder="지점을 선택해주세요."
          iconRight={<CaretRigthIcon className="w-4 h-4" />}
          onClick={disableBranchSelection ? undefined : onNavigateBranchSelect}
          disabled={disableBranchSelection}
        />
        <CustomInputButton
          label="예약 일시"
          value={formatReservationDateTime(data.date, data.timeSlot)}
          placeholder="예약 날짜를 선택해주세요."
          iconRight={
            <CalendarIcon className="w-6 h-6" color={theme.palette.grey[300]} />
          }
          onClick={onOpenCalendar}
        />
        <CustomTextField
          name="request"
          label="요청사항"
          placeholder="요청사항을 입력해주세요."
          value={data.request}
          onChange={(event) => {
            const value = event.target.value
            if (value.length > 100) {
              alert("요청사항은 100자 이내로 입력해주세요.")
              return
            }
            onChangeRequest(value)
          }}
        />
        <p className="text-gray-500 text-sm">
          * 예약 당일 취소, 노쇼의 경우 예약시 차감된 회원권 횟수가 반환되지
          않습니다.
        </p>
      </div>
    </section>
  )
}
