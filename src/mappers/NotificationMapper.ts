import { Notification, NotificationResponse, NotificationSettings, NotificationSettingsResponse } from "../types/Notification"

export class NotificationMapper {
  static toNotification(dto: NotificationResponse): Notification {
    return {
      readStatus: dto.is_read,
      mainCategory: dto.main_category,
      subCategory: dto.sub_category,
      title: dto.title,
      content: dto.content,
      pushDate: dto.push_date,
      reservationDate: dto.r_date,
      brandName: dto.b_name,
    }
  }

  static toNotifications(responses: NotificationResponse[]): Notification[] {
    return responses.map(this.toNotification)
  }

  static toNotificationSettings(response: NotificationSettingsResponse): NotificationSettings {
    return {
      reservations: response.reservation_yn === 'Y',
      payments: response.payment_yn === 'Y',
      points: response.point_yn === 'Y',
      notices: response.notification_yn === 'Y',
    }
  }

  static toUpdateSettingsRequest(settings: Partial<NotificationSettings>): Partial<NotificationSettingsResponse> {
    return {
      reservation_yn: settings.reservations ? 'Y' : 'N',
      payment_yn: settings.payments ? 'Y' : 'N',
      point_yn: settings.points ? 'Y' : 'N',
      notification_yn: settings.notices ? 'Y' : 'N',
    }
  }
}
