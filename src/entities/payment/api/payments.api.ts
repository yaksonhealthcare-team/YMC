import { authApi } from '@/_shared';
import { PaymentMapper } from '@/entities/payment/lib/PaymentMapper';
import { HTTPResponse } from '@/shared/types/HTTPResponse';
import { PaymentHistoryDetailResponse, PaymentHistoryResponse } from '@/entities/payment/model/Payment';

export const fetchPayments = async ({ page }: { page: number }) => {
  const { data } = await authApi.get<HTTPResponse<PaymentHistoryResponse[]>>('/payments/history', {
    params: { page: page }
  });

  return PaymentMapper.toHistoryEntities(data.body, data.total_page_count);
};

export const fetchPayment = async (paymentId: string) => {
  const { data } = await authApi.get<HTTPResponse<PaymentHistoryDetailResponse>>('/payments/detail', {
    params: {
      p_idx: paymentId
    }
  });

  return PaymentMapper.toHistoryDetailEntity(data.body);
};

export const cancelPayments = async (orderId: string, paymentIds: string[], reason: string) => {
  await authApi.post('/payments/cancel', {
    orderid: orderId,
    p_idx: paymentIds,
    cancel_memo: reason
  });
};
