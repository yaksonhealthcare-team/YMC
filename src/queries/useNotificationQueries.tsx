import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { NotificationFilters } from "../types/Notification.ts"
import {
  fetchNotifications,
  getNotificationSettings,
  updateNotificationSettings,
  fetchUnreadNotificationsCount,
  updateNotificationReadStatus,
} from "../apis/notifications.api.ts"

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

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] })
    },
  })
}

export const useUpdateNotificationReadStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateNotificationReadStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.list({}),
      })
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] })
    },
  })
}

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ["unreadNotificationsCount"],
    queryFn: fetchUnreadNotificationsCount,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // 30초
  })
}
