import { useMutation, useQuery } from "@tanstack/react-query"
import { queryKeys } from "./query.keys.ts"
import { fetchCart, removeCart, updateCart } from "../apis/cart.api.ts"
import { queryClient } from "./clients.ts"

export const useCartItems = () =>
  useQuery({
    queryKey: queryKeys.carts.all,
    queryFn: fetchCart,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })

export const useDeleteCartItemsMutation = () =>
  useMutation({
    mutationFn: (cartIds: string[]) => removeCart(cartIds),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.carts.all,
      })
    },
  })

export const useUpdateCartItemMutation = () =>
  useMutation({
    mutationFn: ({ cartId, amount }: { cartId: string; amount: number }) =>
      updateCart(cartId, amount),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.carts.all,
      })
    },
  })
