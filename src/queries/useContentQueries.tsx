import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './query.keys.ts';
import { fetchNotice, fetchNotices, fetchPopups, fetchPopupDetail } from '../apis/contents.api.ts';

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

// 공지사항 목록 페이지용 (무한 스크롤)
export const useNotices = () => {
  return useQuery({
    queryKey: ['notices'],
    queryFn: () => fetchNotices(),
    retry: false
  });
};

export const useNotice = (code: string) => {
  return useQuery({
    queryKey: ['notice', code],
    queryFn: () => fetchNotice(code),
    enabled: !!code,
    retry: false
  });
};

export const useContent = (id: number) => {
  return useQuery({
    queryKey: ['contents', id],
    queryFn: () => Promise.reject(new Error('Not implemented')),
    enabled: false,
    retry: false
  });
};

export const useContents = () => {
  return useQuery({
    queryKey: ['contents'],
    queryFn: () => Promise.reject(new Error('Not implemented')),
    enabled: false,
    retry: false
  });
};

export const useContentsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['contents', 'category', category],
    queryFn: () => Promise.reject(new Error('Not implemented')),
    enabled: false,
    retry: false
  });
};

// Query hook for fetching startup popups
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

// Query hook for fetching a single popup detail
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
