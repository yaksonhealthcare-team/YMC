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
  })

export const useEvent = (id: string) =>
  useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => fetchEvent(id),
  })

export const useNotices = () =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: queryKeys.notices.list({ page: 1 }),
    queryFn: ({ pageParam = 1 }) => fetchNotices(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined
      return allPages.length + 1
    },
  })

export const useNotice = (id: string) =>
  useQuery({
    queryKey: queryKeys.notices.detail(id),
    queryFn: () => fetchNotice(id),
  })
