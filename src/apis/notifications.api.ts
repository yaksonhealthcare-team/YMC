import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import {
  NotificationFilters,
  NotificationResponse,
  NotificationSettings,
  NotificationSettingsResponse,
} from "../types/Notification.ts"
import { NotificationMapper } from "../mappers/NotificationMapper"

export const fetchNotifications = async (filters: NotificationFilters) => {
  const { data } = await axiosClient.get<HTTPResponse<NotificationResponse[]>>(
    "/notifications/notifications",
    {
      params: {
        page: filters.page,
        search_type: filters.searchType,
      },
    },
  )

  return NotificationMapper.toNotifications(data.body)
}

export const getNotificationSettings =
  async (): Promise<NotificationSettings> => {
    const { data } = await axiosClient.get<
      HTTPResponse<NotificationSettingsResponse[]>
    >("/notifications/settings")
    return NotificationMapper.toNotificationSettings(data.body[0])
  }

export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>,
): Promise<NotificationSettings> => {
  const { data } = await axiosClient.patch<
    HTTPResponse<NotificationSettingsResponse[]>
  >(
    "/notifications/settings",
    NotificationMapper.toUpdateSettingsRequest(settings),
  )
  return NotificationMapper.toNotificationSettings(data.body[0])
}

export const fetchUnreadNotificationsCount = async () => {
  const { data } = await axiosClient.get<HTTPResponse<NotificationResponse[]>>(
    "/notifications/notifications",
    {
      params: {
        page: 1,
      },
    },
  )

  return data.body.filter((notification) => notification.is_read === "안읽음")
    .length
}

export const updateNotificationReadStatus = async (
  notificationIds: number[],
) => {
  const { data } = await axiosClient.patch<HTTPResponse<any>>(
    "/notifications/read-status",
    {
      notification_ids: notificationIds,
    },
  )
  return data
}
