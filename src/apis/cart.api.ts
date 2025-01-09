import { axiosClient } from "../queries/clients.ts"

//TODO: 실제 Cart API 연동
export const fetchCart = async () => {
  return await axiosClient.get("/cart")
}

export const addCart = async (data: any) => {
  return await axiosClient.post("/cart", data)
}

export const removeCart = async (id: number) => {
  return await axiosClient.delete(`/cart/${id}`)
}

export const updateCart = async (id: number, data: any) => {
  return await axiosClient.put(`/cart/${id}`, data)
}

export const fetchCartCount = async (): Promise<string> => {
  const { data } = await axiosClient.get("/carts/count")
  return data.total_count
}
