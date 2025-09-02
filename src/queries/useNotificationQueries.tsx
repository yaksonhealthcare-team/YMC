import { UserSchema } from '@/_domain/auth';
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  fetchUnreadNotificationsCount,
  getNotificationSettings,
  updateNotificationSettings
} from '../apis/notifications.api';
import { Notification, NotificationFilters } from '../types/Notification';
import { queryKeys } from './query.keys';

export const useNotifications = (filters: NotificationFilters) => {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      fetchNotifications({
        page: pageParam,
        searchType: filters.searchType
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    retry: false
  });
};

export const useNotificationSettings = () => {
  return useQuery({
    queryKey: ['notificationSettings'],
    queryFn: getNotificationSettings,
    retry: false
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
    },
    retry: false
  });
};

export const useUnreadNotificationsCount = (user: UserSchema | null) => {
  return useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: async () => {
      try {
        const count = await fetchUnreadNotificationsCount();
        return count ?? 0;
      } catch (error) {
        console.error('Failed to fetch unread notifications count:', error);
        return 0;
      }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // 30초
    retry: false,
    enabled: !!user
  });
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: number) => {
      // 실제 API 호출 없이 클라이언트 측 캐시만 업데이트
      return notificationId;
    },
    onSuccess: (notificationId) => {
      // 알림 목록 캐시 업데이트
      queryClient.setQueriesData(
        { queryKey: ['notifications'] },
        (oldData: InfiniteData<Notification[]> | undefined) => {
          if (!oldData) return oldData;

          // pages 속성이 있는 무한 쿼리 데이터 처리
          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: Notification[]) =>
                page.map((notification) =>
                  notification.id === notificationId ? { ...notification, isRead: true } : notification
                )
              )
            };
          }
          return oldData;
        }
      );

      // 읽지 않은 알림 수 캐시 업데이트
      queryClient.setQueryData(['unreadNotificationsCount'], (oldCount: number | undefined) => {
        return Math.max(0, (oldCount || 0) - 1);
      });
    },
    retry: false
  });
};
