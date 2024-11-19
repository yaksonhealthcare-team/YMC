import { Divider } from "@mui/material"
import CloseIcon from "@assets/icons/CloseIcon.svg?react"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateCalendar } from "@mui/x-date-pickers"
import { styled } from "@mui/material/styles"
import { useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/ko"

interface DateAndTimeBottomSheetProps {
  onClose: () => void
}

const DateAndTimeBottomSheet = ({ onClose }: DateAndTimeBottomSheetProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  return (
    <div className={"flex flex-col items-center gap-5 px-5"}>
      <DateAndTimeBottomSheetHeader onClose={onClose} />
      <DatePickerSection date={selectedDate} handleDate={setSelectedDate} />
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

const StyledDateCalendar = styled(DateCalendar)(({ theme }) => ({
  maxWidth: "355px",
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
  "& .MuiPickersArrowSwitcher-root": {
    display: "flex",
    alignItems: "center",
    width: 0,
  },
  // 화살표 버튼
  "& .MuiPickersArrowSwitcher-button": {
    position: "absolute",
    color: theme.palette.grey[700],
    width: "16px",
    height: "16px",
    padding: 0,
  },
  "& .MuiPickersArrowSwitcher-previousIconButton": {
    left: 0,
  },
  "& .MuiPickersArrowSwitcher-nextIconButton": {
    right: 0,
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
    // 비활성화된 날짜
    "&.Mui-disabled": {
      color: theme.palette.grey[300],
    },
    // 오늘 날짜
    "&.MuiPickersDay-today": {
      border: "none",
      backgroundColor: "transparent",
      color: theme.palette.grey[700],
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
}))

interface DatePickerSectionProps {
  date: Dayjs | null
  handleDate: (date: Dayjs | null) => void
}

const DatePickerSection = ({ date, handleDate }: DatePickerSectionProps) => {
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
        onChange={handleDate}
        defaultValue={dayjs()}
        shouldDisableDate={isDateDisabled}
        views={["day"]}
        sx={{
          width: "100%",
        }}
      />
    </LocalizationProvider>
  )
}

export default DateAndTimeBottomSheet
