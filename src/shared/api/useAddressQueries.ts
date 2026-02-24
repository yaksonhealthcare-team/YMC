import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addAddressBookmark, deleteAddressBookmark, getAddressBookmarks, searchAddress } from './address.api';
import { addressKeys } from '@/shared/constants/queryKeys/keys/address.keys';
import { useOverlay } from '@/shared/ui/modal/ModalContext';

export const useAddressBookmarks = () => {
  return useQuery({
    queryKey: addressKeys.bookmarks(),
    queryFn: getAddressBookmarks,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
    retry: false
  });
};

export const useAddAddressBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAddressBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.bookmarks() });
    },
    retry: false
  });
};

export const useDeleteAddressBookmarkMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useOverlay();

  return useMutation({
    mutationFn: deleteAddressBookmark,
    onSuccess: (response) => {
      if (response.resultCode === '00') {
        showToast('자주 쓰는 주소가 삭제되었습니다.');
        queryClient.invalidateQueries({ queryKey: addressKeys.bookmarks() });
      } else {
        showToast('주소 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    },
    onError: () => {
      showToast('주소 삭제에 실패했습니다. 다시 시도해주세요.');
    },
    retry: false
  });
};

export const useAddressSearch = (keyword: string) => {
  return useQuery({
    queryKey: addressKeys.search(keyword),
    queryFn: () => searchAddress(keyword),
    enabled: keyword.length > 0,
    retry: false
  });
};
