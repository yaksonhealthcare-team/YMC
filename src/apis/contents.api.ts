import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { Event, EventDetail } from "types/Event"
import { Notice, NoticeDetail, PopupDetail } from "../types/Content.ts"
import { ContentMapper } from "mappers/ContentMapper"
import { Tab } from "types/Event"

export const fetchEvents = async (status: Tab = "ALL"): Promise<Event[]> => {
  const { data } = await axiosClient.get<HTTPResponse<Event[]>>(
    "/contents/contents",
    {
      params: {
        gubun: "E01",
        page: 1,
        status,
      },
    },
  )
  return ContentMapper.toEvents(data.body || [])
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

export const fetchNotices = async (
  page: number = 1,
): Promise<{
  notices: Notice[]
  pageInfo: { totalPages: number; currentPage: number }
}> => {
  const { data } = await axiosClient.get<HTTPResponse<Notice[]>>(
    "/contents/contents",
    {
      params: {
        gubun: "N01",
        page,
      },
    },
  )
  return {
    notices: ContentMapper.toNotices(data.body),
    pageInfo: {
      totalPages: Number(data.total_page_count),
      currentPage: Number(data.current_page),
    },
  }
}

export const fetchNotice = async (code: string): Promise<NoticeDetail> => {
  const { data } = await axiosClient.get<HTTPResponse<NoticeDetail[]>>(
    "/contents/detail",
    {
      params: {
        gubun: "N01",
        code,
      },
    },
  )
  if (!data.body || !data.body.length) {
    throw new Error("Notice not found")
  }
  return ContentMapper.toNoticeDetail(data.body[0])
}

// Updated ApiPopupItem based on actual response
interface ApiPopupItem {
  code: string
  gubun: string
  title: string
  sdate: string
  edate: string
  status: string
  files?: {
    // files array is optional
    fileCode: string
    fileurl: string
  }[]
  // linkUrl is not present in the provided example
}

// Define the structure expected by our application (Zustand store)
export interface AppPopupData {
  code: string
  imageUrl: string
  linkUrl?: string // Keep optional linkUrl for future use
}

// Function to fetch popup data
export const fetchPopups = async (): Promise<AppPopupData[]> => {
  // Use axiosClient and the standard HTTPResponse type
  const response = await axiosClient.get<HTTPResponse<ApiPopupItem[]>>(
    "/contents/popup?status=ING",
  )

  // Extract the popup array from response.data.body
  const apiPopups = response.data.body || []

  // Map the API data to the format required by the application
  const appPopups = apiPopups
    .map((item: ApiPopupItem): AppPopupData | null => {
      // Get image URL from the first file, if files exist
      const imageUrl = item.files?.[0]?.fileurl

      // Only include the popup if we have an image URL
      if (imageUrl) {
        return {
          code: item.code,
          imageUrl: imageUrl,
          linkUrl: undefined, // Set linkUrl to undefined for now
          // We could potentially derive a link like /event/${item.code} later
        }
      }
      return null // Exclude items without a valid image URL
    })
    // Filter out any null entries resulting from missing image URLs
    .filter((item): item is AppPopupData => item !== null)

  return appPopups
}

// Function to fetch popup detail data
export const fetchPopupDetail = async (code: string): Promise<PopupDetail> => {
  // Use the provided endpoint structure
  const { data } = await axiosClient.get<HTTPResponse<PopupDetail[]>>(
    "/contents/detail",
    {
      params: {
        gubun: "E01", // Assuming E01 is the correct gubun for popups
        code,
      },
    },
  )

  // Assuming the detail API also returns an array with one item
  if (!data.body || data.body.length === 0) {
    throw new Error("Popup detail not found")
  }

  // We might need a mapper if the API structure differs significantly
  // For now, assume the first item matches PopupDetail type
  return data.body[0]
}
