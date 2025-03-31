import CloseIcon from "@assets/icons/CloseIcon.svg?react"
import {
  DateCalendarProps,
  LocalizationProvider,
  PickersCalendarHeaderProps,
} from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateCalendar } from "@mui/x-date-pickers"
import { styled } from "@mui/material/styles"
import { useEffect, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/ko"
import CaretRigthIcon from "@assets/icons/CaretRightIcon.svg?react"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import clsx from "clsx"
import { Button } from "@components/Button"
import {
  useScheduleDateQueries,
  useScheduleTimesQueries,
} from "../../../queries/useScheduleQueries.tsx"
import { TimeSlot } from "../../../types/Schedule.ts"
import { mapTimesToTimeSlots } from "../../../utils/formatToTimeSlot.ts"
import CircularProgress from "@mui/material/CircularProgress"

interface DateAndTimeBottomSheetProps {
  onClose: () => void
  date: Dayjs | null
  time: TimeSlot | null
  onSelect: (date: Dayjs | null, timeSlot: TimeSlot | null) => void
  membershipIndex?: number
  addServices?: number[]
  b_idx: string
}

const DateAndTimeBottomSheet = ({
  onClose,
  date: initialDate,
  time: initialTime,
  onSelect,
  membershipIndex,
  addServices,
  b_idx,
}: DateAndTimeBottomSheetProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(initialDate)
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(initialTime)

  // 컴포넌트가 마운트될 때 한 번만 실행
  useEffect(() => {
    // 새로고침 방지 이벤트 등록
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    // 폼 제출 방지
    const handleSubmit = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('submit', handleSubmit, true)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('submit', handleSubmit, true)
    }
  }, [])

  const handleDateSelect = (date: Dayjs | null) => {
    setSelectedDate(date)
    onSelect(date, selectedTime)
  }

  const handleTimeSelect = (time: TimeSlot | null) => {
    setSelectedTime(time)
    onSelect(selectedDate, time)
  }

  const handleComplete = () => {
    onClose()
  }

  // 이벤트 버블링 중지
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    // 이벤트 버블링 중지를 위해 onMouseDown 이벤트 핸들러 추가
    <div className="flex flex-col items-center gap-5 px-5 pb-[100px]" onMouseDown={stopPropagation}>
      <DateAndTimeBottomSheetHeader onClose={onClose} />
      <div className="w-full h-px bg-gray-100" />
      <DatePickerSection
        date={selectedDate}
        handleDateSelect={handleDateSelect}
        membershipIndex={membershipIndex}
        addServices={addServices}
        b_idx={b_idx}
      />
      <div className="w-full h-px bg-gray-100" />
      {selectedDate ? (
        <TimePickerSection
          selectedTime={selectedTime}
          handleTimeSelect={handleTimeSelect}
          membershipIndex={membershipIndex}
          addServices={addServices}
          selectedDate={selectedDate}
          b_idx={b_idx}
        />
      ) : (
        <div className="w-full p-4 bg-[#f7f7f7] rounded-lg">
          <div className="text-center text-[#212121] text-sm">
            날짜를 먼저 선택해 주세요.
          </div>
        </div>
      )}
      <div className="w-full absolute bottom-0 px-[20px] pt-[12px] pb-[40px] bg-white border-t border-[#f7f7f7]">
        <Button
          variantType="primary"
          sizeType="l"
          disabled={!selectedDate || !selectedTime}
          onClick={handleComplete}
          className="w-full"
        >
          선택완료
        </Button>
      </div>
    </div>
  )
}

const DateAndTimeBottomSheetHeader = ({ onClose }: { onClose: () => void }) => (
  <>
    <div className={"w-full"}>
      <div className={"flex justify-between"}>
        <p className={"font-sb text-18px"}>{"예약 날짜를 선택해주세요."}</p>
        <button onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
    </div>
  </>
)

