import { ScheduleFilters } from '@/entities/schedule/model/Schedule';
import { createQueryKeyFactory } from '../queryKeyFactory';

const schedulesKeys = createQueryKeyFactory('schedules');

export const schedules = {
  all: schedulesKeys.all(),
  date: (filters: ScheduleFilters) => schedulesKeys.list(filters),
  times: (filters: ScheduleFilters) => schedulesKeys.list(filters)
} as const;
