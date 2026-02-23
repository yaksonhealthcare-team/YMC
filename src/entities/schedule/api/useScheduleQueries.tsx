import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { fetchScheduleDates, fetchScheduleTimes } from './schedule.api';
import { ScheduleFilters } from '@/entities/schedule/model/Schedule';

const queryKeys = {
  schedules: {
    date: (filter: ScheduleFilters) => [
      'schedules',
      'date',
      filter.membershipIndex,
      filter.searchDate ? dayjs(filter.searchDate).format('YYYY-MM') : undefined,
      filter.b_idx,
      filter.addServices?.join(',')
    ],
    times: (filter: ScheduleFilters) => [
      'schedules',
      'times',
      filter.membershipIndex,
      filter.searchDate ? dayjs(filter.searchDate).format('YYYY-MM-DD') : undefined,
      filter.b_idx,
      filter.addServices?.join(',')
    ]
  }
};

export const useScheduleDateQueries = (filter: ScheduleFilters) =>
  useQuery({
    queryKey: queryKeys.schedules.date(filter),
    queryFn: () => fetchScheduleDates(filter),
    enabled: Boolean(filter.searchDate),
    retry: false // 에러 발생시 재시도 하지 않음
  });

export const useScheduleTimesQueries = (filter: ScheduleFilters) =>
  useQuery({
    queryKey: queryKeys.schedules.times(filter),
    queryFn: () => fetchScheduleTimes(filter),
    enabled: Boolean(filter.searchDate),
    retry: false // 에러 발생시 재시도 하지 않음
  });
