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
    retry: (failureCount, error: any) => {
      // resultCode가 "25"인 경우 재시도하지 않음 (장바구니가 비어있는 경우)
      if (error?.response?.data?.resultCode === "25") {
        return false
      }
      // 그 외의 경우 기본 재시도 정책을 따름 (3번까지 재시도)
      return failureCount < 1
    },
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
