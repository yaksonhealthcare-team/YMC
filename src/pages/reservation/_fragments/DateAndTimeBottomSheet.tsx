import { Divider } from "@mui/material"
import CloseIcon from "@assets/icons/CloseIcon.svg?react"
import {
  DateCalendarProps,
  LocalizationProvider,
  PickersCalendarHeaderProps,
} from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateCalendar } from "@mui/x-date-pickers"
import { styled } from "@mui/material/styles"
import { useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/ko"
import CaretRigthIcon from "@assets/icons/CaretRightIcon.svg?react"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import clsx from "clsx"
import { Button } from "@components/Button"

interface DateAndTimeBottomSheetProps {
  onClose: () => void
  date: Dayjs | null
  time: string | null
  onSelect: (date: Dayjs | null, time: string | null) => void
}

const DateAndTimeBottomSheet = ({
  onClose,
  date: initialDate,
  time: initialTime,
  onSelect,
}: DateAndTimeBottomSheetProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(initialDate)
  const [selectedTime, setSelectedTime] = useState<string | null>(initialTime)

  const handleDateSelect = (date: Dayjs | null) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time: string | null) => {
    setSelectedTime(time)
  }

  const handleComplete = () => {
    onClose()
    onSelect(selectedDate, selectedTime)
  }

  return (
    <div className={"flex flex-col items-center gap-5 px-5 pb-[100px]"}>
      <DateAndTimeBottomSheetHeader onClose={onClose} />
      <DatePickerSection
        date={selectedDate}
        handleDateSelect={handleDateSelect}
      />
      <div className="w-full h-px bg-gray-100" />
      {selectedDate ? (
        <TimePickerSection
          selectedTime={selectedTime}
          handleTimeSelect={handleTimeSelect}
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
    <Divider
      sx={{
        width: "52px",
        height: "1.5px",
        borderRadius: "100px",
        bgcolor: "gray.200",
        margin: "0 auto",
      }}
    />
    <div className={"w-full"}>
      <div className={"flex justify-between"}>
        <p className={"font-sb text-18px"}>{"지점 필터"}</p>
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
    // 달력 뷰 전환 버튼 숨기기
    "& .MuiPickersCalendarHeader-switchViewButton": {
      display: "none",
    },
    // 주말 색상
    "& .MuiPickersDay-root:nth-child(1)": {
      // 일요일
      color: theme.palette.grey[300],
    },
  }),
)

interface DatePickerSectionProps {
  date: Dayjs | null
  handleDateSelect: (date: Dayjs | null) => void
}

const DatePickerSection = ({
  date,
  handleDateSelect,
}: DatePickerSectionProps) => {
  const isDateDisabled = (date: Dayjs) => {
    const today = dayjs()
    return (
      date.isBefore(today, "day") || date.isAfter(today.add(2, "month"), "day")
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
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
          calendarHeader: CalendarHeader,
        }}
      />
    </LocalizationProvider>
  )
}

const CalendarHeader = (props: PickersCalendarHeaderProps<Dayjs>) => {
  const { currentMonth, onMonthChange, disabled } = props
  const currentDate = dayjs(currentMonth)

  const handlePreviousMonth = () => {
    if (!disabled) {
      onMonthChange(currentDate.subtract(1, "month"), "left")
    }
  }

  const handleNextMonth = () => {
    if (!disabled) {
      onMonthChange(currentDate.add(1, "month"), "right")
    }
  }

  const isPrevDisabled = currentDate.isSame(dayjs(), "month")

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
        {`${currentDate.year()}년 ${currentDate.month() + 1}월`}
      </span>
      <button
        onClick={handleNextMonth}
        className="absolute right-0 w-4 h-4 flex items-center justify-center cursor-pointer"
      >
        <CaretRigthIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

interface TimeSlot {
  time: string
  disabled?: boolean
}

const timeSlots: TimeSlot[] = [
  { time: "오전 10:00", disabled: true },
  { time: "오전 10:30", disabled: true },
  { time: "오전 11:00" },
  { time: "오전 11:30" },
  { time: "오후 12:00" },
  { time: "오후 12:30" },
  { time: "오후 1:00" },
  { time: "오후 1:30" },
  { time: "오후 2:00" },
  { time: "오후 2:30" },
  { time: "오후 3:00" },
  { time: "오후 3:30" },
  { time: "오후 4:00", disabled: true },
  { time: "오후 4:30", disabled: true },
  { time: "오후 5:00" },
]

interface TimePickerSectionProps {
  selectedTime: string | null
  handleTimeSelect: (time: string | null) => void
}

const TimePickerSection = ({
  selectedTime,
  handleTimeSelect,
}: TimePickerSectionProps) => {
  return (
    <div className="w-full grid grid-cols-4 gap-[9px]">
      {timeSlots.map((slot) => (
        <Button
          key={slot.time}
          fullCustom
          disabled={slot.disabled}
          onClick={() => handleTimeSelect(slot.time)}
          className={clsx(
            "h-10 px-2.5 rounded-lg text-sm font-normal flex justify-center items-center whitespace-nowrap",
            selectedTime === slot.time
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
  )
}

export default DateAndTimeBottomSheet
