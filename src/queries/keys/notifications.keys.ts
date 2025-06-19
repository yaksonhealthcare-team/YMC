import { createQueryKeyFactory } from '../queryKeyFactory';
import { BranchFilters } from '../../types/Branch';
import { Coordinate } from '../../types/Coordinate';

const notificationsKeys = createQueryKeyFactory('notifications');

export const notifications = {
  all: notificationsKeys.all(),
  list: (filters: BranchFilters) => [...notifications.all, filters] as const,
  detail: (id: string, coords: Coordinate) => [...notifications.all, id, coords] as const
} as const;
