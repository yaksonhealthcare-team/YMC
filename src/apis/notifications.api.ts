import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import {
  NotificationResponse,
  NotificationSettings,
  NotificationSettingsResponse,
} from "../types/Notification.ts"
import { NotificationMapper } from "../mappers/NotificationMapper.ts"

export const fetchNotifications = async (params: {
  page: number
  searchType?: string
}) => {
  const { data } = await axiosClient.get<HTTPResponse<NotificationResponse[]>>(
    "/notifications/notifications",
    {
      params: {
        page: params.page,
        search_type: params.searchType,
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
  const { data } = await axiosClient.get<
    HTTPResponse<{ unread_count: string }>
  >("/notifications/unread-count")
  return parseInt(data.body.unread_count, 10) || 0
}
