import { authApi } from '@/shared/api/instance';
import { ScheduleDate, ScheduleFilters, ScheduleTime } from '@/entities/schedule/model/Schedule';
import dayjs from 'dayjs';

export const fetchScheduleDates = async (filters: ScheduleFilters): Promise<ScheduleDate[]> => {
  const { data } = await authApi.get('/schedules/date', {
    params: {
      ...(filters.membershipIndex !== 0 && { mp_idx: filters.membershipIndex }),
      add_services: filters.addServices && filters.addServices.length > 0 ? filters.addServices.join(',') : undefined,
      search_date: dayjs(filters.searchDate).format('YYYY-MM'),
      b_idx: filters.b_idx,
      ss_idx: filters.ss_idx
    }
  });

  return data.body;
};

export const fetchScheduleTimes = async (filters: ScheduleFilters): Promise<ScheduleTime[]> => {
  const { data } = await authApi.get('/schedules/times', {
    params: {
      ...(filters.membershipIndex !== 0 && { mp_idx: filters.membershipIndex }),
      add_services: filters.addServices && filters.addServices.length > 0 ? filters.addServices.join(',') : undefined,
      search_date: dayjs(filters.searchDate).format('YYYY-MM-DD'),
      b_idx: filters.b_idx,
      ss_idx: filters.ss_idx
    }
  });

  return data.body;
};