const StyledDateCalendar = styled(DateCalendar)<DateCalendarProps<Dayjs>>(
  ({ theme }) => ({
    maxWidth: "355px",
    height: "auto",
    // 전체 달력 레이아웃
    "& .MuiPickersCalendarHeader-root": {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "168px",
      margin: "0 auto 24px auto",
      fontSize: "18px",
      fontWeight: 700,
      textAlign: "center",
      ".MuiPickersCalendarHeader-labelContainer": {
        margin: "unset",
      },
    },
    // 비활성화된 날짜
    "&.Mui-disabled": {
      color: `${theme.palette.grey[300]} !important`,
      backgroundColor: "transparent !important",
    },
    // 요일 헤더
    "& .MuiDayCalendar-header": {
      "& .MuiTypography-root": {
        fontSize: "14px",
        fontWeight: 500,
        color: theme.palette.grey[700],
        width: "44px",
        height: "14px",
      },
    },
    // 날짜 셀
    "& .MuiPickersDay-root": {
      width: "calc(100% / 7)",
      height: "44px",
      fontSize: "14px",
      fontWeight: 500,
      borderRadius: "8px",
      padding: "8px",
      alignItems: "flex-start",
      color: theme.palette.grey[700],
      "&:hover": {
        backgroundColor: "transparent",
      },
      // 선택된 날짜
      "&.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
        color: "white !important",
        "&:hover": {
          backgroundColor: theme.palette.primary.main,
        },
        "&:focus": {
          backgroundColor: theme.palette.primary.main,
        },
      },
      // 오늘 날짜
      "&.MuiPickersDay-today": {
        border: "none",
        position: "relative",
        "&::after": {
          content: "'오늘'",
          position: "absolute",
          bottom: 0,
          fontSize: "10px",
          color: theme.palette.grey[300],
          fontWeight: 500,
        },
      },
    },
  }),
)

interface DatePickerSectionProps {
  date: Dayjs | null
  handleDateSelect: (date: Dayjs | null) => void
  membershipIndex?: number
  addServices?: number[]
  b_idx: string
}

const DatePickerSection = ({
  date,
  handleDateSelect,
  membershipIndex,
  addServices,
  b_idx,
}: DatePickerSectionProps) => {
  const [currentYearMonth, setCurrentYearMonth] = useState<Dayjs>(dayjs())
  const [isMonthChanging, setIsMonthChanging] = useState<boolean>(false)

  const handleMonthChange = (newDate: Dayjs) => {
    // 로딩 상태 설정
    setIsMonthChanging(true)
    // 새로운 년월 설정 - 이것은 API 요청용
    setCurrentYearMonth(newDate)
  }

  const { data: scheduleDate, isLoading } = useScheduleDateQueries({
    membershipIndex,
    searchDate: currentYearMonth,
    addServices,
    b_idx,
  })

  // 데이터 로딩이 완료되면 상태 업데이트
  useEffect(() => {
    if (!isLoading && isMonthChanging) {
      setIsMonthChanging(false)
    }
  }, [isLoading, isMonthChanging])

  const isDateDisabled = (date: Dayjs) => {
    // 로딩 중일 때는 모든 날짜를 활성화 상태로 표시
    if (isLoading || isMonthChanging) return false

    // 데이터가 없을 때는 모든 날짜를 비활성화
    if (!scheduleDate) return true

    const scheduledDates = scheduleDate.map((item) => item.dates)

    return !scheduledDates.includes(date.format("YYYY-MM-DD"))
  }

  // 이벤트 버블링 방지
  const preventEventBubbling = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className="relative" onClick={preventEventBubbling}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        {/* 로딩 오버레이 표시 */}
        {(isLoading || isMonthChanging) && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10">
            <CircularProgress color="primary" />
          </div>
        )}
        {!isLoading || isMonthChanging ? (
          <StyledDateCalendar
            value={date}
            onChange={handleDateSelect}
            defaultValue={dayjs()}
            shouldDisableDate={isDateDisabled}
            views={["day"]}
            sx={{
              width: "100%",
            }}
            slots={{
              calendarHeader: (props) => (
                <CalendarHeader 
                  {...props} 
                  isLoading={isLoading || isMonthChanging}
                />
              ),
            }}
            onMonthChange={handleMonthChange}
          />
        ) : (
          <div className="flex justify-center items-center h-[300px]">
            <CircularProgress color="primary" />
          </div>
        )}
      </LocalizationProvider>
    </div>
  )
}

