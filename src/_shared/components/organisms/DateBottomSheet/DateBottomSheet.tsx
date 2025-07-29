import { ReservationFormValues, TimeSlot, useGetSchedulesDate } from '@/_domain/reservation';
import { useGetSchedulesTimes } from '@/_domain/reservation/services/queries/schedule.queries';
import { SchedulesParams } from '@/_domain/reservation/types/schedule.types';
import { BottomFixedSection, Button, Calendar, Loading, TimePicker } from '@/_shared';
import { formatScheduleTime } from '@/_shared/utils/date.utils';
import CloseIcon from '@/assets/icons/CloseIcon.svg?react';
import { useAuth } from '@/contexts/AuthContext';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { DateBottomSheetProps } from './DateBottomSheet.types';

export const DateBottomSheet = ({ values, onClose, onSelect, ...props }: DateBottomSheetProps) => {
  const { date, timeSlot } = values;
  const [searchDate, setSearchDate] = useState<Dayjs>(date || dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(date);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(timeSlot);

  const { user } = useAuth();
  const {
    data: schedulesDateData,
    isLoading: isScheduleDateLoading,
    isFetching: isScheduleDateFetching
  } = useGetSchedulesDate(user?.phone || '', buildParams('date', values, searchDate), {
    enabled: !!searchDate,
    refetchOnMount: true,
    staleTime: 0
  });
  const {
    data: schedulesTimesData,
    isLoading: isScheduleTimesLoading,
    isFetching: isScheduleTimesFetching
  } = useGetSchedulesTimes(user?.phone || '', buildParams('times', values, selectedDate), {
    enabled: !!selectedDate,
    refetchOnMount: true,
    staleTime: 0
  });

  const isDateSuspense = isScheduleDateLoading || isScheduleDateFetching;
  const isTimeSuspense = isScheduleTimesLoading || isScheduleTimesFetching;

  const handleChangeMonth = (date: Dayjs) => {
    if (isDateSuspense) return;

    setSearchDate(date);
  };
  const handleChangeDate = (date: Dayjs) => {
    setSelectedTime(null);
    setSelectedDate(date);
  };
  const handleClickComplete = () => {
    if (selectedDate && selectedTime) {
      onSelect(selectedDate, selectedTime);
    }
    onClose();
  };
  const handleDisabledDate = useCallback(
    (date: Dayjs) => {
      const schedulesDates = schedulesDateData?.body.map((d) => d.dates) || [];

      return !schedulesDates.includes(date.format('YYYY-MM-DD'));
    },
    [schedulesDateData?.body]
  );
  const handleClickTime = (time: string) => {
    setSelectedTime({ time: time });
  };

  const times = useMemo(
    () => schedulesTimesData?.body.map((t) => formatScheduleTime(t.times)) || [],
    [schedulesTimesData?.body]
  );
  const hasSelectedDate = !!selectedDate;
  const hasSelectedTime = !!selectedTime;

  return (
    <>
      <div className="flex flex-col items-center gap-5 px-5">
        <Header onClose={onClose} />
        <div className="w-full h-px bg-gray-100" />
        <div className="relative">
          {isDateSuspense && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/50 w-full h-full z-10">
              <Loading />
            </div>
          )}
          <Calendar
            disablePast
            value={selectedDate}
            onChange={handleChangeDate}
            shouldDisableDate={handleDisabledDate}
            onMonthChange={handleChangeMonth}
            {...props}
          />
        </div>
        <div className="w-full h-px bg-gray-100" />

        {hasSelectedDate ? (
          <TimePicker times={times} selectedTime={selectedTime} isLoading={isTimeSuspense} onClick={handleClickTime} />
        ) : (
          <div className="w-full p-4 bg-[#f7f7f7] rounded-lg">
            <p className="text-sm text-center">날짜를 먼저 선택해 주세요.</p>
          </div>
        )}
      </div>

      <BottomFixedSection>
        <Button onClick={handleClickComplete} disabled={!hasSelectedDate || !hasSelectedTime}>
          선택완료
        </Button>
      </BottomFixedSection>
    </>
  );
};

const Header = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="w-full flex justify-between items-center">
      <p className="font-sb text-lg">예약 날짜를 선택해주세요.</p>
      <button onClick={onClose}>
        <CloseIcon />
      </button>
    </div>
  );
};

const buildParams = (
  scheduleType: 'date' | 'times',
  values: ReservationFormValues,
  searchDate: Dayjs | null
): SchedulesParams => {
  if (!searchDate) {
    return { search_date: '', b_idx: '' };
  }

  const { consultService, services, type, branch } = values;
  const base = {
    b_idx: branch?.id ?? '',
    search_date: scheduleType === 'times' ? dayjs(searchDate).format('YYYY-MM-DD') : dayjs(searchDate).format('YYYY-MM')
  };

  const idxSource = type === 'consult' ? consultService : type === 'membership' ? services : [];
  const mp_idx = idxSource.map((s) => (typeof s.mp_idx === 'string' && s.mp_idx.length > 0 ? s.mp_idx : ''));
  const ss_idx = idxSource.map((s) => (typeof s.ss_idx === 'string' && s.ss_idx.length > 0 ? s.ss_idx : ''));

  return {
    ...base,
    ...(mp_idx.some((v) => v) && { mp_idx }),
    ...(ss_idx.some((v) => v) && { ss_idx })
  };
};
