import { Notification, NotificationResponse } from "../types/Notification.ts"

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
}
