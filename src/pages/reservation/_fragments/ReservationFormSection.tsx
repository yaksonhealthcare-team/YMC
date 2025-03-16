import { useTheme } from "@mui/material"
import CaretRigthIcon from "@assets/icons/CaretRightIcon.svg?react"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import CustomInputButton from "@components/CustomInputButton"
import CustomTextField from "@components/CustomTextField"
import { Dayjs } from "dayjs"
import { TimeSlot } from "types/Schedule"
import { Branch } from "types/Branch"
import { formatDate } from "utils/date"

interface ReservationFormSectionProps {
  data: {
    item?: string
    branch?: string
    date: Dayjs | null
    timeSlot: TimeSlot | null
    request: string
  }
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
          value={
            data.date && data.timeSlot
              ? `${formatDate(data.date.toDate(), "yyyy.MM.dd")} ${data.timeSlot.time}`
              : ""
          }
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
