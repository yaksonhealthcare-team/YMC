import CaretLeftIcon from '@/assets/icons/CaretLeftIcon.svg?react';
import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import { styled } from '@mui/material';
import { DateCalendar, DateCalendarProps, PickersCalendarHeaderProps } from '@mui/x-date-pickers';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';

export const Calendar = ({ ...props }: DateCalendarProps<Dayjs>) => {
  return (
    <div className="relative">
      <StyledDateCalendar slots={{ calendarHeader: (props) => <CalendarHeader {...props} /> }} {...props} />
    </div>
  );
};

const CalendarHeader = ({ ...props }: PickersCalendarHeaderProps<Dayjs>) => {
  const { currentMonth, onMonthChange } = props;
  const year = currentMonth.year();
  const month = currentMonth.month() + 1;
  const dateText = `${year}년 ${month}월`;
  const todayStartOfMonth = dayjs().startOf('month');
  const canGoPrev = currentMonth.isAfter(todayStartOfMonth, 'month');

  return (
    <div className="w-full flex items-center justify-center mb-6">
      <button
        className={clsx('mr-4', !canGoPrev && 'opacity-0 pointer-events-none')}
        onClick={() => onMonthChange(currentMonth.subtract(1, 'month'), 'left')}
      >
        <CaretLeftIcon className="w-4 h-4" />
      </button>
      <p className="text-lg font-bold">{dateText}</p>
      <button className={clsx('ml-4')} onClick={() => onMonthChange(currentMonth.add(1, 'month'), 'right')}>
        <CaretRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * @deprecated
 * mui는 점진적으로 제거
 */
const StyledDateCalendar = styled(DateCalendar)(({ theme }) => ({
  width: '100%',
  maxWidth: '355px',
  height: 'auto',
  // 전체 달력 레이아웃
  '& .MuiPickersCalendarHeader-root': {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '168px',
    margin: '0 auto 24px auto',
    fontSize: '18px',
    fontWeight: 700,
    textAlign: 'center',
    '.MuiPickersCalendarHeader-labelContainer': {
      margin: 'unset'
    }
  },
  // 비활성화된 날짜
  '&.Mui-disabled': {
    color: `${theme.palette.grey[300]} !important`,
    backgroundColor: 'transparent !important'
  },
  // 요일 헤더
  '& .MuiDayCalendar-header': {
    '& .MuiTypography-root': {
      fontSize: '14px',
      fontWeight: 500,
      color: theme.palette.grey[700],
      width: '44px',
      height: '14px'
    }
  },
  // 날짜 셀
  '& .MuiPickersDay-root': {
    width: 'calc(100% / 7)',
    height: '44px',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '8px',
    padding: '8px',
    alignItems: 'flex-start',
    color: theme.palette.grey[700],
    '&:hover': {
      backgroundColor: 'transparent'
    },
    // 선택된 날짜
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: 'white !important',
      '&:hover': {
        backgroundColor: theme.palette.primary.main
      },
      '&:focus': {
        backgroundColor: theme.palette.primary.main
      }
    },
    // 오늘 날짜
    '&.MuiPickersDay-today': {
      border: 'none',
      position: 'relative',
      '&::after': {
        content: "'오늘'",
        position: 'absolute',
        bottom: 0,
        fontSize: '10px',
        color: theme.palette.grey[300],
        fontWeight: 500
      }
    }
  }
}));
