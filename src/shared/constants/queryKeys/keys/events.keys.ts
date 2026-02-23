import { EventStatus } from '@/entities/content/model/Content';
import { createQueryKeyFactory } from '../queryKeyFactory';

const eventsKeys = createQueryKeyFactory('events');

export const events = {
  all: eventsKeys.all(),
  list: ({ page, status }: { page: number; status: EventStatus }) =>
    [...events.all, { page, status, infinite: true }] as const,
  detail: (id: string) => [...events.all, id] as const
} as const;
