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
): Promise<void> => {
  await axiosClient.post("/address/bookmarks", bookmark)
}

export const deleteAddressBookmark = async (
  csab_idx: string,
): Promise<void> => {
  await axiosClient.delete(`/address/bookmarks`, {
    data: { csab_idx },
  })
}
