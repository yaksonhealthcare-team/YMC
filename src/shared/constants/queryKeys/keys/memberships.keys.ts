import { createQueryKeyFactory } from '../queryKeyFactory';

const membershipsKeys = createQueryKeyFactory('memberships');

export const memberships = {
  all: membershipsKeys.all(),
  list: (brandCode: string, scCode: string) => [...memberships.all, 'list', brandCode, scCode] as const,
  detail: (serviceIndex: string) => [...memberships.all, 'detail', serviceIndex] as const,
  serviceCategories: (brandCode: string) => [...memberships.all, 'service_categories', brandCode],
  myList: (status: string) => [...memberships.all, 'myList', status] as const,
  additionalManagement: (membershipIdx: number | undefined) => [...memberships.all, 'detail', membershipIdx] as const
} as const;
