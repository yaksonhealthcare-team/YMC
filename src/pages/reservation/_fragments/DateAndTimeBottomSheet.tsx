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

  const handleDateSelect = (date: Dayjs | null) => {
    if (selectedDate && date && !selectedDate.isSame(date, "day")) {
      setSelectedTime(null)
      setSelectedDate(date)
    } else {
      setSelectedDate(date)
    }
  }

  const handleTimeSelect = (time: TimeSlot | null) => {
    setSelectedTime(time)
  }

  const handleComplete = () => {
    onSelect(selectedDate, selectedTime)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <div className={"flex flex-col items-center gap-5 px-5 pb-[100px]"}>
      <DateAndTimeBottomSheetHeader onClose={handleClose} />
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
  const [currentYearMonth, setCurrentYearMonth] = useState<Dayjs>(
    date || dayjs(),
  )
  const [isMonthChanging, setIsMonthChanging] = useState(false)

  const handleMonthChange = (newDate: Dayjs) => {
    setIsMonthChanging(true)
    setCurrentYearMonth(newDate)
  }

  const {
    data: scheduleDate,
    isLoading,
    isFetching,
  } = useScheduleDateQueries({
    membershipIndex,
    searchDate: currentYearMonth,
    addServices,
    b_idx,
  })

  useEffect(() => {
    // 데이터 로딩이 완료되면 월 변경 상태 초기화
    if (!isLoading && !isFetching && isMonthChanging) {
      setIsMonthChanging(false)
    }
  }, [isLoading, isFetching, isMonthChanging])

  const isDateDisabled = (date: Dayjs) => {
    // 로딩 중일 때는 모든 날짜를 활성화 상태로 표시하지 않음
    if (isLoading || isFetching) {
      // 현재 보고 있는 월과 동일한 월의 날짜는 일단 활성화
      return date.month() !== currentYearMonth.month()
    }

    // 데이터가 없을 때는 모든 날짜를 비활성화
    if (!scheduleDate) return true

    const scheduledDates = scheduleDate.map((item) => item.dates)

    return !scheduledDates.includes(date.format("YYYY-MM-DD"))
  }

  // 초기 날짜가 변경되면 currentYearMonth도 업데이트
  useEffect(() => {
    if (date) {
      setCurrentYearMonth(date)
    }
  }, [date])

  // 커스텀 Calendar Header 렌더링 함수
  const CustomCalendarHeader = (props: PickersCalendarHeaderProps<Dayjs>) => {
    const { onMonthChange, disabled } = props

    // displayDate는 우리가 관리하는 currentYearMonth 사용
    const displayDate = currentYearMonth

    const handlePreviousMonth = () => {
      if (!disabled && !isLoading && !isFetching) {
        const prevMonth = displayDate.subtract(1, "month")
        onMonthChange(prevMonth, "left")
        setCurrentYearMonth(prevMonth)
        setIsMonthChanging(true)
      }
    }

    const handleNextMonth = () => {
      if (!disabled && !isLoading && !isFetching) {
        const nextMonth = displayDate.add(1, "month")
        onMonthChange(nextMonth, "right")
        setCurrentYearMonth(nextMonth)
        setIsMonthChanging(true)
      }
    }

    const isPrevDisabled =
      displayDate.isSame(dayjs(), "month") ||
      disabled ||
      isLoading ||
      isFetching
    const isNextDisabled = disabled || isLoading || isFetching

    return (
      <div className="relative flex justify-center items-center w-[168px] mx-auto mb-6">
        <button
          onClick={handlePreviousMonth}
          disabled={isPrevDisabled}
          className={`absolute left-0 w-4 h-4 flex items-center justify-center ${
            isPrevDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <CaretLeftIcon className="w-4 h-4" />
        </button>
        <span className="text-[18px] font-bold text-[#212121]">
          {`${displayDate.year()}년 ${displayDate.month() + 1}월`}
        </span>
        <button
          onClick={handleNextMonth}
          disabled={isNextDisabled}
          className={`absolute right-0 w-4 h-4 flex items-center justify-center ${
            isNextDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <CaretRigthIcon className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      {isLoading && !isMonthChanging ? (
        <div className="flex justify-center items-center w-full h-[300px]">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <div className="relative">
          {(isFetching || isMonthChanging) && (
            <div className="absolute top-0 left-0 w-full h-full bg-white/70 z-10 flex justify-center items-center">
              <CircularProgress color="primary" size={30} />
            </div>
          )}
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
              calendarHeader: CustomCalendarHeader,
            }}
            onMonthChange={handleMonthChange}
          />
        </div>
      )}
    </LocalizationProvider>
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
  const {
    data: times,
    isLoading,
    isFetching,
  } = useScheduleTimesQueries({
    membershipIndex,
    searchDate: selectedDate,
    addServices,
    b_idx,
  })

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    if (!times) {
      setTimeSlots([])
      return
    }

    setTimeSlots(mapTimesToTimeSlots(times))
  }, [times])

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const ampm = hours < 12 ? "오전" : "오후"
    const hour12 = hours % 12 || 12
    return `${ampm} ${hour12}:${minutes.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[100px]">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute top-0 left-0 w-full h-full bg-white/70 z-10 flex justify-center items-center">
              <CircularProgress color="primary" size={24} />
            </div>
          )}
          <div className="grid grid-cols-4 gap-[9px]">
            {timeSlots.length > 0 ? (
              timeSlots.map((slot) => (
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
                  {formatTimeDisplay(slot.time)}
                </Button>
              ))
            ) : (
              <div className="col-span-4 p-4 bg-[#f7f7f7] rounded-lg">
                <div className="text-center text-[#212121] text-sm">
                  이 날짜에 가능한 시간이 없습니다.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DateAndTimeBottomSheet
