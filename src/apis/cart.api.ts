import { axiosClient } from "../queries/clients.ts"
import {
  CartItemPostRequest,
  CartItemResponse,
  CartSummary,
  CartWithSummary,
} from "../types/Cart.ts"
import { CartMapper } from "../mappers/CartMapper.ts"

export const fetchCart = async (): Promise<CartWithSummary> => {
  const {
    data: { cartList, cartList_summary },
  } = await axiosClient.get<{
    cartList: CartItemResponse[]
    cartList_summary: CartSummary
  }>("/carts/carts")
  return { items: CartMapper.toEntities(cartList), summary: cartList_summary }
}

export const addCart = async (data: CartItemPostRequest[]) => {
  return await axiosClient.post("/carts/carts", {
    cartOptions: data,
  })
}

export const removeCart = async (cartIds: string[]) => {
  return await axiosClient.delete(`/carts/carts`, {
    data: {
      del_idxs: cartIds.map((id) => Number(id)),
    },
  })
}

export const updateCart = async (cartId: string, amount: number) => {
  return await axiosClient.patch(`/carts/carts`, {
    update_idx: Number(cartId),
    updateAmount: amount,
  })
}

export const fetchCartCount = async (): Promise<number> => {
  const { data } = await axiosClient.get("/carts/count")
  return Number(data.total_count)
}
