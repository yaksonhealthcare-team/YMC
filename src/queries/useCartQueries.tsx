import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCart, removeCart, updateCart } from '../apis/cart.api';
import { queryKeys } from './query.keys';

export const useCartItems = () =>
  useQuery({
    queryKey: queryKeys.carts.all,
    queryFn: fetchCart,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: false
  });

export const useDeleteCartItemsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartIds: string[]) => removeCart(cartIds),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.carts.all
      });
    },
    retry: false
  });
};

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartId, amount }: { cartId: string; amount: number }) => updateCart(cartId, amount),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.carts.all
      });
    },
    retry: false
  });
};
