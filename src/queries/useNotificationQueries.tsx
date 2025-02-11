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
} from "../apis/notifications.api.ts"

export const useNotifications = (filters: NotificationFilters) => {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      fetchNotifications({
        page: pageParam,
        searchType: filters.searchType,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
    initialPageParam: 1,
  })
}

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

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ["unreadNotificationsCount"],
    queryFn: fetchUnreadNotificationsCount,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // 30초
  })
}
