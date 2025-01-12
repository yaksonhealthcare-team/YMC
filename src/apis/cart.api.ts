import { axiosClient } from "../queries/clients.ts"
import { CartItem, CartItemPostRequest, CartSummary } from "../types/Cart.ts"

//TODO: 실제 Cart API 연동
export const fetchCart = async () => {
  const { data } = await axiosClient.get<{
    cartList: CartItem[]
    cartList_summary: CartSummary
  }>("/carts/carts")
  return data
}

export const addCart = async (data: CartItemPostRequest[]) => {
  return await axiosClient.post("/carts/carts", {
    cartOptions: data,
  })
}

export const removeCart = async (id: number) => {
  return await axiosClient.delete(`/cart/${id}`)
}

export const updateCart = async (id: number, data: any) => {
  return await axiosClient.put(`/cart/${id}`, data)
}

export const fetchCartCount = async (): Promise<number> => {
  const { data } = await axiosClient.get("/carts/count")
  return Number(data.total_count)
}
