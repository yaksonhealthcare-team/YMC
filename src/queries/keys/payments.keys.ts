import { createQueryKeyFactory } from "../queryKeyFactory"

const paymentsKeys = createQueryKeyFactory("payments")

export const payments = {
  all: paymentsKeys.all(),
  histories: ({ page }: { page: number }) =>
    paymentsKeys.list({ page, infinite: true }),
  detail: (id: string) => paymentsKeys.detail(id),
  banks: ["payments", "banks"] as const,
} as const
