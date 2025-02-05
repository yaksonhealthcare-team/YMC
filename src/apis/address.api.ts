import { axiosClient } from "../queries/clients.ts"

export interface AddressSearchResult {
  title: string
  address: string
  latitude: number
  longitude: number
}

export const searchAddress = async (
  keyword: string,
): Promise<AddressSearchResult[]> => {
  const { data } = await axiosClient.get("/address/search", {
    params: {
      keyword,
    },
  })

  return data.body.map((item: any) => ({
    title: item.place_name || "",
    address: item.address || "",
    latitude: parseFloat(item.lat) || 0,
    longitude: parseFloat(item.lon) || 0,
  }))
}
