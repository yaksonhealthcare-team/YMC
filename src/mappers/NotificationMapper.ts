import {
  Notification,
  NotificationResponse,
  NotificationSettings,
  NotificationSettingsResponse,
} from "../types/Notification"

export class NotificationMapper {
  static toNotification(response: NotificationResponse): Notification {
    return {
      id: response.id,
      readStatus: response.is_read,
      mainCategory: response.main_category,
      subCategory: response.sub_category,
      title: response.title,
      content: response.content,
      pushDate: response.push_date,
      reservationDate: response.r_date,
      brandName: response.b_name,
    }
  }

  static toNotifications(responses: NotificationResponse[]): Notification[] {
    return responses.map(this.toNotification)
  }

  static toNotificationSettings(
    response: NotificationSettingsResponse,
  ): NotificationSettings {
    return {
      reservations: response.reservation_yn === "Y",
      payments: response.payment_yn === "Y",
      points: response.point_yn === "Y",
      notices: response.notification_yn === "Y",
    }
  }

  static toUpdateSettingsRequest(
    settings: Partial<NotificationSettings>,
  ): Partial<NotificationSettingsResponse> {
    return {
      reservation_yn: settings.reservations ? "Y" : "N",
      payment_yn: settings.payments ? "Y" : "N",
      point_yn: settings.points ? "Y" : "N",
      notification_yn: settings.notices ? "Y" : "N",
    }
  }
}
