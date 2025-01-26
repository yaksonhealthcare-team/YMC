import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import {
  NotificationFilters,
  NotificationResponse,
} from "../types/Notification.ts"
import { NotificationMapper } from "../mappers/NotificationMapper.ts"

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
