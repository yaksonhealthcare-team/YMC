import { createQueryKeyFactory } from '../queryKeyFactory';

const reviewsKeys = createQueryKeyFactory('reviews');

const reviewsBase = {
  all: reviewsKeys.all()
} as const;

export const reviews = {
  ...reviewsBase,
  list: ({ page }: { page: number }) => [...reviewsBase.all, { page, infinite: true }] as const,
  sections: [...reviewsBase.all, 'sections'] as const
} as const;
