import { payments } from '@/shared/constants/queryKeys/keys/payments.keys';
import { branches } from '@/shared/constants/queryKeys/keys/branches.keys';
import { schedules } from '@/shared/constants/queryKeys/keys/schedules.keys';
import { points } from '@/shared/constants/queryKeys/keys/points.keys';
import { questionnaires } from '@/shared/constants/queryKeys/keys/questionnaires.keys';
import { brands } from '@/shared/constants/queryKeys/keys/brands.keys';
import { memberships } from '@/shared/constants/queryKeys/keys/memberships.keys';
import { events } from '@/shared/constants/queryKeys/keys/events.keys';
import { notices } from '@/shared/constants/queryKeys/keys/notices.keys';
import { reviews } from '@/shared/constants/queryKeys/keys/reviews.keys';
import { reservations } from '@/shared/constants/queryKeys/keys/reservations.keys';
import { banners } from '@/shared/constants/queryKeys/keys/banners.keys';
import { notifications } from '@/shared/constants/queryKeys/keys/notifications.keys';
import { carts } from '@/shared/constants/queryKeys/keys/carts.keys';
import { popups } from '@/shared/constants/queryKeys/keys/popups.keys';

export const queryKeys = {
  payments,
  branches,
  schedules,
  points,
  questionnaires,
  brands,
  memberships,
  events,
  notices,
  reviews,
  reservations,
  banners,
  notifications,
  carts,
  popups
} as const;
