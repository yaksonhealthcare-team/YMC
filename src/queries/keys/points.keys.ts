import { createQueryKeyFactory } from '../queryKeyFactory';
import { PointFilters } from '../../types/Point';

const pointsKeys = createQueryKeyFactory('points');

export const points = {
  all: pointsKeys.all(),
  list: (filters: PointFilters) => pointsKeys.list({ ...filters, infinite: true })
} as const;
