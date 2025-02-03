import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { NotificationFilters } from "../types/Notification.ts"
import { fetchNotifications, getNotificationSettings } from "../apis/notifications.api.ts"

export const useNotifications = (filters: NotificationFilters) =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.notifications.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      fetchNotifications({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
  })

export const useNotificationSettings = () => {
  return useQuery({
    queryKey: ["notificationSettings"],
    queryFn: getNotificationSettings,
  })
}
