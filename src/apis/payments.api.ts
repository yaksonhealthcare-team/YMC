import {
  PaymentHistoryDetailResponse,
  PaymentHistoryResponse,
} from "types/Payment.ts"
import { PaymentMapper } from "../mappers/PaymentMapper.ts"
import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"

export const fetchPayments = async ({ page }: { page: number }) => {
  const { data } = await axiosClient.get<
    HTTPResponse<PaymentHistoryResponse[]>
  >("/payments/history", {
    params: { page: page },
  })

  return PaymentMapper.toHistoryEntities(data.body)
}

export const fetchPayment = async (paymentId: string) => {
  const { data } = await axiosClient.get<
    HTTPResponse<PaymentHistoryDetailResponse>
  >("/payments/detail", {
    params: {
      p_idx: paymentId,
    },
  })

  return PaymentMapper.toHistoryDetailEntity(data.body)
}
