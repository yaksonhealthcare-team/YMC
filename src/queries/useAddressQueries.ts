import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addAddressBookmark,
  deleteAddressBookmark,
  getAddressBookmarks,
  searchAddress,
} from "../apis/address.api"
import { addressKeys } from "./keys/address.keys"
import { Location } from "../types/Location"

export const useAddressBookmarks = () => {
  return useQuery({
    queryKey: addressKeys.bookmarks(),
    queryFn: getAddressBookmarks,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
    retry: false,
  })
}

export const useAddAddressBookmarkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addAddressBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.bookmarks() })
    },
    retry: false,
  })
}

export const useDeleteAddressBookmarkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAddressBookmark,
    onMutate: async (csab_idx) => {
      queryClient.setQueryData<Location[]>(
        addressKeys.bookmarks(),
        (old) =>
          old?.filter((bookmark) => bookmark.csab_idx !== csab_idx) ?? [],
      )
    },
    retry: false,
  })
}

export const useAddressSearch = (keyword: string) => {
  return useQuery({
    queryKey: addressKeys.search(keyword),
    queryFn: () => searchAddress(keyword),
    enabled: keyword.length > 0,
    retry: false,
  })
}

// TODO: API 구현 후 수정
export const useAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => Promise.reject(new Error("Not implemented")),
    enabled: false,
    retry: false,
  })
}

// TODO: API 구현 후 수정
export const useCreateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => Promise.reject(new Error("Not implemented")),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
    },
  })
}

// TODO: API 구현 후 수정
export const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => Promise.reject(new Error("Not implemented")),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
    },
  })
}

// TODO: API 구현 후 수정
export const useDefaultAddress = () => {
  return useQuery({
    queryKey: ["addresses", "default"],
    queryFn: () => Promise.reject(new Error("Not implemented")),
    enabled: false,
    retry: false,
  })
}
