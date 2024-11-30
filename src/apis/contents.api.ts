import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { Event, EventDetail, Notice, NoticeDetail } from "../types/Content.ts"

export const fetchEvents = async (
  status: "ALL" | "ING" | "END" | "TBD",
  page: number,
): Promise<Event[]> => {
  const { data } = await axiosClient.get<HTTPResponse<Event[]>>(
    "/contents/contents",
    {
      params: { gubun: "E01", page, status },
    },
  )

  return data.body
}

export const fetchEvent = async (id: string): Promise<EventDetail> => {
  const { data } = await axiosClient.get<HTTPResponse<EventDetail[]>>(
    "/contents/detail",
    {
      params: {
        gubun: "E01",
        code: id,
      },
    },
  )

  return data.body[0]
}

export const fetchNotices = async (page: number): Promise<Notice[]> => {
  const { data } = await axiosClient.get<HTTPResponse<Notice[]>>(
    "/contents/contents/",
    {
      params: {
        gubun: "N01",
        page,
      },
    },
  )

  return data.body
}

export const fetchNotice = async (id: string): Promise<NoticeDetail> => {
  const { data } = await axiosClient.get<HTTPResponse<NoticeDetail>>(
    "/contents/detail/",
    {
      params: {
        gubun: "N01",
        code: id,
      },
    },
  )

  return data.body
}
