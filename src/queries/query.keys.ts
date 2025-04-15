import { payments } from "./keys/payments.keys"
import { branches } from "./keys/branches.keys"
import { schedules } from "./keys/schedules.keys"
import { points } from "./keys/points.keys"
import { questionnaires } from "./keys/questionnaires.keys"
import { brands } from "./keys/brands.keys"
import { memberships } from "./keys/memberships.keys"
import { events } from "./keys/events.keys"
import { notices } from "./keys/notices.keys"
import { reviews } from "./keys/reviews.keys"
import { reservations } from "./keys/reservations.keys"
import { banners } from "./keys/banners.keys"
import { notifications } from "./keys/notifications.keys"
import { carts } from "./keys/carts.keys"
import { popups } from "./keys/popups.keys"

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
  popups,
} as const
