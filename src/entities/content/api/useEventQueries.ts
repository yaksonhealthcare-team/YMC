import { fetchEventDetail, fetchEvents } from '@/entities/content/api/contents.api';
import { Tab } from '@/entities/content/model/Event';
import { useQuery } from '@tanstack/react-query';

export const useEvents = (status: Tab = 'ALL') => {
  return useQuery({
    queryKey: ['events', status],
    queryFn: () => fetchEvents(status),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: false // 재시도 비활성화
  });
};

export const useEventDetail = (code: string) => {
  return useQuery({
    queryKey: ['event', code],
    queryFn: () => fetchEventDetail(code),
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false
  });
};
