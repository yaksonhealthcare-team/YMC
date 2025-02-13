import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAddressBookmark } from "../apis/address.api"
import { addressKeys } from "./keys/address.keys"

export const useDeleteAddressBookmarkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAddressBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.bookmarks() })
    },
  })
}
