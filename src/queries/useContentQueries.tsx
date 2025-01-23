import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import {
  fetchEvent,
  fetchEvents,
  fetchNotice,
  fetchNotices,
} from "../apis/contents.api.ts"
import { EventStatus } from "../types/Content.ts"

export const useEvents = (status: EventStatus) =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.events.list({ page: 1, status }),
    queryFn: ({ pageParam = 1 }) => fetchEvents(status, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

export const useEvent = (id: string) =>
  useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => fetchEvent(id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

// 홈 화면의 공지사항 슬라이더용 (첫 페이지만)
export const useNoticesSummary = () =>
  useQuery({
    queryKey: queryKeys.notices.list({ page: 1 }),
    queryFn: () => fetchNotices(1),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })

// 공지사항 목록 페이지용 (무한 스크롤)
export const useNotices = () =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.notices.list({ page: 1 }),
    queryFn: ({ pageParam = 1 }) => fetchNotices(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

export const useNotice = (id: string) =>
  useQuery({
    queryKey: queryKeys.notices.detail(id),
    queryFn: () => fetchNotice(id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
