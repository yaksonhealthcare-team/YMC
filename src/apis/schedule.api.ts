import { axiosClient } from '@/queries/clients';
import { ScheduleDate, ScheduleFilters, ScheduleTime } from '@/types/Schedule';
import dayjs from 'dayjs';

export const fetchScheduleDates = async (filters: ScheduleFilters): Promise<ScheduleDate[]> => {
  const { data } = await axiosClient.get('/schedules/date', {
    params: {
      ...(filters.membershipIndex !== 0 && { mp_idx: filters.membershipIndex }),
      add_services: filters.addServices && filters.addServices.length > 0 ? filters.addServices.join(',') : undefined,
      search_date: dayjs(filters.searchDate).format('YYYY-MM'),
      b_idx: filters.b_idx
    }
  });

  return data.body;
};

export const fetchScheduleTimes = async (filters: ScheduleFilters): Promise<ScheduleTime[]> => {
  const { data } = await axiosClient.get('/schedules/times', {
    params: {
      ...(filters.membershipIndex !== 0 && { mp_idx: filters.membershipIndex }),
      add_services: filters.addServices && filters.addServices.length > 0 ? filters.addServices.join(',') : undefined,
      search_date: dayjs(filters.searchDate).format('YYYY-MM-DD'),
      b_idx: filters.b_idx
    }
  });

  return data.body;
};
