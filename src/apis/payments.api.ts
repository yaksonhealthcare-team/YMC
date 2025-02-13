import {
  PaymentHistoryDetailResponse,
  PaymentHistoryResponse,
  PaymentCancelRequest,
  PaymentResponse,
  PaymentRequest,
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

export const cancelPayments = async (
  orderId: string,
  paymentIds: string[],
  reason: string,
) => {
  await axiosClient.post("/payments/cancel", {
    orderid: orderId,
    p_idx: paymentIds,
    cancel_memo: reason,
  })
}

export const cancelVirtualAccountPayment = async (
  request: PaymentCancelRequest,
) => {
  await axiosClient.post("/payments/cancel", request)
}

export const fetchBankList = async () => {
  const { data } = await axiosClient.get<
    HTTPResponse<Array<{ code: string; name: string }>>
  >("/payments/request_bankList")
  return data.body
}

export const requestPayment = async (paymentData: PaymentRequest) => {
  const { data } = await axiosClient.post<PaymentResponse>(
    "/payments/request",
    paymentData,
  )

  if (data.resultCode !== "00") {
    throw new Error(data.resultMessage)
  }

  return data.body
}