interface CustomCalendarHeaderProps extends PickersCalendarHeaderProps<Dayjs> {
  isLoading: boolean;
}

const CalendarHeader = (props: CustomCalendarHeaderProps) => {
  const { currentMonth, onMonthChange, disabled, isLoading } = props
  const currentDate = dayjs(currentMonth)

  const handlePreviousMonth = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 이벤트 전파 및 기본 동작 방지
    e.preventDefault()
    e.stopPropagation()
    
    if (!disabled && !isLoading) {
      // 로딩 중이 아닐 때만 월 변경 허용
      onMonthChange(currentDate.subtract(1, "month"), "left")
    }
  }

  const handleNextMonth = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 이벤트 전파 및 기본 동작 방지
    e.preventDefault()
    e.stopPropagation()
    
    if (!disabled && !isLoading) {
      // 로딩 중이 아닐 때만 월 변경 허용
      onMonthChange(currentDate.add(1, "month"), "right")
    }
  }

  const isPrevDisabled = currentDate.isSame(dayjs(), "month") || isLoading

  return (
    <div className="relative flex justify-center items-center w-[168px] mx-auto mb-6">
      <button
        type="button"
        onClick={handlePreviousMonth}
        disabled={isPrevDisabled}
        className={`absolute left-0 w-4 h-4 flex items-center justify-center ${
          isPrevDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <CaretLeftIcon className="w-4 h-4" />
      </button>
      <span className="text-[18px] font-bold text-[#212121]">
        {`${currentDate.year()}년 ${currentDate.month() + 1}월`}
      </span>
      <button
        type="button"
        onClick={handleNextMonth}
        disabled={isLoading}
        className={`absolute right-0 w-4 h-4 flex items-center justify-center ${
          isLoading ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <CaretRigthIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

interface TimePickerSectionProps {
  selectedTime: TimeSlot | null
  handleTimeSelect: (timeSlot: TimeSlot | null) => void
  membershipIndex?: number
  addServices?: number[]
  selectedDate?: Dayjs
  b_idx: string
}

const TimePickerSection = ({
  selectedTime,
  handleTimeSelect,
  membershipIndex,
  addServices,
  selectedDate,
  b_idx,
}: TimePickerSectionProps) => {
  const { data: times, isLoading } = useScheduleTimesQueries({
    membershipIndex,
    searchDate: selectedDate,
    addServices,
    b_idx,
  })

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    if (isLoading || !times) {
      return
    }

    setTimeSlots(mapTimesToTimeSlots(times))
  }, [isLoading, times])

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[100px]">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-[9px]">
          {timeSlots.map((slot) => (
            <Button
              key={slot.time}
              fullCustom
              onClick={() => handleTimeSelect(slot)}
              className={clsx(
                "h-10 px-2.5 rounded-lg text-sm font-normal flex justify-center items-center whitespace-nowrap",
                selectedTime?.time === slot.time
                  ? "!bg-primary-300 !text-white !border-none hover:!bg-primary-300"
                  : "!bg-white !border !border-solid !border-gray-200 hover:!bg-[#f7f7f7]",
                "!text-gray-700",
                "disabled:!bg-gray-50 disabled:!text-gray-300 disabled:!border-gray-200",
              )}
            >
              {slot.time}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DateAndTimeBottomSheet
