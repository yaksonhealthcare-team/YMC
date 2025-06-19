import { createQueryKeyFactory } from '../queryKeyFactory';
import { ReservationStatusCode } from '../../types/Reservation';

const reservationsKeys = createQueryKeyFactory('reservations');

export const reservations = {
  all: reservationsKeys.all(),
  list: ({ page, status }: { page: number; status: ReservationStatusCode }) =>
    [...reservations.all, { page, status, infinite: true }] as const
} as const;
