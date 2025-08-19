import { useQuery } from '@tanstack/react-query';
import { fetchNotice, fetchNotices, fetchPopupDetail, fetchPopups } from '../apis/contents.api';
import { queryKeys } from './query.keys';

// 홈 화면의 공지사항 슬라이더용 (첫 페이지만)
export const useNoticesSummary = () =>
  useQuery({
    queryKey: queryKeys.notices.list({ page: 1 }),
    queryFn: () => fetchNotices(1),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: false
  });

export const useNotice = (code: string) => {
  return useQuery({
    queryKey: ['notice', code],
    queryFn: () => fetchNotice(code),
    enabled: !!code,
    retry: false
  });
};

export const useStartupPopups = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.popups.startup,
    queryFn: fetchPopups,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options
  });
};

export const usePopupDetail = (code: string, options = {}) => {
  return useQuery({
    queryKey: [...queryKeys.popups.startup, code],
    queryFn: () => fetchPopupDetail(code),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!code,
    ...options
  });
};
