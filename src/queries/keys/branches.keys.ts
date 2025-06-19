import { createQueryKeyFactory } from '../queryKeyFactory';
import { BranchFilters } from '../../types/Branch';
import { Coordinate } from '../../types/Coordinate';

const branchesKeys = createQueryKeyFactory('branches');

export const branches = {
  all: branchesKeys.all(),
  list: (filters: BranchFilters) => branchesKeys.list(filters),
  detail: (id: string, coords: Coordinate) => [...branchesKeys.all(), id, coords] as const,
  map: (coords: Coordinate, brandCode?: string, category?: string) =>
    [...branchesKeys.all(), 'maps', coords, brandCode, category] as const
} as const;
