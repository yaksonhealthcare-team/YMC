import { createQueryKeyFactory } from "../queryKeyFactory"

const reviewsKeys = createQueryKeyFactory("reviews")

export const reviews = {
  all: reviewsKeys.all(),
  list: ({ page }: { page: number }) =>
    [...reviews.all, { page, infinite: true }] as const,
} as const
