import { axiosClient } from "../queries/clients"
import { OrderResponse } from "../types/Payment"

export interface CreateAdditionalManagementOrderRequest {
  add_services: Array<{
    s_idx: string
    ss_idx: string
    amount: number
  }>
  b_idx: string
}

export const createAdditionalManagementOrder = async (
  data: CreateAdditionalManagementOrderRequest,
): Promise<OrderResponse> => {
  const response = await axiosClient.post<OrderResponse>(
    "/orders/additional-managements",
    data,
  )
  return response.data
}
