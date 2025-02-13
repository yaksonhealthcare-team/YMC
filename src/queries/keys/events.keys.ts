import { createQueryKeyFactory } from "../queryKeyFactory"
import { EventStatus } from "../../types/Content"

const eventsKeys = createQueryKeyFactory("events")

export const events = {
  all: eventsKeys.all(),
  list: ({ page, status }: { page: number; status: EventStatus }) =>
    [...events.all, { page, status, infinite: true }] as const,
  detail: (id: string) => [...events.all, id] as const,
} as const
