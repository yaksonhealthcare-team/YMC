import { axiosClient } from "../queries/clients.ts"
import { Location } from "../types/Location"

export interface AddressSearchResult {
  title: string
  address: string
  latitude: number
  longitude: number
}

export interface AddressBookmark {
  id: string
  address: string
  latitude: number
  longitude: number
  isBaseAddress: boolean
}

interface AddressBookmarkResponse {
  resultCode: string
  resultMessage: string
  resultCount: number
  body: Array<{
    csab_idx: string
    address: string
    lat: string
    lon: string
    base_address: "Y" | "N"
  }>
}

interface AddressBookmarkAddResponse {
  resultCode: string
  resultMessage: string
  resultCount: number
  body: null
}

interface AddressBookmarkDeleteResponse {
  resultCode: string
  resultMessage: string
  resultCount: number
  body: null
}

export const searchAddress = async (keyword: string): Promise<Location[]> => {
  const { data } = await axiosClient.get("/address/search", {
    params: {
      keyword,
    },
  })

  return data.body.map((item: Record<string, any>) => ({
    address: item.address || "",
    lat: item.lat || "0",
    lon: item.lon || "0",
  }))
}

export const getAddressBookmarks = async (): Promise<Location[]> => {
  const { data } =
    await axiosClient.get<AddressBookmarkResponse>("/address/bookmarks")
  return data.body
}

export const addAddressBookmark = async (
  bookmark: Omit<Location, "csab_idx">,
): Promise<AddressBookmarkAddResponse> => {
  const { data } = await axiosClient.post<AddressBookmarkAddResponse>(
    "/address/bookmarks",
    bookmark,
  )
  return data
}

export const deleteAddressBookmark = async (
  csab_idx: string,
): Promise<AddressBookmarkDeleteResponse> => {
  const { data } = await axiosClient.delete<AddressBookmarkDeleteResponse>(
    `/address/bookmarks?csab_idx=${csab_idx}`,
  )
  return data
}
