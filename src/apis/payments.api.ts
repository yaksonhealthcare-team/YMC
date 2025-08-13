import { authApi } from '@/_shared';
import { PaymentMapper } from '@/mappers/PaymentMapper';
import { HTTPResponse } from '@/types/HTTPResponse';
import {
  PaymentCancelRequest,
  PaymentHistoryDetailResponse,
  PaymentHistoryResponse,
  PaymentRequest,
  PaymentResponse
} from '@/types/Payment';

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

export const cancelVirtualAccountPayment = async (request: PaymentCancelRequest) => {
  await authApi.post('/payments/cancel', request);
};

export const fetchBankList = async () => {
  const { data } = await authApi.get<HTTPResponse<Array<{ code: string; name: string }>>>('/payments/request_bankList');
  return data.body;
};

export const requestPayment = async (paymentData: PaymentRequest) => {
  const { data } = await authApi.post<PaymentResponse>('/payments/request', paymentData);

  if (data.resultCode !== '00') {
    throw new Error(data.resultMessage);
  }

  return data.body;
};
