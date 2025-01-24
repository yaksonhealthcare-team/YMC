import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "./http.ts"
import { Event, EventDetail } from "types/Event"
import { Notice, NoticeDetail } from "../types/Content.ts"
import { ContentMapper } from "mappers/ContentMapper"

export const fetchEvents = async (): Promise<Event[]> => {
  const { data } = await axiosClient.get<HTTPResponse<Event[]>>(
    "/contents/contents",
    {
      params: {
        gubun: "E01",
        page: 1,
        status: "ALL",
      },
    },
  )
  return ContentMapper.toEvents(data.body)
}

export const fetchEventDetail = async (code: string): Promise<EventDetail> => {
  const { data } = await axiosClient.get<HTTPResponse<EventDetail[]>>(
    "/contents/detail",
    {
      params: {
        gubun: "E01",
        code,
      },
    },
  )
  return ContentMapper.toEventDetail(data.body[0])
}

export const fetchNotices = async (page: number = 1): Promise<Notice[]> => {
  const { data } = await axiosClient.get<HTTPResponse<Notice[]>>(
    "/contents/contents",
    {
      params: {
        gubun: "N01",
        page,
      },
    },
  )
  return ContentMapper.toNotices(data.body)
}

export const fetchNotice = async (code: string): Promise<NoticeDetail> => {
  const { data } = await axiosClient.get<HTTPResponse<NoticeDetail>>(
    "/contents/detail",
    {
      params: {
        gubun: "N01",
        code,
      },
    },
  )
  return ContentMapper.toNoticeDetail(data.body)
}
