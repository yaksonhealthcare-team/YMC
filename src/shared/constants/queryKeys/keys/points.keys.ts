import { PointFilters } from '@/entities/point/model/Point';
import { createQueryKeyFactory } from '../queryKeyFactory';

const pointsKeys = createQueryKeyFactory('points');

export const points = {
  all: pointsKeys.all(),
  list: (filters: PointFilters) => pointsKeys.list({ ...filters, infinite: true })
} as const;
