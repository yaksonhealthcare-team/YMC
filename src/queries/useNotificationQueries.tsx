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
    retry: false,
  })
}

export const useNotificationSettings = () => {
  return useQuery({
    queryKey: ["notificationSettings"],
    queryFn: getNotificationSettings,
    retry: false,
  })
}

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] })
    },
    retry: false,
  })
}

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ["unreadNotificationsCount"],
    queryFn: async () => {
      try {
        const count = await fetchUnreadNotificationsCount()
        return count ?? 0
      } catch (error) {
        console.error("Failed to fetch unread notifications count:", error)
        return 0
      }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // 30초
    retry: false,
  })
}

export const useReadNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => Promise.reject(new Error("Not implemented")),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => Promise.reject(new Error("Not implemented")),
    enabled: false,
    retry: false,
  })
}
