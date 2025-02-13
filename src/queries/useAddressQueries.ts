import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addAddressBookmark,
  deleteAddressBookmark,
  getAddressBookmarks,
  searchAddress,
} from "../apis/address.api"
import { addressKeys } from "./keys/address.keys"
import { AddressBookmark } from "../apis/address.api"

export const useAddressBookmarks = () => {
  return useQuery({
    queryKey: addressKeys.bookmarks(),
    queryFn: getAddressBookmarks,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
  })
}

export const useAddAddressBookmarkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addAddressBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.bookmarks() })
    },
  })
}

export const useDeleteAddressBookmarkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAddressBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.bookmarks() })
    },
  })
}

export const useAddressSearch = (keyword: string) => {
  return useQuery({
    queryKey: addressKeys.search(keyword),
    queryFn: () => searchAddress(keyword),
    enabled: keyword.length > 0,
  })
}
