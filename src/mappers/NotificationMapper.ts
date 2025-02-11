import {
  Notification,
  NotificationResponse,
  NotificationSettings,
  NotificationSettingsResponse,
} from "../types/Notification"

export const NotificationMapper = {
  toNotification: (response: NotificationResponse): Notification => ({
    id: response.id,
    mainCategory: response.main_category,
    subCategory: response.sub_category,
    title: response.title,
    content: response.content,
    pushDate: response.push_date,
    reservationDate: response.r_date,
    brandName: response.b_name,
  }),

  toNotifications: (responses: NotificationResponse[]): Notification[] =>
    responses.map(NotificationMapper.toNotification),

  toNotificationSettings: (
    response: NotificationSettingsResponse,
  ): NotificationSettings => ({
    reservations: response.reservation_yn === "Y",
    payments: response.payment_yn === "Y",
    points: response.point_yn === "Y",
    notices: response.notification_yn === "Y",
  }),

  toUpdateSettingsRequest: (
    settings: Partial<NotificationSettings>,
  ): Partial<NotificationSettingsResponse> => ({
    reservation_yn: settings.reservations ? "Y" : "N",
    payment_yn: settings.payments ? "Y" : "N",
    point_yn: settings.points ? "Y" : "N",
    notification_yn: settings.notices ? "Y" : "N",
  }),
}
