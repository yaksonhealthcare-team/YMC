import { createQueryKeyFactory } from "../queryKeyFactory"

const brandsKeys = createQueryKeyFactory("brands")

export const brands = {
  all: brandsKeys.all(),
  detail: ["brands/detail"] as const,
} as const
