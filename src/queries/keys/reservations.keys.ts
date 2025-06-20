import { ReservationStatusCode } from '@/types/Reservation';
import { createQueryKeyFactory } from '../queryKeyFactory';

const reservationsKeys = createQueryKeyFactory('reservations');

export const reservations = {
  all: reservationsKeys.all(),
  list: ({ page, status }: { page: number; status: ReservationStatusCode }) =>
    [...reservations.all, { page, status, infinite: true }] as const
} as const;
