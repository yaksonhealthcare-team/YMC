import { ReservationFormValues } from '@/_domain/reservation';
import { SchedulesParams } from '@/_domain/reservation/types/schedule.types';
import dayjs, { Dayjs } from 'dayjs';

export const getDateBottomSheetQueryEnabled = (
  userId: string,
  branchId: string,
  selectedDate: Dayjs | null
) => {
  const baseEnabled = !!userId && !!branchId;
  return {
    isDateQueryEnabled: baseEnabled,
    isTimeQueryEnabled: baseEnabled && !!selectedDate
  };
};

export const buildScheduleParams = (
  scheduleType: 'date' | 'times',
  values: ReservationFormValues,
  searchDate: Dayjs
): SchedulesParams => {
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
