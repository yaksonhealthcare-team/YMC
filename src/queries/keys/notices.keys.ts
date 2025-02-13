import { createQueryKeyFactory } from "../queryKeyFactory"

const noticesKeys = createQueryKeyFactory("notices")

export const notices = {
  all: noticesKeys.all(),
  list: ({ page }: { page: number }) =>
    [...notices.all, { page, infinite: true }] as const,
  detail: (id: string) => [...notices.all, id] as const,
} as const
