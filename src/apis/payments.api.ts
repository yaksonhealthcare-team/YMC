import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/dtos/HTTPResponse.ts"
import { PaymentHistoryDTO } from "../types/dtos/PaymentDTO.ts"
import { PaymentMapper } from "../types/dtos/mapper/PaymentMapper.ts"

export const fetchPayments = async ({ page }: { page: number }) => {
  const { data } = await axiosClient.get<HTTPResponse<PaymentHistoryDTO[]>>(
    "/payments/history",
    {
      params: { page: page },
    },
  )

  return PaymentMapper.toHistoryEntities(data.body)
}
