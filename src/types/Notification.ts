export interface Notification {
  id: number
  isRead: boolean
  mainCategory: string
  subCategory?: string
  title: string
  content: string
  pushDate: string
  reservationDate?: string
  brandName?: string
}

export interface NotificationResponse {
  id: number
  main_category: string
  sub_category: string
  title: string
  content: string
  push_date: string
  r_date: string
  b_name?: string
  is_read?: string
}

export interface NotificationFilters {
  page?: number
  searchType?: NotificationSearchType
}

export enum NotificationFilter {
  ALL = "전체",
  RESERVATION = "예약",
  MEMBERSHIP = "회원권",
  POINT = "포인트",
  NOTIFICATION = "공지",
}

export enum NotificationSearchType {
  ALL = "",
  RESERVATION = "reserve",
  MEMBERSHIP = "membership",
  POINT = "point",
  NOTIFICATION = "notice",
}

export const getSearchType = (
  filter: NotificationFilter,
): NotificationSearchType => {
  const mapping: Record<NotificationFilter, NotificationSearchType> = {
    [NotificationFilter.ALL]: NotificationSearchType.ALL,
    [NotificationFilter.RESERVATION]: NotificationSearchType.RESERVATION,
    [NotificationFilter.MEMBERSHIP]: NotificationSearchType.MEMBERSHIP,
    [NotificationFilter.POINT]: NotificationSearchType.POINT,
    [NotificationFilter.NOTIFICATION]: NotificationSearchType.NOTIFICATION,
  }

  return mapping[filter]
}

export enum NotificationSearchType {}

export interface NotificationSettings {
  reservations: boolean
  payments: boolean
  points: boolean
  notices: boolean
}

export interface NotificationSettingsResponse {
  reservation_yn: "Y" | "N"
  payment_yn: "Y" | "N"
  point_yn: "Y" | "N"
  notification_yn: "Y" | "N"
}
