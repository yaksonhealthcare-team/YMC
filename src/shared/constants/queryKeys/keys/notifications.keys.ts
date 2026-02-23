import { BranchFilters } from '@/entities/branch/model/Branch';
import { Coordinate } from '@/shared/types/Coordinate';
import { createQueryKeyFactory } from '../queryKeyFactory';

const notificationsKeys = createQueryKeyFactory('notifications');

export const notifications = {
  all: notificationsKeys.all(),
  list: (filters: BranchFilters) => [...notifications.all, filters] as const,
  detail: (id: string, coords: Coordinate) => [...notifications.all, id, coords] as const
} as const;
